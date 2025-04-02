import mongoose, { Document, Schema } from "mongoose";
export interface MessageDocument extends Document {
  senderId: mongoose.Types.ObjectId;
  workspaceId: mongoose.Types.ObjectId;
  senderName: string;
  text: string;
  file: string;
  fileName: string;
}
const messageSchema = new Schema<MessageDocument>(
  {
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    workspaceId: {
      type: Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },
    senderName: {
      type: String,
      required: true,
    },
    text: {
      type: String,
    },
    file: {
      type: String,
    },
    fileName: {
      type: String,
    }
  },
  { timestamps: true }
);
const MessageModel =
  mongoose.models.Message ||
  mongoose.model<MessageDocument>("Message", messageSchema);
export default MessageModel;
