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
  // console.log("User Connected", socket.id);

  socket.on("sendMessage", ({ workspaceId, messageData }) => {
    // console.log({ workspaceId, messageData });
    socket.to(workspaceId).emit("receiveMessage", messageData);
  });

  socket.on("joinWorkspace", (workspaceId: string) => {
    socket.join(workspaceId);
    // console.log(`User joined room ${workspaceId}`);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});


// ---------------- WHITEBOARD SOCKET (custom namespace) ----------------

// In-memory store for rooms and their users
const whiteboardRooms = new Map<
  string,
  {
    roomName: string;
    roomId: string;
    workspaceId: string,
    users: {
      userId: string;
      userName: string;
      host: boolean;
      presenter: boolean;
    }[];
  }
>();

const whiteboardNamespace = io.of("/whiteboard");

whiteboardNamespace.on("connection", (socket) => {
  console.log("User Joined (Whiteboard):", socket.id);

  socket.on("createRoom", (data, callback) => {
    const { roomName, roomId, workspaceId, userId, userName, host, presenter } = data
    if (whiteboardRooms.has(roomId)) {
      return callback({ success: false, message: "Room already exists" });
    }

    whiteboardRooms.set(roomId, {
      roomName,
      roomId,
      workspaceId,
      users: [{ userId, userName, host, presenter }],
    });
    socket.join(roomId);
    console.log(`Room created: ${roomId}`);
    callback({ success: true });
  });


  // Join room
  socket.on("joinRoom", (data, callback) => {
    const { roomId, roomName, workspaceId, userId, userName, host, presenter } = data;
    const room = whiteboardRooms.get(roomId);

    if (!room || room.roomName !== roomName || room.roomId !== roomId) {
      return callback({ success: false, message: "Room not found" });
    }

    if (room.workspaceId !== workspaceId) {
      return callback({ success: false, message: "Wrong Workspace" });
    }

    const alreadyInRoom = room.users.some((user) => user.userId === userId);
    if (!alreadyInRoom) {
      room.users.push({ userId, userName, host, presenter});
    }

    socket.join(roomId);
    console.log(`User ${userName} joined room: ${roomId}`);
    
    
    // ✅ Only send updated user list (no count)
    whiteboardNamespace.to(roomId).emit("roomUserList", {
      users: room.users
    });
    console.log(room.users)

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




  // socket.on("draw", ({ boardId, drawingData }) => {
  //   socket.to(boardId).emit("draw", drawingData);
  // });

  // socket.on("disconnect", () => {
  //   console.log("User Disconnected (Whiteboard):", socket.id);
  
  //   // Loop through all rooms to find which room this socket belonged to
  //   for (const [roomId, room] of whiteboardRooms.entries()) {
  //     const userIndex = room.users.findIndex((u) => u.socketId === socket.id);
  
  //     if (userIndex !== -1) {
  //       const disconnectedUser = room.users[userIndex];
  //       room.users.splice(userIndex, 1); // Remove user
  
  //       console.log(`User ${disconnectedUser.userName} removed from room: ${roomId}`);
  
  //       // Notify remaining users in the room
  //       whiteboardNamespace.to(roomId).emit("roomUserList", {
  //         users: room.users,
  //       });
  
  //       // Optionally: Clean up the room if no users remain
  //       if (room.users.length === 0) {
  //         whiteboardRooms.delete(roomId);
  //         console.log(`Room ${roomId} deleted (no users left)`);
  //       }
  
  //       break; // Stop after finding the relevant room
  //     }
  //   }
  // });
  
});

export { io, app, server };