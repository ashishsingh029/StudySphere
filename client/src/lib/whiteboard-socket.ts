import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_API_SOCKET_BASE_URL;

const connectWhiteboardSocket = {
  forceNew: true,
  reconnectionAttempts: Infinity,
  timeout: 10000,
  transports: ["websocket"],
};


export const socket = io(`${SOCKET_URL}/whiteboard`, connectWhiteboardSocket);