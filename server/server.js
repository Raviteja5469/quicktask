const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const connectDB = require('./config/db');

const port = process.env.PORT || 5001;

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(cors({
    origin: [
        "http://localhost:3000",
        "https://quicktask-ji8k.vercel.app" // 👈 CRITICAL: NO TRAILING SLASH
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// 1. Add a Health Check Route (To test if port 5001 is working)
app.get('/', (req, res) => {
    res.send('API is running...');
});

// 2. Your Task Routes
app.use('/api/tasks', require('./routes/tasksRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

// Start Server
app.listen(port, () => console.log(`Server started on port ${port}`));
