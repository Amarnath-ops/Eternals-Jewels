import mongoose from "mongoose";

export const connectDB = async (uri) => {
    try {
        if (!uri) {
            throw new Error("MONGO_URI is not defined in .env");
        }
        const { connection } = await mongoose.connect(uri);
        console.log(`MongoDB Connected : ${connection.host}`);
    } catch (error) {
        console.log(`Mongo DB connection Error : ${error.message}`);
        process.exit(1);
    }
};
