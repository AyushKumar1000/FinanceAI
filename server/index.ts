import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { connectDatabase } from '../src/config/database';
import userRoutes from './routes/userRoutes';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Allow requests from your frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(bodyParser.json());

// Connect to MongoDB
connectDatabase().catch(console.error);

// Routes
app.use('/api/users', userRoutes);

// Basic route
app.get('/', (req, res) => {
  res.send('FinanceAI API is running');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
