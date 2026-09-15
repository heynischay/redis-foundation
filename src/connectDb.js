import mongoose from "mongoose";

export const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL || "mongodb://localhost:27017");
    console.log("Db connected");
  } catch (error) {
    console.log(" db connection failed");
    process.exit(1);
  }
};
