import express from 'express'
import { checkAuth, LoginUser, SignUpUser, updateProfile } from '../controllers/userController.js'
import {AuthUser} from '../middleware/auth.js'

const userRouter = express.Router()

userRouter.post('/signup',SignUpUser)
userRouter.post('/login',LoginUser)
userRouter.put('/update-profile',AuthUser,updateProfile)
userRouter.get('/check', AuthUser, checkAuth )

export default userRouter