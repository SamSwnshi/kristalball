import mongoose from "mongoose"
const userSchema = mongoose.Schema({},{timestamp: true})

const User = mongoose.model('User',userSchema)
export default User;