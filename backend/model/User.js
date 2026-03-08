import mongoose from "mongoose";

// Step 1: Schema define করা
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        unique: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

// Step 2: Model create করা
const User = mongoose.model("User", userSchema);

export default User;