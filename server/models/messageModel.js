import mongoose from "mongoose"
import { Schema } from "mongoose"

const messageModel = new Schema({
    
    // sender id, message data, message files media, message time
    senderId: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    receiverId: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    text: {type: String},
    image: {type: String},
    seen: {type: Boolean, default: false }

}, {timestamps: true})

const Message = mongoose.model('Message',messageModel)
export default Message