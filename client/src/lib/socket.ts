import { Socket, io } from "socket.io-client";
export const socket: Socket = io(import.meta.env.VITE_API_SOCKET_BASE_URL, {
});
