import  Base  from "../models/base.models.js";
import  Equipment  from "../models/equipment.models.js";
import  EquipmentType from "../models/equipmentType.models.js";
import  Role  from "../models/role.models.js";
export const getBases = async (req, res) => {
    try {
        const bases = await Base.find({}).sort({ name: 1 });
        return res.json(
            bases.map((b) => ({
                id: String(b._id),
                name: b.name,
            }))
        );
    } catch (error) {
        console.error("Get bases error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};
export const getEquipment = async (req, res) => {
    try {
        const equipment = await Equipment.find({})
            .populate("type")
            .sort({ name: 1 });

        return res.json(
            equipment.map((e) => ({
                id: String(e._id),
                name: e.name,
                type_id: String(e.type._id),
                type_name: e.type.name,
            }))
        );
    } catch (error) {
        console.error("Get equipment error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};
export const getEquipmentTypes = async (req, res) => {
    try {
        const types = await EquipmentType.find({}).sort({ name: 1 });
        return res.json(
            types.map((t) => ({
                id: String(t._id),
                name: t.name,
            }))
        );
    } catch (error) {
        console.error("Get equipment types error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};
export const getRoles = async (req, res) => {
    try {
        const roles = await Role.find({}).sort({ name: 1 });
        return res.json(
            roles.map((r) => ({
                id: String(r._id),
                name: r.name,
            }))
        );
    } catch (error) {
        console.error("Get roles error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};
export const createEquipmentType = async(req, res) =>{
    try {
			const { name } = req.body || {};
			if (!name) {
				return res.status(400).json({ error: 'name is required' });
			}
			const equipmentType = await EquipmentType.create({ name });
			return res.status(201).json({ 
				id: String(equipmentType._id),
				name: equipmentType.name
			});
		} catch (error) {
			console.error('Create equipment type error:', error);
			return res.status(500).json({ error: 'Internal server error' });
		}
}
export const createEquipment = async(req, res) =>{
try {
			const { name, type } = req.body || {};
			if (!name || !type) {
				return res.status(400).json({ error: 'name and type are required' });
			}

			
			const equipment = await Equipment.create({ name, type });
			await equipment.populate('type');
			
			return res.status(201).json({
				id: String(equipment._id),
				name: equipment.name,
				type_id: String(equipment.type._id),
				type_name: equipment.type.name
			});
		} catch (error) {
			console.error('Create equipment error:', error);
			return res.status(500).json({ error: 'Internal server error' });
		}
}
export const createBase = async(req, res) =>{
try {
			const { name } = req.body || {};
			if (!name) {
				return res.status(400).json({ error: 'name is required' });
			}

		
			const base = await Base.create({ name });
			return res.status(201).json({ 
				id: String(base._id),
				name: base.name
			});
		} catch (error) {
			console.error('Create base error:', error);
			return res.status(500).json({ error: 'Internal server error' });
		}
}
export const createRole = async(req, res) =>{
try {
			const { name } = req.body || {};
			if (!name) {
				return res.status(400).json({ error: 'name is required' });
			}

			
			const role = await Role.create({ name });
			return res.status(201).json({ 
				id: String(role._id),
				name: role.name
			});
		} catch (error) {
			console.error('Create role error:', error);
			return res.status(500).json({ error: 'Internal server error' });
		}
}