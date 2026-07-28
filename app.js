import 'dotenv/config';
import express from 'express';
import connectDB from './src/config/db.js';
import authRoutes from './src/routes/auth.routes.js';
import adminRoutes from './src/routes/admin.routes.js';
import postRoutes from './src/routes/post.routes.js';
import commentRoutes from './src/routes/comment.routes.js';
import followRoutes from './src/routes/follow.routes.js';
import userRoutes from './src/routes/user.routes.js';

const app = express();

// 2. Global Parsers (Must run before any routes)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. Application Routes
app.use('/admin', adminRoutes);
app.use('/api', authRoutes);
app.use('/api/post', postRoutes);
app.use("/api/comment", commentRoutes);
app.use("/api/follow", followRoutes);
app.use("/api/users", userRoutes);

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
