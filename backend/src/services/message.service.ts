import MessageModel from "../models/message.model";
import cloudinary from "../config/cloudinary.config";
export const getMessagesByWorkspaceIdService = async (workspaceId: string) => {
  let messages = await MessageModel.find({ workspaceId });
  return messages;
};
export const sendMessageByUserService = async (
  senderId: string,
  workspaceId: string,
  senderName: string | undefined,
  text?: string,
  file?: string,
  filename?: string
) => {
  let fileUrl;
  if (file) {
    const uploadResponse = await cloudinary.uploader.upload(file);
    fileUrl = uploadResponse.secure_url;
  }
  const newMessage = new MessageModel({
    senderId,
    workspaceId,
    senderName,
    text,
    file: fileUrl,
    fileName: filename
  });
  await newMessage.save();
  return newMessage;
};
export const deleteAllMessagesInWorkspaceService = async (workspaceId: string) => {
  await MessageModel.deleteMany({ workspaceId });
}