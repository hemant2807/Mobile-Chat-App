import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import API from "./config/api";
import { useRouter, useFocusEffect } from "expo-router";
import { getSocket } from "../SocketClient";
import { useOnline } from "./context/OnlineContext";

type ConversationItem = {
  _id: string;
  userId: string;
  name?: string;
  profilePic?: string;
  lastMessage?: string | null;
  lastMessageTime?: string | null;
  delivered?: boolean;
  read?: boolean;
  unreadCount?: number;
  isOnline?: boolean;
  typing?: boolean;
};

export default function ChatList() {
  const router = useRouter();
  const socket = getSocket();
  const { onlineUsers, setOnlineUsers } = useOnline();

  const [loggedUser, setLoggedUser] = useState<any>(null);
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [search, setSearch] = useState("");
  const [menuVisible, setMenuVisible] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      const data = await AsyncStorage.getItem("user");
      if (data) setLoggedUser(JSON.parse(data));
    };
    loadUser();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchConversations();
    }, [loggedUser])
  );

  useEffect(() => {
    if (!socket) return;

    const handleUserOnline = (userId: string) => {
      setOnlineUsers((prev) =>
        prev.includes(userId) ? prev : [...prev, userId]
      );
      setConversations((prev) =>
        prev.map((c) => (c.userId === userId ? { ...c, isOnline: true } : c))
      );
    };

    const handleUserOffline = (userId: string) => {
      setOnlineUsers((prev) => prev.filter((id) => id !== userId));
      setConversations((prev) =>
        prev.map((c) => (c.userId === userId ? { ...c, isOnline: false } : c))
      );
    };

    const handleNewMessage = (msg: any) => {
      refreshConversationsFromMsg(msg);
    };

    const handleTypingStart = ({ from }: { from: string }) => {
      setConversations((prev) =>
        prev.map((c) => (c.userId === from ? { ...c, typing: true } : c))
      );
    };

    const handleTypingStop = ({ from }: { from: string }) => {
      setConversations((prev) =>
        prev.map((c) => (c.userId === from ? { ...c, typing: false } : c))
      );
    };

    socket.on("user:online", handleUserOnline);
    socket.on("user:offline", handleUserOffline);
    socket.on("newMessage", handleNewMessage);
    socket.on("typing start", handleTypingStart);
    socket.on("typing stop", handleTypingStop);

    return () => {
      socket.off("user:online", handleUserOnline);
      socket.off("user:offline", handleUserOffline);
      socket.off("newMessage", handleNewMessage);
      socket.off("typing start", handleTypingStart);
      socket.off("typing stop", handleTypingStop);
    };
  }, [socket, loggedUser]);

  const fetchConversations = async () => {
    if (!loggedUser) return;

    try {
      const res = await API.get("/conversations");
      const usersRes = await API.get("/users");

      const usersMap: Record<string, any> = {};
      usersRes.data.forEach((u: any) => (usersMap[u._id] = u));

      const convs = res.data.map((c: any) => {
        const other = usersMap[c.userId] || {};
        return {
          ...c,
          name: other.fullName || other.username,
          profilePic: other.profilePic,
          isOnline: onlineUsers.includes(c.userId),
          typing: false,
        };
      });

      convs.sort((a: any, b: any) => {
        const t1 = a.lastMessageTime
          ? new Date(a.lastMessageTime).getTime()
          : 0;
        const t2 = b.lastMessageTime
          ? new Date(b.lastMessageTime).getTime()
          : 0;
        return t2 - t1;
      });

      setConversations(convs);
    } catch (err) {
      console.log("Conversation fetch error", err);
    }
  };

  const refreshConversationsFromMsg = (msg: any) => {
    const otherId =
      msg.senderId === loggedUser?._id ? msg.receiverId : msg.senderId;

    setConversations((prev) => {
      const idx = prev.findIndex((c) => c.userId === otherId);

      const entry: ConversationItem = {
        _id: otherId,
        userId: otherId,
        name: prev[idx]?.name || msg.senderFullName || "Unknown",
        profilePic: prev[idx]?.profilePic,
        lastMessage: msg.message,
        lastMessageTime: msg.createdAt,
        delivered: msg.delivered,
        read: msg.read,
        unreadCount:
          msg.senderId !== loggedUser?._id
            ? (prev[idx]?.unreadCount || 0) + 1
            : prev[idx]?.unreadCount || 0,
        isOnline: onlineUsers.includes(otherId),
        typing: false,
      };

      if (idx >= 0) {
        const list = [...prev];
        list.splice(idx, 1);
        return [entry, ...list];
      } else {
        return [entry, ...prev];
      }
    });
  };

  const openChat = (conv: ConversationItem) => {
    setMenuVisible(false);
    router.push({
      pathname: "/chat/[id]",
      params: {
        id: conv.userId,
        name: conv.name,
        avatar: conv.profilePic,
      },
    });
  };

  const logout = async () => {
    const socket = getSocket();
    if (socket) socket.disconnect();

    await AsyncStorage.clear();
    setMenuVisible(false);
    router.replace("/login");
  };

  const renderLastMessage = (c: ConversationItem) => {
    if (c.typing) return "typing…";
    if (!c.lastMessage) return "Tap to start chatting";
    return c.lastMessage.length > 40
      ? c.lastMessage.slice(0, 40) + "..."
      : c.lastMessage;
  };

  const formatTime = (iso?: string | null) => {
    if (!iso) return "";
    const d = new Date(iso);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const renderItem = ({ item }: { item: ConversationItem }) => (
    <TouchableOpacity style={styles.chatItem} onPress={() => openChat(item)}>
      <View>
        {item.profilePic && (
          <Image source={{ uri: item.profilePic }} style={styles.avatar} />
        )}
        {item.isOnline && <View style={styles.onlineDot} />}
      </View>

      <View style={styles.chatInfo}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={styles.name}>{item.name}</Text>
          {item.unreadCount ? (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{item.unreadCount}</Text>
            </View>
          ) : null}
        </View>

        <View
          style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}
        >
          {item.delivered || item.read ? (
            <Ionicons
              name="checkmark-done"
              size={14}
              color={item.read ? "#34B7F1" : "#6B7280"}
              style={{ marginRight: 6 }}
            />
          ) : null}
          <Text style={styles.lastMessage}>{renderLastMessage(item)}</Text>
        </View>
      </View>

      <Text style={styles.time}>{formatTime(item.lastMessageTime)}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Chats</Text>

        <TouchableOpacity onPress={() => setMenuVisible(!menuVisible)}>
          <Ionicons name="ellipsis-vertical" size={26} color="#fff" />
        </TouchableOpacity>
      </View>

      {menuVisible && (
        <TouchableOpacity style={styles.menuBox} onPress={logout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      )}

      <View style={styles.searchBox}>
        <Ionicons name="search" size={20} color="#6B7280" />
        <TextInput
          placeholder="Search"
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <FlatList
        data={conversations.filter((c) =>
          c.name?.toLowerCase().includes(search.toLowerCase())
        )}
        keyExtractor={(item) => item.userId}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  header: {
    height: 95,
    backgroundColor: "#075E54",
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingBottom: 15,
  },

  headerTitle: { color: "#fff", fontSize: 28, fontWeight: "700" },

  menuBox: {
    position: "absolute",
    top: 75,
    right: 16,
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    elevation: 6,
    zIndex: 50,
  },

  logoutText: {
    color: "red",
    fontWeight: "600",
    fontSize: 16,
  },

  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    height: 48,
    borderRadius: 30,
    margin: 16,
    paddingHorizontal: 16,
    gap: 10,
  },

  searchInput: { flex: 1, fontSize: 16, color: "#111827" },

  chatItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 0.4,
    borderColor: "#E5E7EB",
  },

  avatar: { width: 55, height: 55, borderRadius: 27 },

  onlineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#25D366",
    position: "absolute",
    bottom: 3,
    right: 3,
    borderWidth: 2,
    borderColor: "#fff",
  },

  chatInfo: { flex: 1, marginLeft: 14 },

  name: { fontSize: 17, fontWeight: "600", color: "#111827" },

  lastMessage: { fontSize: 14, color: "#6B7280" },

  time: { fontSize: 12, color: "#6B7280" },

  unreadBadge: {
    backgroundColor: "#25D366",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 8,
  },

  unreadText: { color: "#fff", fontSize: 12, fontWeight: "700" },
});
