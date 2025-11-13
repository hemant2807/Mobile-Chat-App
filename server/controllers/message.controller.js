import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const receiverId = req.params.id;
    const senderId = req.user._id;

    if (!message || !receiverId)
      return res.status(400).json({ error: "Missing fields" });

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
        messages: [],
        lastMessage: null,
        lastMessageAt: new Date(),
      });
    }

    const newMessage = await Message.create({
      senderId,
      receiverId,
      message,
      delivered: false,
      read: false,
      createdAt: new Date(),
    });

    const receiverSockets = getReceiverSocketId(receiverId);
    if (receiverSockets) {
      newMessage.delivered = true;
      await newMessage.save();
    }

    conversation.messages.push(newMessage._id);
    conversation.lastMessage = newMessage._id;
    conversation.lastMessageAt = new Date();
    await conversation.save();

    if (receiverSockets) {
      receiverSockets.forEach((sid) =>
        io.to(sid).emit("newMessage", newMessage)
      );
    }

    const senderSockets = getReceiverSocketId(senderId);
    if (senderSockets) {
      senderSockets.forEach((sid) => io.to(sid).emit("newMessage", newMessage));
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const userToChatId = req.params.id;
    const senderId = req.user._id;

    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, userToChatId] },
    }).populate("messages");

    if (!conversation) return res.status(200).json([]);

    const sortedMessages = conversation.messages.sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    );

    res.status(200).json(sortedMessages);
  } catch (error) {
    console.log("Error in getMessages:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
