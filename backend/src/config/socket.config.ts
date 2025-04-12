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

  // Create Room
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
      users: [], // Empty at first
    });

    console.log(`Room created: ${roomId}`);
    callback({ success: true });
  });

  // Join Room
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

    // Host joins → add creator to beginning of array
    if (room.creator.userId === userId && !alreadyInRoom) {
      room.users.unshift({
        ...room.creator,
        socketId: socket.id,
      });
    }

    // Participant joins
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

  // Get Room Users
  socket.on("getRoomUsers", (roomId, callback) => {
    const room = whiteboardRooms.get(roomId);
    if (room) {
      callback({ users: room.users });
    } else {
      callback({ users: [] });
    }
  });

  // Whiteboard Drawing Sync
  socket.on("whiteboard-changes", ({ roomId, snapshot }) => {
    if (snapshot) {
      socket.to(roomId).emit("whiteboard-changes", snapshot);
    }
  });

  // Message Handling
  socket.on("message", (data) => {
    const { roomId, message, userId, userName} = data;

    // Broadcast message to all users in the room except the sender
    socket.broadcast.to(roomId).emit("message", {
      message,
      userId,
      userName,
      timestamp: new Date().toISOString(),
    });
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

        // 🚨 If host left
        if (removedUser.host) {
          whiteboardNamespace.to(roomId).emit("roomClosed");
          whiteboardRooms.delete(roomId);
          console.log(`Room ${roomId} closed by host`);
        } else {
          // Notify remaining users
          whiteboardNamespace.to(roomId).emit("roomUserList", {
            users: room.users,
          });

          // Optional: delete room if no users remain
          // if (room.users.length === 0) {
          //   whiteboardRooms.delete(roomId);
          //   console.log(`Room ${roomId} deleted (no users left)`);
          // }
        }

        break; // exit loop once user is found
      }
    }
  });
});

export { io, app, server }; 