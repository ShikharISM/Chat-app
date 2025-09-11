import User from "../models/userModel.js"
import { generateToken } from "../utils/token.js"
import cloudinary from "../lib/cloudinary.js"
import bcrypt from 'bcryptjs'

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

export { SignUpUser, LoginUser, checkAuth, updateProfile }

