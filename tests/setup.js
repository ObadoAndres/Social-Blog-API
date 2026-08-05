import { jest } from '@jest/globals';
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongoServer;
let mongoReady = false;

jest.setTimeout(60000);

beforeAll(async () => {
  try {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
    mongoReady = true;
  } catch (error) {
    console.warn("MongoMemoryServer unavailable, skipping database setup:", error.message);
    mongoReady = false;
  }
});

afterEach(async () => {
  if (!mongoReady || !mongoose.connection.readyState) {
    return;
  }

  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

afterAll(async () => {
  if (mongoose.connection.readyState) {
    await mongoose.connection.close();
  }

  if (mongoServer) {
    await mongoServer.stop().catch(() => {});
  }
});