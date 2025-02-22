// Import dependencies
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const eventRoutes = require("./routes/eventRoutes0054");

// Load environment variables
dotenv.config();

// Initialize Express application
const app = express();

// Set the port
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/events", eventRoutes);

// Function to connect to MongoDB and start the server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("Connected to MongoDB");

    // Start the server
    app.listen(PORT, () => {
      console.log(`Event Management Service running on port ${PORT}`);
    });
  } catch (error) {
    console.error("MongoDB connection error:", error);

    // Exit the process with a failure code
    process.exit(1);
  }
};

// Call the function to start the server
startServer();

// Graceful shutdown handling
process.on("SIGINT", async () => {
  console.log("SIGINT received. Closing MongoDB connection...");
  await mongoose.connection.close();
  console.log("MongoDB connection closed. Exiting process.");
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("SIGTERM received. Closing MongoDB connection...");
  await mongoose.connection.close();
  console.log("MongoDB connection closed. Exiting process.");
  process.exit(0);
});
