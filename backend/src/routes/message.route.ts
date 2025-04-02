import { Router } from "express";
import { getMessages, sendMessage, clearMessages } from "../controllers/message.controller"; 
const messageRoutes = Router();
messageRoutes.get("/workspace/:workspaceId", getMessages);
messageRoutes.post("/workspace/:workspaceId", sendMessage);
messageRoutes.delete("/workspace/:workspaceId", clearMessages);
export default messageRoutes;
