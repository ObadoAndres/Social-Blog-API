import dotenv from 'dotenv';
import { Worker } from "bullmq";
import { sendVerificationEmail } from "../services/email.services.js";

dotenv.config();

const redisConnection = process.env.REDIS_URL
  ? { url: process.env.REDIS_URL }
  : {
      host: process.env.REDIS_HOST || '127.0.0.1',
      port: Number(process.env.REDIS_PORT || 6379),
    };

console.log("BullMQ worker starting...");

const emailWorker = new Worker(
  "emailQueue",
  async (job) => {
    console.log(`Processing job: ${job.name}`);

    switch (job.name) {
      case "sendVerificationEmail":
        await sendVerificationEmail(
          job.data.email,
          job.data.username,
          job.data.otp,
        );
        break;

      default:
        throw new Error(`Unknown job: ${job.name}`);
    }
  },
  {
    connection: redisConnection,
  },
);

emailWorker.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
});

emailWorker.on("failed", (job, err) => {
  console.error(`Job ${job.id} failed:`, err.message);
});
