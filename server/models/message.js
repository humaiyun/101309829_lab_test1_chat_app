import mongoose from "mongoose";

const message = new mongoose.Schema({
    from_user: {
        type: String,
        trim: true,
    },
    room: {
        type: String,
        trim: true,
        maxLength: 50,
        default: "main"
    },
    message: {
        type: String
    },
    date_sent: {
        type: Date,
        default: Date.now()
    },
});

export default mongoose.model("Message", message);