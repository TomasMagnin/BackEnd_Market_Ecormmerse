import express from "express";     
import { SessionsController } from '../controllers/sessions.controller.js';
const sessionsController = new SessionsController()

export const sessionsRouter = express.Router();


sessionsRouter.get('/show', sessionsController.renderSessionView);
sessionsRouter.get('/current', sessionsController.getCurrentUser);
