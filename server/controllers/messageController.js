import cloudinary from "../lib/cloudinary.js"
import Message from "../models/messageModel.js"
import User from "../models/userModel.js"
import { io, userSocketMap } from "../server.js"


// get all users except the logged in user
export const getUsersforSidebar = async (req, res) => {
    try {
        const { userId } = req.user._id
        const filteredUsers = await User.find({ _id: { $ne: userId } }).select("-password")

        // Count number of messages not seen from each user it stores the count individually 
        const unseenMessages = {}
        const promises = filteredUsers.map(async (user) => {
            const messages = await Message.find({ senderId: user._id, receiverId: userId, seen: false })
            if (messages.length > 0) {
                unseenMessages[user._id] = messages.length // number of unseen messages for us from that user
            }
        })
        await Promise.all(promises) // since the above is an async function it returns a promise, so an array of promise needs to be fulfilled this is done parallely by calling this line and it waits till all promises are fulfilled
        res.json({ success: true, users: filteredUsers, unseenMessages })
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}

// Get all messages for selected user 
export const getMessages = async (req, res) => {
    try {
        const { id: selectedUserId } = req.params // from params we will get the id of the sender which we store in the selectedUserId
        const myId = req.user._id
        const messages = await Message.find({
            $or: [
                { senderId: selectedUserId, receiverId: myId },
                { senderId: myId, receiverId: selectedUserId }
            ]
        })

        // after getting the messages we will mark the messages as read
        await Message.updateMany({ senderId: selectedUserId, receiverId: myId }, { seen: true })
        res.json({ success: true, messages })

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }   
}

// To mark message as seen using message id
export const markMessageAsSeen = async (req, res) => {
    try {
        const { id } = req.params
        await Message.findByIdAndUpdate(id, { seen: true })
        res.json({ success: true })

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}

// To send the messages to a user
export const sendMessage = async (req, res) => {
    // get message data to be send 
    // get receiver id from params
    // get our id from req.users
    // create a new Message Model
    try {
        const { text, image } = req.body
        const receiverId = req.params.id
        const senderId = req.user._id

        let imageUrl;
        if (image) {
            const result = await cloudinary.uploader.upload(image)
            imageUrl = result.secure_url
        }

        const newMessage = await Message.create({
            senderId,
            receiverId,
            text,
            image: imageUrl,
        })
        // now we want the messages to be displayed in real time - we will use socket.io for that
        //Emit the message to the receiver socket
        const receiverSocketId = userSocketMap[receiverId]
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage)
        }

        res.json({ success: true, newMessage })
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}

