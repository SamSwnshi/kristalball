import mongoose from "mongoose";
const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role',
        required: true
    },
    base:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Base"
    }
  },
  { timestamp: true }
);

const User = mongoose.model("User", userSchema);
export default User;
