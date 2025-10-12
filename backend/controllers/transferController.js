import { connectMongo } from '../lib/db.js';
import { Transfer } from '../models/Transfer.js';
import { Base } from '../models/Base.js';
import { Equipment } from '../models/Equipment.js';

export const transferController = {
	async createTransfer(req, res) {
		try {
			const { from_base_id, to_base_id, equipment_id, quantity, transferred_at } = req.body || {};
			if (!from_base_id || !to_base_id || !equipment_id || !quantity) {
				return res.status(400).json({ error: 'from_base_id, to_base_id, equipment_id, quantity required' });
			}

			await connectMongo();
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
	},

	async getTransfers(req, res) {
		try {
			const { start, end, base_id, equipment_id } = req.query;
			await connectMongo();

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
				from_base_id: String(r.fromBase._id),
				from_base_name: r.fromBase.name,
				to_base_id: String(r.toBase._id),
				to_base_name: r.toBase.name,
				equipment_id: String(r.equipment._id),
				equipment_name: r.equipment.name,
				quantity: r.quantity,
				transferred_at: r.transferredAt
			})));
		} catch (error) {
			console.error('Get transfers error:', error);
			return res.status(500).json({ error: 'Internal server error' });
		}
	}
};
