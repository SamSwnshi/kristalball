import mongoose from "mongoose";
const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Provide Username"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Provide Password"],
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["Admin", "BaseCommander", "LogisticsOfficer"],
      default: "LogisticsOfficer",
      required: true,
    },
    baseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Base",
      required: function () {
        return this.role !== "Admin";
      },
    },
  },
  { timestamp: true }
);

const User = mongoose.model("User", userSchema);
export default User;
