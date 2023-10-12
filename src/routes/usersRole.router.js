import express from "express";
import { usersRoleController } from "../controllers/usersRole.controller.js";
import { AuthController } from '../controllers/auth.controller.js';
const authController = new AuthController()
import { upload } from '../middlewares/multer';


export const usersRoleRouter = express.Router();
 
usersRoleRouter.put('/premium/:uid', usersRoleController.toggleUserRole);

usersRoleRouter.post('/:uid/documents', upload.array('files'), authController.uploadDocuments);