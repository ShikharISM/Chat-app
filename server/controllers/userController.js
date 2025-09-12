import User from "../models/userModel.js"
import jwt from "jsonwebtoken"
import { generateToken } from "../utils/token.js"
import cloudinary from "../lib/cloudinary.js"
import bcrypt from 'bcryptjs'
import nodemailer from 'nodemailer'

// Sign Up or Authenticate a new user
const SignUpUser = async (req, res) => {
    const { fullName, email, password, bio } = req.body

    try {
        if (!fullName || !email || !password || !bio) {
            return res.json({ success: false, message: "Missing Details" })
        }
        const user = await User.findOne({ email })
        if (user) {
            return res.json({ success: false, message: "Account Already exists" })
        }

        const salt = await bcrypt.genSalt(10)
        const encryptpass = await bcrypt.hash(password, salt)

        const newUser = await User.create({
            fullName, email, password: encryptpass, bio
        })

        const token = generateToken(newUser._id)
        res.json({ success: true, userData: newUser, token, message: "New User Created Successfully!!" })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// Login the User
const LoginUser = async (req, res) => {
    try {
        const { email, password } = req.body
        const userData = await User.findOne({ email })
        if (!userData) {
            return res.json({ success: false, message: "Account do not exists." })
        }
        if (!userData.password) {
            return res.status(400).json({
                message: "This account was created with Google. Please log in with Google."
            });
        }
        const isPassword = await bcrypt.compare(password, userData.password)
        if (!isPassword) {
            return res.json({ success: false, message: "Enter correct credentials." })
        }
        const token = generateToken(userData._id)
        res.json({ success: true, userData, token, message: "Logged in successfully!!" })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// To check if user is Authenticated or not
const checkAuth = (req, res) => {
    res.json({ success: true, user: req.user })
}

// To update the user profile details
const updateProfile = async (req, res) => {
    try {
        const { profilePic, bio, fullName } = req.body
        const userId = req.user._id
        let updatedUser;
        if (!profilePic) {
            updatedUser = await User.findByIdAndUpdate(userId, { bio, fullName }, { new: true })
        }
        else {
            const upload = await cloudinary.uploader.upload(profilePic)
            updatedUser = await User.findByIdAndUpdate(userId, { profilePic: upload.secure_url, bio, fullName }, { new: true })
        }
        res.json({ success: true, user: updatedUser })

    } catch (error) {
        console.log(error)
        return res.json({ success: false, message: error.message })
    }
}

const verifyEmail = async (req, res) => {
    try {
        const { email } = req.body
        const user = await User.findOne({ email })
        if (!user) {
            return res.json({ success: false, message: "User not found" })
        }
        const newPasswordToken = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: "15m" })
        user.verifyToken = newPasswordToken
        user.verifyTokenExpiry = Date.now() + 15 * 60 * 1000
        await user.save()

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            },
        });

        const resetLink = `http://localhost:5173/reset-password/${newPasswordToken}`

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: "Reset Password Link",
            html: `<p>Click <a href = "${resetLink}">here</a> to reset your password. This link expires in 15 minutes. </p>`
        })

        res.json({ success: true, message: "Reset Link sent to your email. ", newPasswordToken, user })
    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}

const resetPassword = async (req, res) => {
    const { token } = req.params
    const { newPassword } = req.body

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY)
        const user = await User.findById(decoded.id)
        if (!user) return res.json({ success: false, message: "User Not Found" })

        if (user.verifyTokenExpiry < Date.now()) {
            return res.json({ success: false, message: "Token Expired" })
        }
        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(newPassword, salt)

        user.verifyToken = undefined
        user.verifyTokenExpiry = undefined

        await user.save()

        res.json({ message: "Password Updated Successfully!!" })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

export { SignUpUser, LoginUser, checkAuth, updateProfile, verifyEmail, resetPassword }

