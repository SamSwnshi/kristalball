import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/military_assets';

let connected = false;

export async function connectMongo() {
	if (connected) return mongoose.connection;
	mongoose.set('strictQuery', true);
	await mongoose.connect(MONGODB_URI, {
		serverSelectionTimeoutMS: 5000
	});
	connected = true;
	return mongoose.connection;
}

export { mongoose };
