import { Request, Response } from "express";
import { z } from "zod";
import { HTTPSTATUS } from "../config/http.config";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { getMessagesByWorkspaceIdService, sendMessageByUserService,deleteAllMessagesInWorkspaceService } from "../services/message.service";
import { roleGuard } from "../utils/roleGuard";
import { Permissions } from "../enums/role.enum";
import { getMemberRoleInWorkspace } from "../services/member.service";
export const getMessages = asyncHandler(async (req: Request, res: Response) => {
  const workspaceId = z.string().parse(req.params.workspaceId);
  let { role } = await getMemberRoleInWorkspace(req.user?._id, workspaceId)
  roleGuard(role , [Permissions.VIEW_ONLY])
  let messages = await getMessagesByWorkspaceIdService(workspaceId);
  return res.status(HTTPSTATUS.OK).json({
    message: "Messages fetched successfully",
    messages,
  });
});
export const sendMessage = asyncHandler(async (req: Request, res: Response) => {
  const workspaceId = z.string().parse(req.params.workspaceId);
  const userId = req.user?._id;
  // console.log("Req.body = ", req.body)
  let { text, file } = req.body
  let { role } = await getMemberRoleInWorkspace(userId, workspaceId)
  roleGuard(role , [Permissions.VIEW_ONLY])
  let sentMessage = await sendMessageByUserService(userId, workspaceId, text, file);
  return res.status(HTTPSTATUS.OK).json({
    message: "Message Sent successfully",
    sentMessage,
  });
});
export const clearMessages = asyncHandler(async (req: Request, res: Response) => {
  const workspaceId = z.string().parse(req.params.workspaceId);
  const userId = req.user?._id;
  let { role } = await getMemberRoleInWorkspace(userId, workspaceId)
  roleGuard(role , [Permissions.DELETE_WORKSPACE])
  await deleteAllMessagesInWorkspaceService(workspaceId);
  return res.status(HTTPSTATUS.OK).json({
    message: "Messages Deleted successfully",
  });
});
