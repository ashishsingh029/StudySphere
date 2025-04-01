import { Request, Response } from "express";
import { z } from "zod";
import { HTTPSTATUS } from "../config/http.config";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { getMessagesByWorkspaceIdService, sendMessageByUserService } from "../services/message.service";
export const getMessages = asyncHandler(async (req: Request, res: Response) => {
  const workspaceId = z.string().parse(req.params.workspaceId);
  let messages = await getMessagesByWorkspaceIdService(workspaceId);
  return res.status(HTTPSTATUS.OK).json({
    message: "Messages fetched successfully",
    messages,
  });
});
export const sendMessage = asyncHandler(async (req: Request, res: Response) => {
  const workspaceId = z.string().parse(req.params.workspaceId);
  const userId = req.user?._id;
  let { text, file } = req.body
  let sentMessage = await sendMessageByUserService(userId, workspaceId, text, file);
  return res.status(HTTPSTATUS.OK).json({
    message: "Messages Sent successfully",
    sentMessage,
  });
});
