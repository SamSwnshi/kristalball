import mongoose from 'mongoose';

const balanceSchema = new mongoose.Schema({
	base: { type: mongoose.Schema.Types.ObjectId, ref: 'Base', required: true },
	equipment: { type: mongoose.Schema.Types.ObjectId, ref: 'Equipment', required: false },
	openingBalance: { type: Number, default: 0, min: 0 },
	closingBalance: { type: Number, default: 0, min: 0 },
	date: { type: Date, default: Date.now },
	
	netMovement: { type: Number, default: 0 },
	purchases: { type: Number, default: 0 },
	transfersIn: { type: Number, default: 0 },
	transfersOut: { type: Number, default: 0 },
	assigned: { type: Number, default: 0 },
	expended: { type: Number, default: 0 }
}, { timestamps: true });

// Index for efficient queries
balanceSchema.index({ base: 1, equipment: 1, date: 1 });
balanceSchema.index({ base: 1, date: 1 });

const Balance =  mongoose.model('Balance', balanceSchema);

export default Balance
