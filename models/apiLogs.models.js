import mongoose from 'mongoose';

const apiLogSchema = new mongoose.Schema({
	method: { type: String, required: true },
	path: { type: String, required: true },
	userId: { type: String },
	body: { type: mongoose.Schema.Types.Mixed },
	status: { type: Number },
	createdAt: { type: Date, default: Date.now }
});

export const ApiLog =  mongoose.model('ApiLog', apiLogSchema);


