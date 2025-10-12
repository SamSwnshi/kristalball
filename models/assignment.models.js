import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema(
    {
        base: { type: mongoose.Schema.Types.ObjectId, ref: "Base", required: true },
        equipment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Equipment",
            required: true,
        },
        assignedTo: { type: String, required: true },
        quantity: { type: Number, required: true, min: 1 },
        assignedAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

const Assignment = mongoose.model("Assignment", assignmentSchema);

export default Assignment;
