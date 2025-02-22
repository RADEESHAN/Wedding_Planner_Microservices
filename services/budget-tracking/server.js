const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const budgetRoutes = require('./routes/budgetRoutes0054');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5004;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', budgetRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    //useNewUrlParser: true,
   // useUnifiedTopology: true,
})
.then(() => {
    console.log('Connected to MongoDB');
    // Start the server after successful DB connection
    app.listen(PORT, () => {
        console.log(`Budget Tracking Service running on port ${PORT}`);
    });
})
.catch((error) => {
    console.error('MongoDB connection error:', error);
});
