import { connectMongo } from '../lib/db.js';
import { Balance } from '../models/Balance.js';
import { Purchase } from '../models/Purchase.js';
import { Transfer } from '../models/Transfer.js';
import { Assignment } from '../models/Assignment.js';
import { Expenditure } from '../models/Expenditure.js';
import { Base } from '../models/Base.js';
import { Equipment } from '../models/Equipment.js';

export const balanceController = {
	// Calculate and update balances for a specific date range
	async calculateBalances(req, res) {
		try {
			const { base_id, equipment_id, start_date, end_date } = req.body;
			
			if (!base_id || !equipment_id) {
				return res.status(400).json({ 
					error: 'base_id and equipment_id are required' 
				});
			}

			await connectMongo();

			// Validate that base and equipment exist
			const base = await Base.findById(base_id);
			const equipment = await Equipment.findById(equipment_id);
			
			if (!base) {
				return res.status(400).json({ error: 'Base not found' });
			}
			
			if (!equipment) {
				return res.status(400).json({ error: 'Equipment not found' });
			}

			// Get opening balance (from previous period or initial)
			const previousBalance = await Balance.findOne({
				base: base_id,
				equipment: equipment_id
			}).sort({ date: -1 });

			const openingBalance = previousBalance ? previousBalance.closingBalance : 0;

			// Calculate movements for the period
			const dateFilter = {};
			if (start_date) dateFilter.$gte = new Date(start_date);
			if (end_date) dateFilter.$lte = new Date(end_date);

			// Purchases
			const purchases = await Purchase.aggregate([
				{
					$match: {
						base: base_id,
						equipment: equipment_id,
						...(Object.keys(dateFilter).length > 0 ? { purchasedAt: dateFilter } : {})
					}
				},
				{ $group: { _id: null, total: { $sum: '$quantity' } } }
			]);
			const purchasesTotal = purchases[0]?.total || 0;

			// Transfers In
			const transfersIn = await Transfer.aggregate([
				{
					$match: {
						toBase: base_id,
						equipment: equipment_id,
						...(Object.keys(dateFilter).length > 0 ? { transferredAt: dateFilter } : {})
					}
				},
				{ $group: { _id: null, total: { $sum: '$quantity' } } }
			]);
			const transfersInTotal = transfersIn[0]?.total || 0;

			// Transfers Out
			const transfersOut = await Transfer.aggregate([
				{
					$match: {
						fromBase: base_id,
						equipment: equipment_id,
						...(Object.keys(dateFilter).length > 0 ? { transferredAt: dateFilter } : {})
					}
				},
				{ $group: { _id: null, total: { $sum: '$quantity' } } }
			]);
			const transfersOutTotal = transfersOut[0]?.total || 0;

			// Assigned
			const assigned = await Assignment.aggregate([
				{
					$match: {
						base: base_id,
						equipment: equipment_id,
						...(Object.keys(dateFilter).length > 0 ? { assignedAt: dateFilter } : {})
					}
				},
				{ $group: { _id: null, total: { $sum: '$quantity' } } }
			]);
			const assignedTotal = assigned[0]?.total || 0;

			// Expended
			const expended = await Expenditure.aggregate([
				{
					$match: {
						base: base_id,
						equipment: equipment_id,
						...(Object.keys(dateFilter).length > 0 ? { expendedAt: dateFilter } : {})
					}
				},
				{ $group: { _id: null, total: { $sum: '$quantity' } } }
			]);
			const expendedTotal = expended[0]?.total || 0;

			// Calculate net movement and closing balance
			const netMovement = purchasesTotal + transfersInTotal - transfersOutTotal;
			const closingBalance = openingBalance + netMovement - assignedTotal - expendedTotal;

			// Create or update balance record
			const balanceData = {
				base: base_id,
				equipment: equipment_id,
				openingBalance,
				closingBalance,
				netMovement,
				purchases: purchasesTotal,
				transfersIn: transfersInTotal,
				transfersOut: transfersOutTotal,
				assigned: assignedTotal,
				expended: expendedTotal,
				date: end_date ? new Date(end_date) : new Date()
			};

			const balance = await Balance.findOneAndUpdate(
				{ base: base_id, equipment: equipment_id, date: balanceData.date },
				balanceData,
				{ upsert: true, new: true }
			).populate('base equipment');

			res.json({
				balance: {
					id: String(balance._id),
					base_id: String(balance.base?._id || base_id),
					base_name: balance.base?.name || 'Unknown Base',
					equipment_id: String(balance.equipment?._id || equipment_id),
					equipment_name: balance.equipment?.name || 'Unknown Equipment',
					opening_balance: balance.openingBalance,
					closing_balance: balance.closingBalance,
					net_movement: balance.netMovement,
					purchases: balance.purchases,
					transfers_in: balance.transfersIn,
					transfers_out: balance.transfersOut,
					assigned: balance.assigned,
					expended: balance.expended,
					date: balance.date
				}
			});

		} catch (error) {
			console.error('Calculate balances error:', error);
			return res.status(500).json({ error: 'Internal server error' });
		}
	},

	// Get balance summary for dashboard
	async getBalanceSummary(req, res) {
		try {
			const { base_id, equipment_id, start_date, end_date } = req.query;
			await connectMongo();

			const matchFilter = {};
			if (base_id) matchFilter.base = base_id;
			if (equipment_id) matchFilter.equipment = equipment_id;
			if (start_date || end_date) {
				matchFilter.date = {};
				if (start_date) matchFilter.date.$gte = new Date(start_date);
				if (end_date) matchFilter.date.$lte = new Date(end_date);
			}

			const balances = await Balance.find(matchFilter)
				.populate('base equipment')
				.sort({ date: -1 });

			// Calculate totals
			const totals = balances.reduce((acc, balance) => {
				acc.totalOpeningBalance += balance.openingBalance;
				acc.totalClosingBalance += balance.closingBalance;
				acc.totalNetMovement += balance.netMovement;
				acc.totalPurchases += balance.purchases;
				acc.totalTransfersIn += balance.transfersIn;
				acc.totalTransfersOut += balance.transfersOut;
				acc.totalAssigned += balance.assigned;
				acc.totalExpended += balance.expended;
				return acc;
			}, {
				totalOpeningBalance: 0,
				totalClosingBalance: 0,
				totalNetMovement: 0,
				totalPurchases: 0,
				totalTransfersIn: 0,
				totalTransfersOut: 0,
				totalAssigned: 0,
				totalExpended: 0
			});

			res.json({
				summary: totals,
				balances: balances.map(balance => ({
					id: String(balance._id),
					base_id: String(balance.base?._id || balance.base),
					base_name: balance.base?.name || 'Unknown Base',
					equipment_id: String(balance.equipment?._id || balance.equipment),
					equipment_name: balance.equipment?.name || 'Unknown Equipment',
					opening_balance: balance.openingBalance,
					closing_balance: balance.closingBalance,
					net_movement: balance.netMovement,
					purchases: balance.purchases,
					transfers_in: balance.transfersIn,
					transfers_out: balance.transfersOut,
					assigned: balance.assigned,
					expended: balance.expended,
					date: balance.date
				}))
			});

		} catch (error) {
			console.error('Get balance summary error:', error);
			return res.status(500).json({ error: 'Internal server error' });
		}
	},

	// Set opening balance for a specific base and equipment
	async setOpeningBalance(req, res) {
		try {
			const { base_id, equipment_id, opening_balance, date } = req.body;
			
			if (!base_id || !equipment_id || opening_balance === undefined) {
				return res.status(400).json({ 
					error: 'base_id, equipment_id, and opening_balance are required' 
				});
			}

			await connectMongo();

			// Validate that base and equipment exist
			const base = await Base.findById(base_id);
			const equipment = await Equipment.findById(equipment_id);
			
			if (!base) {
				return res.status(400).json({ error: 'Base not found' });
			}
			
			if (!equipment) {
				return res.status(400).json({ error: 'Equipment not found' });
			}

			const balanceDate = date ? new Date(date) : new Date();
			
			const balance = await Balance.findOneAndUpdate(
				{ base: base_id, equipment: equipment_id, date: balanceDate },
				{ 
					base: base_id,
					equipment: equipment_id,
					openingBalance: opening_balance,
					date: balanceDate
				},
				{ upsert: true, new: true }
			).populate('base equipment');

			res.json({
				message: 'Opening balance set successfully',
				balance: {
					id: String(balance._id),
					base_id: String(balance.base?._id || base_id),
					base_name: balance.base?.name || 'Unknown Base',
					equipment_id: String(balance.equipment?._id || equipment_id),
					equipment_name: balance.equipment?.name || 'Unknown Equipment',
					opening_balance: balance.openingBalance,
					date: balance.date
				}
			});

		} catch (error) {
			console.error('Set opening balance error:', error);
			return res.status(500).json({ error: 'Internal server error' });
		}
	},

	// Debug endpoint to check base and equipment data
	async debugData(req, res) {
		try {
			const { base_id, equipment_id } = req.query;
			await connectMongo();

			const base = await Base.findById(base_id);
			const equipment = await Equipment.findById(equipment_id);

			res.json({
				base: base ? { id: String(base._id), name: base.name } : null,
				equipment: equipment ? { id: String(equipment._id), name: equipment.name } : null,
				baseExists: !!base,
				equipmentExists: !!equipment
			});

		} catch (error) {
			console.error('Debug data error:', error);
			return res.status(500).json({ error: 'Internal server error' });
		}
	}
};
