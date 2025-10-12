import  Transfer  from '../models/transfer.models.js';
import Base  from '../models/base.models.js';
import  Equipment  from '../models/equipment.models.js';

export const createTransfer = async(req ,res) =>{
    try {
			const { from_base_id, to_base_id, equipment_id, quantity, transferred_at } = req.body || {};
			if (!from_base_id || !to_base_id || !equipment_id || !quantity) {
				return res.status(400).json({ error: 'from_base_id, to_base_id, equipment_id, quantity required' });
			}

			
			const transfer = await Transfer.create({ 
				fromBase: from_base_id, 
				toBase: to_base_id, 
				equipment: equipment_id, 
				quantity, 
				transferredAt: transferred_at || new Date() 
			});

			return res.json({ id: String(transfer._id) });
		} catch (error) {
			console.error('Create transfer error:', error);
			return res.status(500).json({ error: 'Internal server error' });
		}
}
export const getTransfers = async(req ,res) =>{
try {
			const { start, end, base_id, equipment_id } = req.query;
			

			const query = {};
			if (equipment_id) query.equipment = equipment_id;
			if (base_id) {
				query.$or = [
					{ fromBase: base_id }, 
					{ toBase: base_id }
				];
			}
			if (start || end) {
				query.transferredAt = {
					...(start ? { $gte: new Date(start) } : {}),
					...(end ? { $lte: new Date(end) } : {})
				};
			}

			const rows = await Transfer.find(query)
				.populate('equipment')
				.populate('fromBase')
				.populate('toBase')
				.sort({ transferredAt: -1 })
				.exec();

			return res.json(rows.map(r => ({
				id: String(r._id),
				from_base_id: r.fromBase ? String(r.fromBase._id) : null,
				from_base_name: r.fromBase ? r.fromBase.name : 'Unknown Base',
				to_base_id: r.toBase ? String(r.toBase._id) : null,
				to_base_name: r.toBase ? r.toBase.name : 'Unknown Base',
				equipment_id: r.equipment ? String(r.equipment._id) : null,
				equipment_name: r.equipment ? r.equipment.name : 'Unknown Equipment',
				quantity: r.quantity,
				transferred_at: r.transferredAt
			})));
		} catch (error) {
			console.error('Get transfers error:', error);
			return res.status(500).json({ error: 'Internal server error' });
		}
	}

