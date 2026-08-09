import { Queue } from "bullmq";

const redisConnection = {
  url: process.env.REDIS_URL,
};

export const emailQueue = new Queue("emailQueue", {
  connection: redisConnection,

  defaultJobOptions: {
    attempts: 3,

    backoff: {
      type: "exponential",
      delay: 1000,
    },

    removeOnComplete: true,
    removeOnFail: false,
  },
});