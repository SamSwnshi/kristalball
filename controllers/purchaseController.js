import { connectMongo } from '../lib/db.js';
import { Purchase } from '../models/Purchase.js';
import { Equipment } from '../models/Equipment.js';
import { Base } from '../models/Base.js';

export const purchaseController = {
	async createPurchase(req, res) {
		try {
			const { base_id, equipment_id, quantity, purchased_at } = req.body || {};
			if (!base_id || !equipment_id || !quantity) {
				return res.status(400).json({ error: 'base_id, equipment_id, quantity required' });
			}

			await connectMongo();
			const purchase = await Purchase.create({ 
				base: base_id, 
				equipment: equipment_id, 
				quantity, 
				purchasedAt: purchased_at || new Date() 
			});

			return res.json({ id: String(purchase._id) });
		} catch (error) {
			console.error('Create purchase error:', error);
			return res.status(500).json({ error: 'Internal server error' });
		}
	},

	async getPurchases(req, res) {
		try {
			const { start, end, base_id, equipment_type_id, equipment_id } = req.query;
			await connectMongo();

			const query = {};
			if (base_id) query.base = base_id;
			if (equipment_id) query.equipment = equipment_id;
			if (start || end) {
				query.purchasedAt = {
					...(start ? { $gte: new Date(start) } : {}),
					...(end ? { $lte: new Date(end) } : {})
				};
			}

			let q = Purchase.find(query)
				.populate('equipment')
				.populate('base')
				.sort({ purchasedAt: -1 });

			// Filter by equipment type if specified
			if (equipment_type_id) {
				q = q.populate({
					path: 'equipment',
					match: { type: equipment_type_id }
				});
			}

			const rows = await q.exec();
			return res.json(rows.map(r => ({
				id: String(r._id),
				base_id: String(r.base._id),
				base_name: r.base.name,
				equipment_id: String(r.equipment._id),
				equipment_name: r.equipment.name,
				quantity: r.quantity,
				purchased_at: r.purchasedAt
			})));
		} catch (error) {
			console.error('Get purchases error:', error);
			return res.status(500).json({ error: 'Internal server error' });
		}
	}
};
