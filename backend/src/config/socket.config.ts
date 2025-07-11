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

// ---------------- CHAT SOCKET ----------------
io.on("connection", (socket) => {
  socket.on("sendMessage", ({ workspaceId, messageData }) => {
    socket.to(workspaceId).emit("receiveMessage", messageData);
  });

  socket.on("joinWorkspace", (workspaceId: string) => {
    socket.join(workspaceId);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

// ---------------- WHITEBOARD SOCKET ----------------
const whiteboardRooms = new Map<
  string,
  {
    roomName: string;
    roomId: string;
    workspaceId: string;
    creator: {
      userId: string;
      userName: string;
      host: boolean;
    };
    users: {
      userId: string;
      userName: string;
      host: boolean;
      socketId: string;
    }[];
  }
>();

const whiteboardNamespace = io.of("/whiteboard");

whiteboardNamespace.on("connection", (socket) => {
  console.log("User Joined (Whiteboard):", socket.id);

  socket.on("createRoom", (data, callback) => {
    const { roomName, roomId, workspaceId, userId, userName, host } = data;

    if (whiteboardRooms.has(roomId)) {
      return callback({ success: false, message: "Room already exists" });
    }

    whiteboardRooms.set(roomId, {
      roomName,
      roomId,
      workspaceId,
      creator: { userId, userName, host },
      users: [],  
    });

    console.log(`Room created: ${roomId}`);
    callback({ success: true });
  });

  
  socket.on("joinRoom", (data, callback) => {
    const { roomId, roomName, workspaceId, userId, userName, host } = data;
    const room = whiteboardRooms.get(roomId);

    if (!room || room.roomName !== roomName || room.roomId !== roomId) {
      return callback({ success: false, message: "Room not found" });
    }

    if (room.workspaceId !== workspaceId) {
      return callback({ success: false, message: "Wrong Workspace" });
    }

    const alreadyInRoom = room.users.some((user) => user.userId === userId);

    if (room.creator.userId === userId && !alreadyInRoom) {
      room.users.unshift({
        ...room.creator,
        socketId: socket.id,
      });
    }

   
    else if (!alreadyInRoom) {
      room.users.push({
        userId,
        userName,
        host,
        socketId: socket.id,
      });
    }

    socket.join(roomId);
    console.log(`User ${userName} joined room: ${roomId}`);

    whiteboardNamespace.to(roomId).emit("roomUserList", {
      users: room.users,
    });

    callback({ success: true });
  });

  
  socket.on("getRoomUsers", (roomId, callback) => {
    const room = whiteboardRooms.get(roomId);
    if (room) {
      callback({ users: room.users });
    } else {
      callback({ users: [] });
    }
  });

  socket.on("whiteboard-changes", ({ roomId, snapshot }) => {
    if (snapshot) {
      socket.to(roomId).emit("whiteboard-changes", snapshot);
    }
  });

  socket.on("message", (data) => {
    const { roomId, message, userId, userName} = data;

    socket.broadcast.to(roomId).emit("message", {
      message,
      userId,
      userName,
      timestamp: new Date().toISOString(),
    });
  });


  // leave Logic
  socket.on("leaveRoom", () => {
    console.log("User requested to leave room:", socket.id);
  
    for (const [roomId, room] of whiteboardRooms.entries()) {
      const userIndex = room.users.findIndex((u) => u.socketId === socket.id);
  
      if (userIndex !== -1) {
        const removedUser = room.users[userIndex];
        room.users.splice(userIndex, 1);
  
        console.log(`User ${removedUser.userName} left room: ${roomId}`);
  
        if (removedUser.host) {
          // 🚨 Host left — close room
          whiteboardNamespace.to(roomId).emit("roomClosed");
          whiteboardRooms.delete(roomId);
          console.log(`Room ${roomId} closed by host`);
        } else {
          // Notify remaining users
          whiteboardNamespace.to(roomId).emit("roomUserList", {
            users: room.users,
          });
          
        }
  
        break;
      }
    }
  });
  
  // Disconnect Logic
  socket.on("disconnect", () => {
    console.log("User Disconnected (Whiteboard):", socket.id);
  
    for (const [roomId, room] of whiteboardRooms.entries()) {
      const userIndex = room.users.findIndex((u) => u.socketId === socket.id);
  
      if (userIndex !== -1) {
        const removedUser = room.users[userIndex];
        room.users.splice(userIndex, 1);
  
        console.log(`User ${removedUser.userName} removed from room: ${roomId}`);
  
        // Just notify remaining users
        whiteboardNamespace.to(roomId).emit("roomUserList", {
          users: room.users,
        });

        if (room.users.length === 0) {
          whiteboardRooms.delete(roomId);
          console.log(`Room ${roomId} deleted (no users left)`);
        }
  
        break;
      }
    }
  });
  
});

export { io, app, server }; 