import  Purchase  from '../models/purchase.models.js';
import  Transfer  from '../models/transfer.models.js';
import  Assignment  from '../models/assignment.models.js';
import  Expenditure  from '../models/expenditure.models.js';
import Base from '../models/base.models.js';
import Equipment from '../models/equipment.models.js';
export const getMetrics = async(req ,res) =>{
    		try {
			const { start, end, base_id } = req.query;
			

			const dateFilter = (field) => ({
				...(start ? { [field]: { $gte: new Date(start) } } : {}),
				...(end ? { [field]: { 
					...(start ? { $gte: new Date(start) } : {}), 
					$lte: new Date(end) 
				} } : {})
			});

			// Base filter for ObjectId
			const baseFilter = base_id ? new mongoose.Types.ObjectId(base_id) : null;

			// Purchases total
			const purchasesTotal = await Purchase.aggregate([
				{ 
					$match: { 
						...(baseFilter ? { base: baseFilter } : {}), 
						...(start || end ? dateFilter('purchasedAt') : {}) 
					} 
				},
				{ $group: { _id: null, total: { $sum: '$quantity' } } }
			]).then(r => (r[0]?.total || 0));

			// Transfer In
			const transferIn = await Transfer.aggregate([
				{ 
					$match: { 
						...(baseFilter ? { toBase: baseFilter } : {}), 
						...(start || end ? dateFilter('transferredAt') : {}) 
					} 
				},
				{ $group: { _id: null, total: { $sum: '$quantity' } } }
			]).then(r => (r[0]?.total || 0));

			// Transfer Out
			const transferOut = await Transfer.aggregate([
				{ 
					$match: { 
						...(baseFilter ? { fromBase: baseFilter } : {}), 
						...(start || end ? dateFilter('transferredAt') : {}) 
					} 
				},
				{ $group: { _id: null, total: { $sum: '$quantity' } } }
			]).then(r => (r[0]?.total || 0));

			// Assigned
			const assigned = await Assignment.aggregate([
				{ 
					$match: { 
						...(baseFilter ? { base: baseFilter } : {}), 
						...(start || end ? dateFilter('assignedAt') : {}) 
					} 
				},
				{ $group: { _id: null, total: { $sum: '$quantity' } } }
			]).then(r => (r[0]?.total || 0));

			// Expended
			const expended = await Expenditure.aggregate([
				{ 
					$match: { 
						...(baseFilter ? { base: baseFilter } : {}), 
						...(start || end ? dateFilter('expendedAt') : {}) 
					} 
				},
				{ $group: { _id: null, total: { $sum: '$quantity' } } }
			]).then(r => (r[0]?.total || 0));

			const netMovement = purchasesTotal + transferIn - transferOut;

			// Get opening and closing balances
			let openingBalance = 0;
			let closingBalance = 0;

			if (baseFilter) {
				// Get the most recent balance for the base
				const latestBalance = await Balance.findOne({ base: baseFilter })
					.sort({ date: -1 })
					.populate('equipment');

				if (latestBalance) {
					openingBalance = latestBalance.openingBalance;
					closingBalance = latestBalance.closingBalance;
				} else {
					// If no balance record exists, calculate from current data
					openingBalance = 0;
					closingBalance = netMovement - assigned - expended;
				}
			}

			res.json({ 
				metrics: { 
					openingBalance,
					closingBalance,
					netMovement,
					purchases: purchasesTotal, 
					transferIn, 
					transferOut, 
					assigned, 
					expended,
					// Detailed breakdown for pop-up display
					detailedMovement: {
						purchases: purchasesTotal,
						transfersIn: transferIn,
						transfersOut: transferOut,
						netMovement: netMovement,
						assigned: assigned,
						expended: expended
					}
				} 
			});
		} catch (error) {
			console.error('Get dashboard metrics error:', error);
			return res.status(500).json({ error: 'Internal server error' });
		}
	}
export const getDetailedMovement=async (req, res) =>{
		try {
			const { base_id, equipment_id, start, end } = req.query;


			const dateFilter = (field) => ({
				...(start ? { [field]: { $gte: new Date(start) } } : {}),
				...(end ? { [field]: { 
					...(start ? { $gte: new Date(start) } : {}), 
					$lte: new Date(end) 
				} } : {})
			});

			const baseFilter = base_id ? new mongoose.Types.ObjectId(base_id) : null;
			const equipmentFilter = equipment_id ? new mongoose.Types.ObjectId(equipment_id) : null;

			// Get detailed purchases
			const purchases = await Purchase.find({
				...(baseFilter ? { base: baseFilter } : {}),
				...(equipmentFilter ? { equipment: equipmentFilter } : {}),
				...(start || end ? dateFilter('purchasedAt') : {})
			}).populate('base equipment').sort({ purchasedAt: -1 });

			// Get detailed transfers in
			const transfersIn = await Transfer.find({
				...(baseFilter ? { toBase: baseFilter } : {}),
				...(equipmentFilter ? { equipment: equipmentFilter } : {}),
				...(start || end ? dateFilter('transferredAt') : {})
			}).populate('fromBase toBase equipment').sort({ transferredAt: -1 });

			// Get detailed transfers out
			const transfersOut = await Transfer.find({
				...(baseFilter ? { fromBase: baseFilter } : {}),
				...(equipmentFilter ? { equipment: equipmentFilter } : {}),
				...(start || end ? dateFilter('transferredAt') : {})
			}).populate('fromBase toBase equipment').sort({ transferredAt: -1 });

			// Get detailed assignments
			const assignments = await Assignment.find({
				...(baseFilter ? { base: baseFilter } : {}),
				...(equipmentFilter ? { equipment: equipmentFilter } : {}),
				...(start || end ? dateFilter('assignedAt') : {})
			}).populate('base equipment').sort({ assignedAt: -1 });

			// Get detailed expenditures
			const expenditures = await Expenditure.find({
				...(baseFilter ? { base: baseFilter } : {}),
				...(equipmentFilter ? { equipment: equipmentFilter } : {}),
				...(start || end ? dateFilter('expendedAt') : {})
			}).populate('base equipment').sort({ expendedAt: -1 });

			res.json({
				purchases: purchases.map(p => ({
					id: String(p._id),
					base_name: p.base.name,
					equipment_name: p.equipment.name,
					quantity: p.quantity,
					date: p.purchasedAt
				})),
				transfersIn: transfersIn.map(t => ({
					id: String(t._id),
					from_base: t.fromBase.name,
					to_base: t.toBase.name,
					equipment_name: t.equipment.name,
					quantity: t.quantity,
					date: t.transferredAt
				})),
				transfersOut: transfersOut.map(t => ({
					id: String(t._id),
					from_base: t.fromBase.name,
					to_base: t.toBase.name,
					equipment_name: t.equipment.name,
					quantity: t.quantity,
					date: t.transferredAt
				})),
				assignments: assignments.map(a => ({
					id: String(a._id),
					base_name: a.base.name,
					equipment_name: a.equipment.name,
					assigned_to: a.assignedTo,
					quantity: a.quantity,
					date: a.assignedAt
				})),
				expenditures: expenditures.map(e => ({
					id: String(e._id),
					base_name: e.base.name,
					equipment_name: e.equipment.name,
					quantity: e.quantity,
					date: e.expendedAt
				}))
			});

		} catch (error) {
			console.error('Get detailed movement error:', error);
			return res.status(500).json({ error: 'Internal server error' });
		}
	}