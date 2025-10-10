import mongoose from 'mongoose';

const baseSchema = new mongoose.Schema({
	name: { type: String, unique: true, required: true }
}, { timestamps: true });

const Base = mongoose.model("Base",baseSchema)

export default Base