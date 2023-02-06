import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv"
dotenv.config();

import { createServer } from "http";
import { Server } from "socket.io";

import userRoutes from "./routes/users.js";
import Message from "./models/message.js";

const app = express();
const PORT = process.env.SERVER_PORT;
const DB_STRING = process.env.MONGODB_CONNECTION_STRING;

app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: 'http://localhost:5000',
	credentials: true
}));

app.use(express.static("./public"));
app.get("/index.html", (req, res) => {
    res.sendFile(`/index.html`);
});


app.use("/api/v1/user", userRoutes);
app.get("/", (req, res) => res.status(200).json({ message: "Server is running" }));

app.get("/messages", async (req, res) => {
    try {
        const messages = await Message.find({});
        
        return res.json(messages);
    } catch (error) {
        console.log(error)
    } 
});

app.post("/messages", async (req, res) => {
    const { from_user, message } = req.body;
    try {
        const msg = await Message.create({ from_user, message });
        return res.status(200).json({ message: msg });
    } catch (error) {
        console.log(error)
    }
})

const startServer = async () => {
    try {
        mongoose.set("strictQuery", true);
        mongoose.connect(DB_STRING, { useNewUrlParser: true, useUnifiedTopology: true })
            .then(() => console.log("Connected to MongoDB"))
            .catch((err) => console.log(err));
            
            app.listen(PORT, () => console.log(`Server started on http://localhost:${PORT}`));
    } catch (error) {
        console.log(error)
    }
}
    
startServer()

const httpServer = createServer();
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:5000",
        methods: ["GET", "POST"]    
    }
});

// socketio on port 3000
httpServer.listen(3000);

io.on('connection', (socket) => {
    console.log(`A NEW user is connected: ${socket.id}`)
});
io.on("user-signup", user => {
    console.log(user);
});

io.on("user-signin", user => {
    console.log(user);
});
