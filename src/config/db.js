import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI);

    console.log(
      `MongoDB connected successfully: ${connection.connection.host}`
    );

    console.log(
      `MongoDB readyState: ${connection.connection.readyState}`
    );
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
};

export default connectDB;