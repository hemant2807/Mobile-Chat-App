import { Server } from "socket.io";
import http from "http";
import express from "express";
import Message from "../models/message.model.js";

const app = express();
const server = http.createServer(app);

// Map<userId, Set<socketId>>
const userSocketMap = new Map();

export const getReceiverSocketId = (receiverId) => {
  const sockets = userSocketMap.get(receiverId);
  if (!sockets || sockets.size === 0) return null;
  return Array.from(sockets); // return all sockets
};

const io = new Server(server, {
  cors: {
    origin: "*", // allow Expo LAN device
    credentials: true,
  },
});

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  if (userId && userId !== "undefined") {
    // store multiple sockets per user
    if (!userSocketMap.has(userId)) {
      userSocketMap.set(userId, new Set());
    }
    userSocketMap.get(userId).add(socket.id);

    io.emit("user:online", userId);
    console.log(`User online: ${userId}`);
  }

  // send typing start
  socket.on("typing start", (receiverId) => {
    const receivers = getReceiverSocketId(receiverId);
    if (receivers) {
      receivers.forEach((sid) =>
        io.to(sid).emit("typing start", { from: userId })
      );
    }
  });

  // send typing stop
  socket.on("typing stop", (receiverId) => {
    const receivers = getReceiverSocketId(receiverId);
    if (receivers) {
      receivers.forEach((sid) =>
        io.to(sid).emit("typing stop", { from: userId })
      );
    }
  });

  // mark message as read
  socket.on("message:read", async (messageId) => {
    try {
      const updated = await Message.findByIdAndUpdate(
        messageId,
        { read: true },
        { new: true }
      );

      if (!updated) return;

      const senderSockets = getReceiverSocketId(updated.senderId.toString());

      if (senderSockets) {
        senderSockets.forEach((sid) =>
          io.to(sid).emit("message:read", updated)
        );
      }
    } catch (error) {
      console.log("message:read error", error.message);
    }
  });

  // disconnect handler
  socket.on("disconnect", () => {
    if (userId) {
      const set = userSocketMap.get(userId);
      if (set) {
        set.delete(socket.id);
        if (set.size === 0) {
          userSocketMap.delete(userId);
          io.emit("user:offline", userId);
          console.log(`User offline: ${userId}`);
        }
      }
    }
  });
});

export { app, io, server };
