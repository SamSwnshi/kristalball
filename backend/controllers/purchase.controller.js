import  Purchase  from "../models/purchase.models.js";
import  Equipment  from "../models/equipment.models.js";
import  Base  from "../models/base.models.js";
import mongoose from "mongoose";

export const createPurchase = async (req, res) => {
  try {
    const { base_id, equipment_id, quantity, price, purchased_at } = req.body || {};
    const numericQuantity = Number(quantity);
    const numericPrice = Number(price);
    if (!base_id || !equipment_id || !Number.isFinite(numericQuantity) || !Number.isFinite(numericPrice)) {
      return res
        .status(400)
        .json({ error: "base_id, equipment_id, quantity, and price are required numbers" });
    }

    // Resolve base and equipment identifiers: accept ObjectId or name strings
    const resolveId = async (Model, value, label) => {
      if (mongoose.isValidObjectId(value)) return value;
      const byName = await Model.findOne({ name: value });
      if (!byName) {
        throw new Error(`${label} not found: ${value}`);
      }
      return byName._id;
    };

    const baseObjectId = await resolveId(Base, base_id, 'base');
    const equipmentObjectId = await resolveId(Equipment, equipment_id, 'equipment');

    const purchase = await Purchase.create({
      base: baseObjectId,
      equipment: equipmentObjectId,
      createdBy: req.user?.id,
      quantity: numericQuantity,
      price: numericPrice,
      purchasedAt: purchased_at || new Date(),
    });

    return res.json({ id: String(purchase._id) });
  } catch (error) {
    console.error("Create purchase error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getPurchases = async (req, res) => {
  try {
    const { start, end, base_id, equipment_type_id, equipment_id, mine } = req.query;


    const query = {};
    if (base_id) query.base = base_id;
    if (equipment_id) query.equipment = equipment_id;
    if (mine === 'true' && req.user?.id) query.createdBy = req.user.id;
    if (start || end) {
      query.purchasedAt = {
        ...(start ? { $gte: new Date(start) } : {}),
        ...(end ? { $lte: new Date(end) } : {}),
      };
    }

    let q = Purchase.find(query)
      .populate("equipment")
      .populate("base")
      .sort({ purchasedAt: -1 });

    if (equipment_type_id) {
      q = q.populate({
        path: "equipment",
        match: { type: equipment_type_id },
      });
    }

    const rows = await q.exec();
    return res.json(
      rows.map((r) => ({
        id: String(r._id),
        base_id: r.base ? String(r.base._id) : null,
        base_name: r.base ? r.base.name : 'Unknown Base',
        equipment_id: r.equipment ? String(r.equipment._id) : null,
        equipment_name: r.equipment ? r.equipment.name : 'Unknown Equipment',
        quantity: r.quantity,
        price: r.price,
        purchased_at: r.purchasedAt,
      }))
    );
  } catch (error) {
    console.error("Get purchases error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
