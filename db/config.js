import mongoose from "mongoose";

const config = async () =>{
    try {
        await mongoose.connect(process.env.MONOG_URL)
        console.log("Connected to MONOGO_DB")
    } catch (error) {
        console.log("Error In Connecting to Mongo_db!")
    }
}
export default config