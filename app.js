import 'dotenv/config';
import express from 'express';
import connectDB from './src/config/db.js';
import authRoutes from './src/routes/auth.routes.js';
import adminRoutes from './src/routes/admin.routes.js';
import postRoutes from './src/routes/post.routes.js';
import commentRoutes from './src/routes/comment.routes.js';
import followRoutes from './src/routes/follow.routes.js';
import likeRoutes from './src/routes/like.routes.js';
import userRoutes from './src/routes/user.routes.js';
import { generalLimiter } from './src/middlewares/rateLimit.middleware.js';
import redisClient, { connectRedis } from './src/config/redis.js';
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./src/config/swagger.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(generalLimiter);
app.use('/admin', adminRoutes);
app.use('/api', authRoutes);
app.use('/api/post', postRoutes);
app.use('/api/comment', commentRoutes);
app.use('/api/follow', followRoutes);
app.use('/api/like', likeRoutes);
app.use('/api/users', userRoutes);



/**
 * @swagger
 * /:
 *   get:
 *     summary: Get API welcome message
 *     tags:
 *       - General
 *     responses:
 *       200:
 *         description: API is running
 */
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the social blog API' });
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';
  res.status(statusCode).json({ success: false, message });
});

const startApp = async () => {
  await connectDB();

  try {
    await connectRedis();
    console.log("Redis connected successfully");
  } catch (error) {
    console.warn(
      "Redis connection failed; continuing without Redis:",
      error.message
    );
  }
};


export { app, startApp };
export default startApp;
