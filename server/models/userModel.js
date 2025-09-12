import mongoose from "mongoose"
import { Schema } from "mongoose"

const userModel = new Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: {
        type: String,
        required: function () { return !this.googleId; },
        minlength: 6
    },
    profilePic: { type: String, default: "" },
    bio: { type: String },
    googleId: {
        type: String,
        unique: true,
        sparse: true // Allows multiple documents to have a null value for this field
    },
    verifyToken: {type : String},
    verifyTokenExpiry: {type: Date},
    

}, { timestamps: true })

const User = mongoose.model('User', userModel)
export default User