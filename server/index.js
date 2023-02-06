import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv"
dotenv.config();

import userRoutes from "./routes/users.js"

const app = express();
const PORT = process.env.SERVER_PORT;
const DB_STRING = process.env.MONGODB_CONNECTION_STRING;

app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));
// Vite uses port 5173
// create-react-app uses port 3000
app.use(cors({
	origin: 'http://localhost:5173',
	credentials: true
}));

app.use("/api/v1/user", userRoutes);
app.get("/", (req, res) => res.status(200).json({ message: "Server is running" }));

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