import mongoose from 'mongoose';

const equipmentSchema = new mongoose.Schema({
	name: { type: String, required: true },
	type: { type: mongoose.Schema.Types.ObjectId, ref: 'EquipmentType', required: true }
}, { timestamps: true });


const Equipment = mongoose.model("Equipment",equipmentSchema)

export default Equipment