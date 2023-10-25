import { Schema, model } from "mongoose";
import mongoosePaginate  from "mongoose-paginate-v2";       
 import { ROLES } from "../../../utils/constants.js";

const schema = new Schema({
    firstName: {type: String, required: true, max: 100},
    lastName: {type: String, required: true, max: 100},
    email: {type: String, required: true, max: 100, unique: true},
    age: {type: Number, required: false},
    password: {type: String, max: 100},
    cartID: {type: String, required: false},
    role: {type: String, enum: [ROLES.USER, ROLES.ADMIN, ROLES.PREMIUM], required: true, default: ROLES.USER},
    documents: [{ name: String, reference: String }],
    last_connection: {type: Date},
    },
    {versionKey: false}
);

schema.plugin(mongoosePaginate);                                                                                    
export const UserModel = model("users", schema);          
