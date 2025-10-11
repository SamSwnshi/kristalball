import { Base } from "../models/base.models.js";
import { Equipment } from "../models/equipment.models.js";
import { EquipmentType } from "../models/equipmentType.models.js";
import { Role } from "../models/role.models.js";
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
