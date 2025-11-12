import { Server } from "socket.io";
import http from "http";
import express from "express";
import Message from "../models/Message.js";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
  },
});

const userSocketMap = new Map();

export const getReceiverSocketId = (receiverId) =>
  userSocketMap.get(receiverId);

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  if (userId && userId != "undefined") {
    userSocketMap.set(userId, socket.id);
    io.emit("user:online", userId);
    console.log(`User connected: ${userId}`);
  }

  socket.on("typing start", (receiverId) => {
    const receiverSocket = getReceiverSocketId(receiverId);
    if (receiverSocket) {
      io.to(receiverSocket).emit("typing start", { from: userId });
    }
  });

  socket.on("typing stop", (receiverId) => {
    const receiverSocket = getReceiverSocketId(receiverId);
    if (receiverSocket) {
      io.to(receiverSocket).emit("typing stop", { from: userId });
    }
  });

  socket.on("message:read", async (messageId) => {
    try {
      const updatedMsg = await Message.findByIdAndUpdate(
        messageId,
        { read: true },
        { new: true }
      );
      if (updatedMsg) {
        const senderSocket = getReceiverSocketId(
          updatedMsg.senderId.toString()
        );
        if (senderSocket) io.to(senderSocket).emit("message:read", updatedMsg);
      }
    } catch (error) {
      console.log("message:read error", err.message);
    }
  });

  socket.on("disconnect", () => {
    if (userId) {
      userSocketMap.delete(userId);
      io.emit("user:offline", userId);
      console.log(`user disconnected, ${userId}`);
    }
  });
});

export { app, io, server };
