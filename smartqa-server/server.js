require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const http = require('http');  // Part of core node api/module which enables creating server
const {Server} = require('socket.io');

const roomRoutes = require('./src/routes/roomRoutes');

const app = express(); // Create instance of express to setup the server

// Middlewares
app.use(express.json());

const corsOptions = {
    origin: process.env.CLIENT_URL,
    credentials: true
};
app.use(cors(corsOptions));

mongoose.connect(process.env.MONGODB_URL)
    .then(() => console.log('MongoDB Connected'))
    .catch((error) => console.log('Failed to connect to MongoDB: ', error));


const server = http.createServer(app);

const io = new Server(server, {
    cors:{
        origin: process.env.CLIENT_URL,
        methods: ["GET","POST","DELETE","PUT"]
    }
});

io.on("connection", (socket) => {
    console.log("New client connection: ",socket.io);
    
}) 

app.use('/room', roomRoutes);

// Start the server
const PORT = process.env.PORT;
app.listen(PORT, (error) => {
    if (error) {
        console.log('Server not starting due to: ', error);
    } else {
        console.log(`Server running at port ${PORT}`);
    }
});
