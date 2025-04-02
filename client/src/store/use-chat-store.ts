import { create } from "zustand";
import API from "@/lib/axios-client";

interface Message {
  createdAt: string;
  text: string;
  file?: string;
  senderId: string;
  workspaceId: string;
}

interface ChatState {
  messages: Message[];
  getMessages: (workspaceId: string) => Promise<void>;
  sendMessage: (messageData: { text?: string, file?: any}, workspaceId: string) => Promise<void>;
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  getMessages: async (workspaceId) => {
    try {
      const res = await API.get(`chat/workspace/${workspaceId}`);
    //   console.log(res.data);
      set({ messages: res.data.messages });
    } catch (error: any) {
    //   toast.error(error.response?.data?.message || "Failed to load messages");
        console.log("Chat store set message error: ",error)
    }
  },

  sendMessage: async (messageData: any , workspaceId: string) => {
    try {
      console.log("message data: ", messageData)
      const res = await API.post(`chat/workspace/${workspaceId}`, messageData);
      set({ messages: [...get().messages, res.data.sentMessage ] });
    } catch (error: any) {
        console.log("Chat store sending message error: ",error);
    }
  },
}));
