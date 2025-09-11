import mongoose from "mongoose"

const connectToDB = async()=>{
    try {
        mongoose.connection.on('connected',()=>{
            console.log("DB Connected..")
        })
        await mongoose.connect(`${process.env.MONGODBURI}/chat-app`)
    } catch (error) {
        console.log(error)
    }   
}

export default connectToDB