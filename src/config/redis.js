import { createClient } from "redis";

const redisClient = createClient({
  url: process.env.REDIS_URL,
  socket: {
    reconnectStrategy: (retries) => Math.min(retries * 50, 500),
  },
});

redisClient.on("connect", () => {
  console.log("Redis connected successfully");
});

redisClient.on("error", (err) => {
  const isNetwork = /ECONNREFUSED|ENOTFOUND|ETIMEDOUT|EHOSTUNREACH/i.test(
    err.message
  );

  console.error("Redis connection error:", err.message);

  if (isNetwork) {
    console.error(
      "  This looks like a network issue. Check that:\n" +
        "    - the redis service is up: 'docker compose ps redis'\n" +
        "    - REDIS_URL host matches the docker-compose service name (e.g. redis://redis:6379)\n" +
        "    - the api/worker container can reach redis on the Docker network"
    );
  }
});

export const connectRedis = async () => {
  if (!process.env.REDIS_URL) {
    throw new Error(
      "REDIS_URL is not set. Add it to your .env or .env.docker file."
    );
  }

  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
};

export default redisClient;
