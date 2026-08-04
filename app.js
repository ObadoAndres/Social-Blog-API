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

const app = express();

// 2. Global Parsers (Must run before any routes)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. Application Routes
app.use(generalLimiter);
app.use('/admin', adminRoutes);
app.use('/api', authRoutes);
app.use('/api/post', postRoutes);
app.use('/api/comment', commentRoutes);
app.use('/api/follow', followRoutes);
app.use('/api/like', likeRoutes);
app.use('/api/users', userRoutes);

// 4. Base / Health Check Route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the social blog API' });
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';
  res.status(statusCode).json({ success: false, message });
});

// 5. Database Connection Wrapper
const startApp = async () => {
  await connectDB();

  try {
    await connectRedis();
    await redisClient.set('name', 'Andres');
    const value = await redisClient.get('name');
    console.log(value);
  } catch (error) {
    console.warn('Redis connection failed; continuing without Redis:', error.message);
  }
};


export { app, startApp };
export default startApp;
