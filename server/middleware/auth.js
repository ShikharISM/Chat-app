import User from "../models/userModel.js"
import jwt from "jsonwebtoken"

export const AuthUser = async (req,res,next) => {
    try {
        const token = req.headers.token
        const decoded  = jwt.verify(token,process.env.SECRET_KEY) 
        const user = await User.findById(decoded.userId).select("-password")
        if(!user){
            return res.json({success:false, message: "User Not Found"})
        }
        req.user = user
        next()
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}