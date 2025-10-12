import mongoose from 'mongoose';

const transferSchema = new mongoose.Schema({
	fromBase: { type: mongoose.Schema.Types.ObjectId, ref: 'Base', required: true },
	toBase: { type: mongoose.Schema.Types.ObjectId, ref: 'Base', required: true },
	equipment: { type: mongoose.Schema.Types.ObjectId, ref: 'Equipment', required: true },
	quantity: { type: Number, required: true, min: 1 },
	transferredAt: { type: Date, default: Date.now }
}, { timestamps: true });

export const Transfer = mongoose.models.Transfer || mongoose.model('Transfer', transferSchema);


