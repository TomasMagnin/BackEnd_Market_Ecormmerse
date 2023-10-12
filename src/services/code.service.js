import { CodesModel } from '../DAO/mongo/models/codes.model.js';
import { UserModel } from '../DAO/mongo/models/users.model.js';
import {v4 as uuidv4 } from 'uuid';
import { transport } from "../utils/mailer.js";
import dotenv from "dotenv";
dotenv.config();

export class CodeService {
    async generateCode(email) {
        const code = uuidv4();
        const codeCreated = await CodesModel.create({email, code, expire: Date.now()+3600000});
        transport.sendMail({
            from: process.env.GOOGLE_EMAIL,
            to: email,
            subject: 'reset',
            html: `
                <div>
                    <p>Your code is: ${code}</p>
                    <a href="http://localhost:${process.env.PORT}/auth/resetPassword?code=${code}&email=${email}">click to reset</a>
                </div>
            `,
        });
    };

    async findCode(email, code) {
        const foundCode = await CodesModel.findOne({email, code});
        if(foundCode && foundCode.expire > Date.now()){
            return true;
        } else {
            return false;
        };
    };

    async updateUser(password) {
        const updateUser = await UserModel.updateOne({email}, {password});
    }
};

