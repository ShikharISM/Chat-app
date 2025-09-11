import { createContext, useContext, useEffect, useState } from "react";
import React from "react";
import { AuthContext } from "./AuthContext.jsx";
import { AuthUser } from "../../server/middleware/auth.js";
import toast from 'react-hot-toast'
export const ChatContext = createContext()

export const ChatProvider = ({ children }) => {

    const [messages, setmessages] = useState([]) // to get the messages of a selectedUser
    const [users, setusers] = useState([]) // to store the users for the siderbar
    const [selectedUser, setselectedUser] = useState(null)
    // will store the id of the user who we want to chat with 
    const { authUser } = useContext(AuthContext)
    const [unseenmessages, setunseenmessages] = useState({}) // userId: number of messages unseen

    const { socket, axios } = useContext(AuthContext)

    // function to get all users for the sidebar
    const getUsers = async () => {
        try {
            const { data } = await axios.get('/api/messages/users')
            if (data.success) {
                const otherusers = data.users.filter(u => u._id !== authUser._id)
                setusers(otherusers)
                setunseenmessages(data.unseenMessages || {})
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const getMessages = async (userId) => {
        try {
            const {data} = await axios.get(`/api/messages/${userId}`);
            if (data.success) {
                setmessages(data.messages);
            }
        } catch (error) {
            console.error("Error fetching messages:", error);
            toast.error(error.message)
        }
    };

    // function to send message to the selected user 
    const sendMessage = async (messageData) => {
        try {
            const { data } = await axios.post(`/api/messages/send/${selectedUser._id}`, messageData)
            if (data.success) {
                setmessages((prevmessages) => [...prevmessages, data.newMessage])
            }
            else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    // function to subscribe to messages for selected user
    const subsribeToMessages = async () => {
        if (!socket) return;

        socket.on("newMessage", (newMessage) => {
            if (selectedUser && newMessage.senderId === selectedUser._id) { // chat box is open for the user
                newMessage.seen = true
                setmessages((prevMessages) => [...prevMessages, newMessage])
                axios.put(`/api/messages/mark/${newMessage._id}`)
            }
            else {
                setunseenmessages((prevUnseenMessages) => ({
                    ...prevUnseenMessages, [newMessage.senderId]: prevUnseenMessages[newMessage.senderId] ? prevUnseenMessages[newMessage.senderId] + 1 : 1
                }))
            }
        })
    }

    // function to unsubscribe from messages
    const unsubscribeFromMessages = () => {
        if (socket) socket.off("newMessage")
    }

    useEffect(() => {
        subsribeToMessages()
        return () => unsubscribeFromMessages();
    }, [socket, selectedUser])

    const value = {
        getUsers,
        messages,
        users,
        selectedUser,
        sendMessage,
        setselectedUser,
        unseenmessages,
        setunseenmessages,
        getMessages,
        setmessages,

    }
    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>)
}