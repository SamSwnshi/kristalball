import mongoose from 'mongoose';

const roleSchema = new mongoose.Schema({
	name: { type: String, unique: true, required: true }
}, { timestamps: true });

export const Role = mongoose.models.Role || mongoose.model('Role', roleSchema);


