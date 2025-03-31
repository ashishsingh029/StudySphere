import { Router } from "express";
import { joinWorkspaceController, removeMemberFromWorkspaceController } from "../controllers/member.controller";

const memberRoutes = Router();

memberRoutes.post("/workspace/:inviteCode/join", joinWorkspaceController);
memberRoutes.delete("/:memberId/workspace/:workspaceId", removeMemberFromWorkspaceController)
export default memberRoutes;
