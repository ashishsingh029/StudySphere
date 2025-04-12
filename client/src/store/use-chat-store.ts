
import { create } from "zustand";
import API from "@/lib/axios-client";
import { socket } from "@/lib/socket";
import { Socket } from "socket.io-client";
interface Message {
  createdAt: string;
  text: string;
  file?: string;
  senderName: string;
  senderId: string;
  workspaceId: string;
  fileName?: string;
}

interface ChatState {
  messages: Message[];
  getMessages: (workspaceId: string) => Promise<void>;
  sendMessage: (messageData: { text?: string; file?: any }, workspaceId: string) => Promise<void>;
  isMessagesLoading: boolean;
  socket: Socket;
  setupSocketListeners: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  isMessagesLoading: false,
  socket,

  setupSocketListeners: () => {
    socket.off("receiveMessage");
    socket.on("receiveMessage", (newMessage: Message) => {
      set((state) => ({
        messages: [...state.messages, newMessage],
      }));
    });
  },

  getMessages: async (workspaceId: string) => {
    set({ isMessagesLoading: true });
    try {
      const res = await API.get(`chat/workspace/${workspaceId}`);
      set({ messages: res.data.messages });
    } catch (error: any) {
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData: any, workspaceId: string) => {
    try {
      const res = await API.post(`chat/workspace/${workspaceId}`, messageData);
      socket.emit("sendMessage", { messageData: res.data.sentMessage, workspaceId });
      set({ messages: [...get().messages, res.data.sentMessage] });
    } catch (error: any) {
    }
  },
}));
