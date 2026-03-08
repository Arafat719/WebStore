import mongoose from "mongoose";

// Step 1: Schema define করা
const noteSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    tag: {
        type: String,
        default: "General"
    },
    date: {
        type: Date,
        default: Date.now
    }
});

// Step 2: Model create করা
const Note = mongoose.model("Note", noteSchema);

export default Note;