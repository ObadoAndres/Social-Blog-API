import mongoose from 'mongoose';

const getMongoUri = () => {
  if (process.env.MONGO_URI) {
    return process.env.MONGO_URI;
  }

  return process.env.NODE_ENV === 'production'
    ? 'mongodb://mongodb:27017/socialdb'
    : 'mongodb://127.0.0.1:27017/socialdb';
};

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const connectDB = async (retries = 5, baseDelay = 3000) => {
  const uri = getMongoUri();

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000,
      });
      console.log('MongoDB connected successfully');
      return;
    } catch (error) {
      const attemptsLeft = retries - attempt;
      console.error(`MongoDB connection error: ${error.message}. Attempts left: ${attemptsLeft}`);

      if (attempt === retries) {
        // Exhausted retries - rethrow to let caller handle it
        throw error;
      }

      // Exponential backoff before next retry
      const delay = baseDelay * Math.pow(2, attempt);
      console.log(`Waiting ${delay}ms before retrying MongoDB connection...`);
      // eslint-disable-next-line no-await-in-loop
      await wait(delay);
    }
  }
};

export default connectDB;
