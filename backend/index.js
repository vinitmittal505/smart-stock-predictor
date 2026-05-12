import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import mongoose from 'mongoose';
import authRoutes from './routes/authRoutes.js';
import inventoryRoutes from './routes/inventoryRoutes.js';
import { runAIService } from './services/aiService.js';
import { runEmailService } from './services/emailService.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('--- MongoDB Atlas Connected ---');
    // Run initial services after connection
    runAIService();
    runEmailService();
  })
  .catch(err => console.error('MongoDB Connection Error:', err));

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173', // Use environment variable for frontend URL
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/inventory', inventoryRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Smart-Stock AI Backend is running' });
});

// Run AI and Email services every 75 minutes to fit 20/day quota of 2.5-flash
setInterval(() => {
  runAIService();
  runEmailService();
}, 4500000);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
