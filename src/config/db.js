import mongoose from "mongoose";

const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 5000;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const connectDB = async (attempt = 1) => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.error(
      "MongoDB connection error: MONGO_URI is not set. Add it to your .env or .env.docker file."
    );
    throw new Error("MONGO_URI is not set");
  }

  try {
    const connection = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log(
      `MongoDB connected successfully: ${connection.connection.host}`
    );

    console.log(`MongoDB readyState: ${connection.connection.readyState}`);
    return connection;
  } catch (error) {
    const isNetwork = /ECONNREFUSED|ENOTFOUND|ETIMEDOUT|EHOSTUNREACH|failed to connect|server selection/i.test(
      error.message
    );

    console.error(`MongoDB connection attempt ${attempt} failed.`);

    if (isNetwork) {
      console.error(
        "  This looks like a network issue. Check that:\n" +
          "    - the mongodb service is up: 'docker compose ps mongodb'\n" +
          "    - MONGO_URI host matches the docker-compose service name (e.g. mongodb://mongodb:27017/...)\n" +
          "    - the api/worker container can reach mongodb on the Docker network"
      );
    } else {
      console.error(`  Error: ${error.message}`);
    }

    if (attempt < MAX_RETRIES) {
      console.log(
        `  Retrying in ${RETRY_DELAY_MS / 1000}s... (attempt ${attempt}/${MAX_RETRIES})`
      );
      await sleep(RETRY_DELAY_MS);
      return connectDB(attempt + 1);
    }

    throw error;
  }
};

export default connectDB;
