import { UserModel } from "../DAO/mongo/models/users.model.js";
import { transport } from "../utils/mailer.js";
import { DOCUMENT_TYPE } from "../utils/constants.js";
import path from "path";

import dotenv from "dotenv";
dotenv.config();


export class AuthService {
    async uploadDocuments(uid, files) {
        console.log(files);
        try {
            const user = await UserModel.findById(uid);
            if (!user) {
                return { status: 404, message: 'User not found.' };
            }
    
            const documents = [];
            
            Object.entries(files).forEach(([key, value]) => {
                let name = '';
                if(key === 'identification') {
                    name = DOCUMENT_TYPE.IDENTIFICATION
                } else if(key === 'stateaccount') {
                    name = DOCUMENT_TYPE.STATE_ACCOUNT
                } else if (key === 'address') {
                    name = DOCUMENT_TYPE.ADDRESS
                }
                const { base } = path.parse(value[0].path);
                const reference = `/uploads/documents/${base}`
                documents.push({
                    name, reference
                })
            })
            user.documents = documents;
            await user.save();
    
            return { status: 200, message: 'Documents uploaded successfully.' };
        } catch (error) {
            throw new Error('Error uploading documents: ' + error.message);
        }
    };

    async deleteInactiveUsers() {
        try {
            const cutoffDate = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
            const inactiveUsers = await UserModel.find({ last_connection: { $lt: cutoffDate } });
    
            const deletionEmails = [];
    
            for (const user of inactiveUsers) {
                deletionEmails.push(this.sendDeletionEmail(user.email));
                await UserModel.findByIdAndDelete(user._id);
            }
    
            await Promise.all(deletionEmails);
    
            return { numDeleted: inactiveUsers.length, numEmailsSent: deletionEmails.length };
        } catch (error) {
            throw new Error('Error deleting inactive users: ' + error.message);
        }
    }
    
    sendDeletionEmail = async (email) => {
        const mailOptions = {
            from: process.env.GOOGLE_EMAIL,
            to: email,
            subject: 'Your account has been deleted due to inactivity',
            html: `
            <p>Hello,</p>
            <p>Your account has been deleted due to inactivity.</p>
            <p>If you wish to re-activate your account, please contact our support team.</p>
            <p>Best regards,</p>
            <p>Your Application Team</p>
            `,
        };
    
        await transport.sendMail(mailOptions);
    };
}