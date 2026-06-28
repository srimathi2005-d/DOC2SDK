import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import analyzeRoutes from './routes/analyzeRoutes.js';
import generateRoutes from './routes/generateRoutes.js';
import chatRoutes from './routes/chatRoutes.js';

dotenv.config();

const app = express();


// Allow any origin in development; in production allow any *.onrender.com + localhost
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (curl, Postman, mobile apps)
    if (!origin) return callback(null, true);
    // Allow localhost dev and any Render subdomain
    if (
      origin.includes('localhost') ||
      origin.includes('onrender.com') ||
      origin.includes('127.0.0.1')
    ) {
      return callback(null, true);
    }
    callback(null, true); // Allow all for now — tighten if needed
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Handle preflight for all routes
app.use(express.json());


// Mount routes
app.use('/api', analyzeRoutes);
app.use('/api', generateRoutes);
app.use('/api', chatRoutes);

// Basic health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Doc2SDK Modular Backend Running' });
});

export default app;
