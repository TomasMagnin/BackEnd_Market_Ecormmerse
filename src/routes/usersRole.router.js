import express from "express";
import { UsersController } from "../controllers/usersRole.controller.js";
import { AuthController } from "../controllers/auth.controller.js";
const usersController = new UsersController()
const authController = new AuthController()
import upload from "../middlewares/multer.js";


export const usersRoleRouter = express.Router();
 

usersRoleRouter.put('/premium/:uid', usersController.toggleUserRole);
usersRoleRouter.delete('/:uid', usersController.deleteUser);
usersRoleRouter.post('/:uid/documents', upload.fields([{name: 'identification', maxCount: 1}, {name: 'address', maxCount: 1}, {name: 'stateaccount', maxCount: 1}]), authController.uploadDocuments);