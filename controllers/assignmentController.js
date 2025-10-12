import { connectMongo } from '../lib/db.js';
import { Assignment } from '../models/Assignment.js';
import { Expenditure } from '../models/Expenditure.js';
import { Base } from '../models/Base.js';
import { Equipment } from '../models/Equipment.js';

export const assignmentController = {
	async createAssignment(req, res) {
		try {
			const { base_id, equipment_id, assigned_to, quantity, assigned_at } = req.body || {};
			if (!base_id || !equipment_id || !assigned_to || !quantity) {
				return res.status(400).json({ error: 'base_id, equipment_id, assigned_to, quantity required' });
			}

			await connectMongo();
			const assignment = await Assignment.create({ 
				base: base_id, 
				equipment: equipment_id, 
				assignedTo: assigned_to, 
				quantity, 
				assignedAt: assigned_at || new Date() 
			});

			return res.json({ id: String(assignment._id) });
		} catch (error) {
			console.error('Create assignment error:', error);
			return res.status(500).json({ error: 'Internal server error' });
		}
	},

	async createExpenditure(req, res) {
		try {
			const { base_id, equipment_id, quantity, expended_at } = req.body || {};
			if (!base_id || !equipment_id || !quantity) {
				return res.status(400).json({ error: 'base_id, equipment_id, quantity required' });
			}

			await connectMongo();
			const expenditure = await Expenditure.create({ 
				base: base_id, 
				equipment: equipment_id, 
				quantity, 
				expendedAt: expended_at || new Date() 
			});

			return res.json({ id: String(expenditure._id) });
		} catch (error) {
			console.error('Create expenditure error:', error);
			return res.status(500).json({ error: 'Internal server error' });
		}
	},

	async getAssignmentsAndExpenditures(req, res) {
		try {
			const { start, end, base_id, equipment_id } = req.query;
			await connectMongo();

			const aQuery = {};
			const eQuery = {};
			
			if (base_id) { 
				aQuery.base = base_id; 
				eQuery.base = base_id; 
			}
			if (equipment_id) { 
				aQuery.equipment = equipment_id; 
				eQuery.equipment = equipment_id; 
			}
			if (start || end) { 
				const dt = {
					...(start ? { $gte: new Date(start) } : {}),
					...(end ? { $lte: new Date(end) } : {})
				}; 
				aQuery.assignedAt = dt; 
				eQuery.expendedAt = dt; 
			}

			const assignments = await Assignment.find(aQuery)
				.populate('equipment')
				.populate('base')
				.sort({ assignedAt: -1 })
				.exec();

			const expenditures = await Expenditure.find(eQuery)
				.populate('equipment')
				.populate('base')
				.sort({ expendedAt: -1 })
				.exec();

			return res.json({
				assignments: assignments.map(r => ({
					id: String(r._id),
					base_id: String(r.base._id),
					base_name: r.base.name,
					equipment_id: String(r.equipment._id),
					equipment_name: r.equipment.name,
					assigned_to: r.assignedTo,
					quantity: r.quantity,
					assigned_at: r.assignedAt
				})),
				expenditures: expenditures.map(r => ({
					id: String(r._id),
					base_id: String(r.base._id),
					base_name: r.base.name,
					equipment_id: String(r.equipment._id),
					equipment_name: r.equipment.name,
					quantity: r.quantity,
					expended_at: r.expendedAt
				}))
			});
		} catch (error) {
			console.error('Get assignments and expenditures error:', error);
			return res.status(500).json({ error: 'Internal server error' });
		}
	}
};
