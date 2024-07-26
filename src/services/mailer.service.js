import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USERNAME,
        pass: process.env.GMAIL_PASSWORD,
    },
});

export default {
    async send(props) {
        const {
            email,
            username,
            password,
        } = {
            ...props,
        };

        try {
            await transporter.sendMail({
                from: process.env.GMAIL_USERNAME,
                to: email,
                subject: 'StudyMath',
                html: `
                    <h3>Tài khoản của StudyMath</h3>    
                    <p>Tài khoản: ${username}</p>    
                    <p>Mật khẩu: ${password}</p>
                `,
            });
        }
        catch (err) {
            console.log(err);
        }
    }
}