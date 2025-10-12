import mongoose from 'mongoose';

const equipmentTypeSchema = new mongoose.Schema({
	name: { type: String, unique: true, required: true }
}, { timestamps: true });

export const EquipmentType = mongoose.models.EquipmentType || mongoose.model('EquipmentType', equipmentTypeSchema);


