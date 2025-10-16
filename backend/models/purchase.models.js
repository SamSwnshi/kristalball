import mongoose from 'mongoose';

const purchaseSchema = new mongoose.Schema({
	base: { type: mongoose.Schema.Types.ObjectId, ref: 'Base', required: true },
	equipment: { type: mongoose.Schema.Types.ObjectId, ref: 'Equipment', required: true },
	createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
	quantity: { type: Number, required: true, min: 1 },
	price: { type: Number, required: true, min: 0 },
	purchasedAt: { type: Date, default: Date.now }
}, { timestamps: true });

const Purchase = mongoose.model('Purchase', purchaseSchema);

export default Purchase;

