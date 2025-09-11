import mongoose from "mongoose"
import { Schema } from "mongoose"

const userModel = new Schema({
    fullName: {type: String,required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true, minlength: 6},
    profilePic: {type: String, default: ""},
    bio: {type: String },
    // refreshToken: {type: String}

}, {timestamps: true})

const User = mongoose.model('User',userModel)
export default User