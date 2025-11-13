import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getSocket } from "../../SocketClient";
import API from "../config/api";
import { useOnline } from "../context/OnlineContext";

export default function ChatScreen() {
  const router = useRouter();
  const socket = getSocket();
  const { onlineUsers } = useOnline();

  const { id, name, avatar } = useLocalSearchParams();
  const chatUserId = Array.isArray(id) ? id[0] : id;
  const displayName = Array.isArray(name) ? name[0] : name;
  const avatarPic = Array.isArray(avatar) ? avatar[0] : avatar;

  const [loggedUser, setLoggedUser] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");
  const [typing, setTyping] = useState(false);

  const flatRef = useRef<FlatList>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const load = async () => {
      const u = await AsyncStorage.getItem("user");
      if (u) setLoggedUser(JSON.parse(u));
    };
    load();
  }, []);

  useEffect(() => {
    if (!chatUserId) return;
    loadMessages();
  }, [chatUserId]);

  const loadMessages = async () => {
    try {
      const res = await API.get(`/messages/${chatUserId}`);
      setMessages(res.data || []);
      scrollBottom();
    } catch (err) {
      console.log("Message fetch error:", err);
    }
  };

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (msg: any) => {
      if (
        (msg.senderId === chatUserId && msg.receiverId === loggedUser?._id) ||
        (msg.senderId === loggedUser?._id && msg.receiverId === chatUserId)
      ) {
        setMessages((prev) => [...prev, msg]);
        scrollBottom();
      }
    };

    const handleTypingStart = ({ from }: { from: string }) => {
      if (from === chatUserId) setTyping(true);
    };

    const handleTypingStop = ({ from }: { from: string }) => {
      if (from === chatUserId) setTyping(false);
    };

    const handleReadUpdate = (updatedMsg: any) => {
      setMessages((prev) =>
        prev.map((m) => (m._id === updatedMsg._id ? updatedMsg : m))
      );
    };

    socket.on("newMessage", handleNewMessage);
    socket.on("typing start", handleTypingStart);
    socket.on("typing stop", handleTypingStop);
    socket.on("message:read", handleReadUpdate);

    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("typing start", handleTypingStart);
      socket.off("typing stop", handleTypingStop);
      socket.off("message:read", handleReadUpdate);
    };
  }, [socket, loggedUser, chatUserId]);

  const scrollBottom = () => {
    setTimeout(() => flatRef.current?.scrollToEnd({ animated: true }), 150);
  };

  const sendMessage = async () => {
    if (!text.trim()) return;
    const msgText = text.trim();
    setText("");

    try {
      const res = await API.post(`/messages/send/${chatUserId}`, {
        message: msgText,
      });

      const saved = res.data;
      socket.emit("sendMessage", saved);

      setMessages((prev) => [...prev, saved]);
      scrollBottom();
    } catch (err) {
      console.log("Send error:", err);
    }
  };

  const onChangeText = (val: string) => {
    setText(val);

    if (!socket) return;

    socket.emit("typing start", chatUserId);

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("typing stop", chatUserId);
    }, 900);
  };

  const renderMessage = ({ item }: any) => {
    const isMe = item.senderId === loggedUser?._id;
    const time = new Date(item.createdAt).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    return (
      <View
        style={{
          width: "100%",
          paddingHorizontal: 12,
          marginVertical: 6,
          flexDirection: "row",
          justifyContent: isMe ? "flex-end" : "flex-start",
        }}
      >
        <View
          style={[styles.bubble, isMe ? styles.myBubble : styles.theirBubble]}
        >
          <Text style={{ color: isMe ? "#fff" : "#000", fontSize: 16 }}>
            {item.message}
          </Text>

          <View style={styles.metaRow}>
            <Text
              style={[
                styles.timeText,
                { color: isMe ? "rgba(255,255,255,0.8)" : "#6B7280" },
              ]}
            >
              {time}
            </Text>

            {isMe && (
              <>
                {!item.delivered && (
                  <Ionicons
                    name="checkmark"
                    size={16}
                    color="rgba(255,255,255,0.9)"
                    style={{ marginLeft: 4 }}
                  />
                )}
                {item.delivered && !item.read && (
                  <Ionicons
                    name="checkmark-done"
                    size={16}
                    color="rgba(255,255,255,0.9)"
                    style={{ marginLeft: 4 }}
                  />
                )}
                {item.read && (
                  <Ionicons
                    name="checkmark-done"
                    size={16}
                    color="#34B7F1"
                    style={{ marginLeft: 4 }}
                  />
                )}
              </>
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color="#fff" />
        </TouchableOpacity>

        {avatarPic ? (
          <Image source={{ uri: avatarPic }} style={styles.avatar} />
        ) : null}

        <View style={{ flex: 1 }}>
          <Text style={styles.headerName}>{displayName}</Text>
          <Text style={styles.statusText}>
            {typing
              ? "typing..."
              : onlineUsers.includes(chatUserId)
              ? "online"
              : "offline"}
          </Text>
        </View>
      </View>

      <FlatList
        ref={flatRef}
        data={messages}
        keyExtractor={(item) => item._id}
        renderItem={renderMessage}
        contentContainerStyle={{ paddingVertical: 10, paddingBottom: 90 }}
        showsVerticalScrollIndicator={false}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.inputBox}
      >
        <TextInput
          placeholder="Message"
          style={styles.input}
          value={text}
          onChangeText={onChangeText}
        />
        <TouchableOpacity style={styles.sendBtn} onPress={sendMessage}>
          <Ionicons name="send" size={22} color="#fff" />
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ECE5DD" },

  header: {
    height: 80,
    backgroundColor: "#075E54",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    gap: 12,
  },
  avatar: { width: 45, height: 45, borderRadius: 22 },
  headerName: { fontSize: 18, color: "#fff", fontWeight: "700" },
  statusText: { fontSize: 12, color: "#d2f8d2" },

  bubble: {
    maxWidth: "78%",
    padding: 10,
    borderRadius: 16,
  },
  myBubble: {
    backgroundColor: "#075E54",
    borderBottomRightRadius: 4,
  },
  theirBubble: {
    backgroundColor: "#fff",
    borderBottomLeftRadius: 4,
  },

  metaRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 4,
    alignItems: "center",
  },
  timeText: { fontSize: 11 },

  inputBox: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 10,
    alignItems: "center",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  input: {
    flex: 1,
    height: 48,
    backgroundColor: "#f2f2f2",
    borderRadius: 24,
    paddingHorizontal: 16,
  },
  sendBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#075E54",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },
});
