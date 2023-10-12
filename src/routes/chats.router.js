import express from "express";
import { renderChatView } from "../controllers/chats.controller.js";

export const chatsRouter = express.Router();

chatsRouter.get("/", renderChatView);