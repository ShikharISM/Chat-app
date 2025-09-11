import express from 'express'
import { AuthUser } from '../middleware/auth.js'
import { getMessages, getUsersforSidebar, markMessageAsSeen, sendMessage } from '../controllers/messageController.js'

const messageRouter = express.Router()

messageRouter.get('/users',AuthUser,getUsersforSidebar)
messageRouter.get('/:id',AuthUser,getMessages)
messageRouter.put('/mark/:id',AuthUser,markMessageAsSeen) // put is used as we only update the data
messageRouter.post('/send/:id', AuthUser, sendMessage)
export default messageRouter
