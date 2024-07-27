import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const Type = {
    ACCOUNT_LOGIN_INFO: 'ACCOUNT_LOGIN_INFO',
    REMIND_QUESTION_DEADLINE: 'REMIND_QUESTION_DEADLINE',
}

function genContent(props) {
    const {
        type,
        content,
    } = {
        ...props,
    };

    switch (type) {
        case Type.ACCOUNT_LOGIN_INFO: {
            return `
                <h3>Tài khoản của StudyMath</h3>    
                <p>Tài khoản: ${content?.username}</p>    
                <p>Mật khẩu: ${content?.password}</p>
            `;
        }
        case Type.REMIND_QUESTION_DEADLINE: {
            return `
                <p>Nhắc nhở hạn làm bài toán ${content?.name}: ${content?.endDate?.toLocaleDateString('sv-SE')}</p>
            `;
        }
    }
}

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
            type,
            content,
        } = {
            ...props,
        };

        try {
            await transporter.sendMail({
                from: process.env.GMAIL_USERNAME,
                to: email,
                subject: 'StudyMath',
                html: genContent({
                    type: type,
                    content: content,
                }),
            });
        }
        catch (err) {
            console.log(err);
        }
    }
}