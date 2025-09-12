import nodemailer from 'nodemailer'
import User from '../models/userModel.js'
import bcryptjs from 'bcryptjs'

export const sendEmail = async ({ email, userId }) => {
    try {
        // create a new hashed token 
        const hashedToken = await bcryptjs.hash(userId.toString(), 10)
        await User.findByIdAndUpdate(userId,
            {
                verifyToken: hashedToken,
                verifyTokenExpiry: Date.now() + 3600000
            }
        )
        // Looking to send emails in production? Check out our Email API/SMTP product!
        var transport = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: "cdba68c5318648",
                pass: "67f34b64e6cb46"
            }
        });

        const mailOptions = {
            from : "shikharyadav885@gmail.com",
            to: email,
            subject: 'Reset your Password',
        }
        const mailresponse = await transport.sendMail(mailOptions)
        // return mailresponse

    } catch (error) {
        console.log(error)
    }
}