import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { z } from "zod";
import { HTTPSTATUS } from "../config/http.config";
import { getMemberRoleInWorkspace, joinWorkspaceByInviteService, removeMemberFromWorkspaceServive } from "../services/member.service";
import { roleGuard } from "../utils/roleGuard";
import { Permissions } from "../enums/role.enum";

export const joinWorkspaceController = asyncHandler(
  async (req: Request, res: Response) => {
    const inviteCode = z.string().parse(req.params.inviteCode);
    const userId = req.user?._id;

    const { workspaceId, role } = await joinWorkspaceByInviteService(
      userId,
      inviteCode
    );

    return res.status(HTTPSTATUS.OK).json({
      message: "Successfully joined the workspace",
      workspaceId,
      role,
    });
  }
);
export const removeMemberFromWorkspaceController = asyncHandler(
  async (req: Request, res: Response) => {
    const workspaceId = z.string().parse(req.params.workspaceId);
    const memberId = z.string().parse(req.params.memberId);
    // const userId = req.user?._id;
    await removeMemberFromWorkspaceServive(memberId, workspaceId);
    return res.status(HTTPSTATUS.OK).json({
      message: "Successfully Removed From workspace"
    });
  }
)
