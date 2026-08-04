import mongoose from 'mongoose';

const getMongoUri = () => {
  if (process.env.MONGO_URI) {
    return process.env.MONGO_URI;
  }

  return process.env.NODE_ENV === 'production'
    ? 'mongodb://mongodb:27017/socialdb'
    : 'mongodb://127.0.0.1:27017/socialdb';
};

const connectDB = async () => {
  try {
    await mongoose.connect(getMongoUri(), {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    throw error;
  }
};

export default connectDB;
