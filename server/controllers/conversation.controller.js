import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { getReceiverSocketId } from "../socket/socket.js";

export const getConversations = async (req, res) => {
  try {
    const userId = req.user._id;

    const conversations = await Conversation.aggregate([
      {
        $match: { participants: userId },
      },
      {
        $lookup: {
          from: "messages",
          localField: "messages",
          foreignField: "_id",
          as: "messagesData",
        },
      },
      {
        $addFields: {
          lastMessageObj: { $arrayElemAt: ["$messagesData", -1] },
        },
      },
      {
        $project: {
          _id: 1,
          participants: 1,
          lastMessage: "$lastMessageObj.message",
          lastMessageTime: "$lastMessageObj.createdAt",
          senderId: "$lastMessageObj.senderId",
          receiverId: "$lastMessageObj.receiverId",
          delivered: "$lastMessageObj.delivered",
          read: "$lastMessageObj.read",
        },
      },
    ]);

    const formatted = conversations.map((c) => {
      const other = c.participants.find(
        (p) => p.toString() !== userId.toString()
      );
      return {
        ...c,
        userId: other,
      };
    });

    res.status(200).json(formatted);
  } catch (err) {
    console.log("getConversations Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
