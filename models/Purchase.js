import mongoose from 'mongoose';

const purchaseSchema = new mongoose.Schema({
	base: { type: mongoose.Schema.Types.ObjectId, ref: 'Base', required: true },
	equipment: { type: mongoose.Schema.Types.ObjectId, ref: 'Equipment', required: true },
	quantity: { type: Number, required: true, min: 1 },
	purchasedAt: { type: Date, default: Date.now }
}, { timestamps: true });

export const Purchase = mongoose.models.Purchase || mongoose.model('Purchase', purchaseSchema);


