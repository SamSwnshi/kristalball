import mongoose from 'mongoose';

const baseSchema = new mongoose.Schema({
	name: { type: String, unique: true, required: true }
}, { timestamps: true });

export const Base = mongoose.models.Base || mongoose.model('Base', baseSchema);


