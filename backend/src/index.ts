import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './utils/database';
import routes from './routes';
import { User } from './models';

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// Make io globally accessible
declare global {
  var io: Server;
}
global.io = io;

// Middleware
app.use((req, res, next) => {
  const origin = req.headers.origin;
  const allowedOrigins = [
    process.env.FRONTEND_URL || "http://localhost:5173",
    "http://localhost:3000",
    "https://localhost:5173",
    "https://localhost:3000"
  ];
  
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Access-Control-Allow-Origin');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  next();
});

app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = [
      process.env.FRONTEND_URL || "http://localhost:5173",
      "http://localhost:3000",
      "https://localhost:5173",
      "https://localhost:3000"
    ];
    
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Access-Control-Allow-Origin"],
  credentials: true,
  optionsSuccessStatus: 200
}));

app.use(express.json());

// Routes
app.use('/api', routes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Function to emit leaderboard updates
export const emitLeaderboardUpdate = async () => {
  try {
    const users = await User.find().sort({ totalPoints: -1 });
    global.io.emit('leaderboard-update', users);
  } catch (error) {
    console.error('Error emitting leaderboard update:', error);
  }
};

// Initialize database and seed data
const initializeApp = async () => {
  await connectDB();
  
  // Seed initial users if database is empty
  const userCount = await User.countDocuments();
  if (userCount === 0) {
    const initialUsers = ['Rahul', 'Kamal', 'Sanak', 'Priya', 'Amit', 'Neha', 'Ravi', 'Pooja', 'Karan', 'Meera'];
    
    for (const name of initialUsers) {
      const user = new User({ name });
      await user.save();
    }
    
    console.log('✅ Initial users seeded successfully');
  }
};

const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'production') {
  initializeApp().then(() => {
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  });
}

app.get('/', (req, res) => {
  res.send('Welcome to the Leaderboard API');
});

export default app;
