import { Router } from "express";
import { getMessages, sendMessage } from "../controllers/message.controller"; 
const messageRoutes = Router();
messageRoutes.get("/workspace/:workspaceId", getMessages);
messageRoutes.post("/workspace/:workspaceId", sendMessage);
export default messageRoutes;
