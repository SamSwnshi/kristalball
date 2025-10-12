import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		required: [true, "Provide Username"],
		unique: true
	},
	password: {
		type: String,
		required: [true, "Provide Password"],
		minlength: 6
	},
	role: {
		type: String,
		enum: ["admin", "baseCommander", "logisticsOfficer"],
		default: "logisticsOfficer",
		required: true
	},
	baseId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Base",
		required: function () {
			return this.role !== "admin";
		}
	}
}, { timestamps: true });

export const User = mongoose.models.User || mongoose.model('User', userSchema);


