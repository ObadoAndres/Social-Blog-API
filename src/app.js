import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.routes.js';

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const startApp = async () => {
  await connectDB();

app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the social blog API' });
  });

  app.use('/auth', authRoutes);
  return app;
};

export default startApp;
