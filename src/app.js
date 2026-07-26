import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.routes.js';
import adminRoutes from './routes/admin.routes.js';
import postRoutes from './routes/post.routes.js';
import commentRoutes from "./routes/comment.routes.js"

// 1. Initialize configuration
dotenv.config();

const app = express();

// 2. Global Parsers (Must run before any routes)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. Application Routes
app.use('/admin', adminRoutes);
app.use('/api', authRoutes);
app.use('/api/post', postRoutes);
app.use("/api/comment", commentRoutes);

// 4. Base / Health Check Route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the social blog API' });
});

// 5. Database Connection Wrapper
const startApp = async () => {
  await connectDB();
};

export { app, startApp };
export default startApp;
