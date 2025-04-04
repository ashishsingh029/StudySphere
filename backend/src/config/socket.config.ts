import { Server } from "socket.io";
import http from "http";
import express from "express";
import { config } from "./app.config";
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [config.FRONTEND_ORIGIN],
  },
});

io.on("connection", (socket) => {
  console.log("User Connected", socket.id);

  socket.on("sendMessage", ({ workspaceId, messageData }) => {
    console.log({ workspaceId, messageData });
    socket.to(workspaceId).emit("receiveMessage", messageData);
  });

  socket.on("joinWorkspace", (workspaceId: string) => {
    socket.join(workspaceId);
    console.log(`User joined room ${workspaceId}`);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

export { io, app, server };
