import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import http from 'http';
import connectToDB from './lib/db.js';
import userRouter from './Routes/userRoutes.js';
import messageRouter from './Routes/messageRoutes.js';
import { Server } from 'socket.io';
import passport from 'passport';
import session from 'express-session';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from './models/userModel.js';
import { generateToken } from './utils/token.js';
//Create Express app and HTTP server
const app = express();
const server = http.createServer(app);

// ... (Socket.io setup remains the same)
export const io = new Server(server, {
    cors: { origin: "*" }
});
export const userSocketMap = {};
io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    console.log("User Connected", userId);
    if (userId) userSocketMap[userId] = socket.id;
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
    socket.on("disconnect", () => {
        console.log("User Disconnected", userId);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

//Middleware
app.use(express.json({ limit: "4mb" }));
// FIX: Configure CORS to allow your frontend to communicate with the backend
app.use(cors({
    origin: "http://localhost:5173", // Your frontend URL
    credentials: true
}));
app.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(
    new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: 'http://localhost:5000/auth/google/callback'
    },
        // This function is the key. It runs after Google authenticates the user.
        async (accessToken, refreshToken, profile, done) => {
            try {
                // 1. Check if a user with this Google ID already exists in your database
                let user = await User.findOne({ googleId: profile.id });

                if (user) {
                    // If user exists, continue with that user
                    return done(null, user);
                } else {
                    // 2. If user does not exist, create a new user in your database
                    const newUser = new User({
                        googleId: profile.id,
                        fullName: profile.displayName,
                        email: profile.emails[0].value,
                        profilePic: profile.photos[0].value,
                        // You might want a default bio or leave it empty
                        bio: 'No bio yet.'
                    });
                    await newUser.save();
                    return done(null, newUser);
                }
            } catch (error) {
                return done(error, null);
            }
        })
);

// Store the user's database _id in the session
passport.serializeUser((user, done) => {
    done(null, user._id);
});

// Retrieve the full user object from the database using the _id from the session
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

// Your existing Google auth routes
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
app.get('/auth/google/callback',
    passport.authenticate('google', {
        failureRedirect: 'http://localhost:5173/login', // Redirect to login on failure
        session: false // We are not using sessions, we are using JWTs
    }),
    (req, res) => {
        // Successful authentication, redirect to frontend with token.
        // req.token was attached in the GoogleStrategy callback
        const token = generateToken(req.user._id);
        res.redirect(`http://localhost:5173/auth/callback?token=${token}`);
    }
);
// --- NEW ROUTE TO GET CURRENT USER ---

app.use('/api/auth', userRouter);
app.use('/api/messages', messageRouter);

// --- SERVER STARTUP ---
await connectToDB();

if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
        console.log(`Server is running on PORT: ${PORT}`);
    });
}

//export server for vercel
export default server
