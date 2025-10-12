import mongoose from "mongoose";

const equipmentTypeSchema = new mongoose.Schema(
  {
    name: { type: String, unique: true, required: true },
  },
  { timestamps: true }
);

const EquipmentType = mongoose.model("EquipmentType", equipmentTypeSchema);

export default EquipmentType;
