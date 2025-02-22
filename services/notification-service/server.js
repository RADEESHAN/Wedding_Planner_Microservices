const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const notificationRoutes = require('./routes/notificationRoutes0054');



const amqp = require('amqplib');
const Notification = require('./models/Notification0054');


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5006;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', notificationRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
   // useNewUrlParser: true,
   // useUnifiedTopology: true,
})
.then(() => {
    console.log('Connected to MongoDB');
    // Start the server after successful DB connection
    app.listen(PORT, () => {
        console.log(`Notification Service running on port ${PORT}`);
    });
})
.catch((error) => {
    console.error('MongoDB connection error:', error);
});


/////////////////////////////////////////////
async function startConsumer() {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    const queue = 'notifications';

    await channel.assertQueue(queue, { durable: false });

    console.log('Waiting for messages...');
    channel.consume(queue, async (msg) => {
        const task = JSON.parse(msg.content.toString());
        console.log(`Received task notification: ${task.title}`);

        // Save notification to database
        const notification = new Notification({
            type: 'task-overdue',
            message: `Task "${task.title}" is overdue.`,
            recipient: task.assignedTo || 'user@example.com',
        });

        await notification.save();
    }, { noAck: true });
}

startConsumer();