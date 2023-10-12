import dotenv from "dotenv";
dotenv.config();

const persistence = process.env.PERSISTENCE;

export {
    persistence,
};