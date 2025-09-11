import express, { urlencoded } from 'express'
import 'dotenv/config'
import cors from 'cors'
import http from 'http'
import connectToDB from './lib/db.js'
import userRouter from './Routes/userRoutes.js'
import messageRouter from './Routes/messageRoutes.js'
import { Server } from 'socket.io'

//Create Express app and HTTP server
const app = express()

// Socket io supports the http server
const server = http.createServer(app)

// Initialise Socket.io Server
export const io = new Server(server, {
    cors: { origin: "*" } // allow users from all origins
})

// Store Online Users
export const userSocketMap = {} // {userId: socketId}

// socket.io connection handler
io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId
    console.log("User Connected", userId)
    if (userId) userSocketMap[userId] = socket.id

    //Emit online users to all connected clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap))
    
    socket.on("disconnect", () => {
        console.log("User Disconnected", userId)
        delete userSocketMap[userId]
        io.emit("getOnlineUsers", Object.keys(userSocketMap))
    });
});


//Middleware
app.use(express.json({ limit: "4mb" }))
app.use(cors({
    origin: "*", // frontend URL
    credentials: true
}))
// app.use(urlencoded)


app.use('/api/status', (req, res) => { res.send("Server is Live..") })
app.use('/api/auth', userRouter)
app.use('/api/messages', messageRouter)
// app.get("/ping", (req, res) => {
//   res.json({ message: "pong" })
// })

//connect To Database
await connectToDB()

const PORT = process.env.PORT || 5000

server.listen(PORT, () => {
    console.log("Server is running on PORT: " + PORT)
})