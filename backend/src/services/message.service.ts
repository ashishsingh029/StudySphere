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
  file?: string
) => {
  let fileUrl;
  // console.log("Received file: ", file);
  if (file) {
    // Upload base64 image to cloudinary
    const uploadResponse = await cloudinary.uploader.upload(file);
    fileUrl = uploadResponse.secure_url;
  }
  const newMessage = new MessageModel({
    senderId,
    workspaceId,
    senderName,
    text,
    file: fileUrl,
  });
  await newMessage.save();
  return newMessage;
};
export const deleteAllMessagesInWorkspaceService = async (workspaceId: string) => {
  await MessageModel.deleteMany({ workspaceId });
}