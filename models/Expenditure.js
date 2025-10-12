import mongoose from 'mongoose';

const expenditureSchema = new mongoose.Schema({
	base: { type: mongoose.Schema.Types.ObjectId, ref: 'Base', required: true },
	equipment: { type: mongoose.Schema.Types.ObjectId, ref: 'Equipment', required: true },
	quantity: { type: Number, required: true, min: 1 },
	expendedAt: { type: Date, default: Date.now }
}, { timestamps: true });

export const Expenditure = mongoose.models.Expenditure || mongoose.model('Expenditure', expenditureSchema);


