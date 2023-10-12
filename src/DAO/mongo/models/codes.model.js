import {Schema, model} from "mongoose";

const schema = new Schema({
    code: { type: String, required: true },
    email: { type: String, required: true },
    expire: { type: Number, required: true },
});

export const CodesModel = model('codes', schema);
 