import React, { useEffect, useState } from "react";
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
import { useRouter } from "expo-router";

export default function ChatList() {
  const router = useRouter();
  type User = {
    _id: string;
    fullName: string;
    profilePic: string;
  };

  const [user, setUser] = useState<any>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const loadUser = async () => {
      const data = await AsyncStorage.getItem("user");
      if (data) setUser(JSON.parse(data));
    };
    loadUser();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await API.get("/users");
        setUsers(res.data);
      } catch (err) {
        console.log("USER FETCH ERROR:", err);
      }
    };
    fetchUsers();
  }, []);

  const openChat = (receiver: User) => {
    router.push({
      pathname: "/chat",
      params: {
        userId: receiver._id,
        fullName: receiver.fullName,
        profilePic: receiver.profilePic,
      },
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Chats</Text>

        <TouchableOpacity>
          <Ionicons name="ellipsis-vertical" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchBox}>
        <Ionicons name="search" size={20} color="#6B7280" />
        <TextInput
          placeholder="Search"
          placeholderTextColor="#A1A1AA"
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <FlatList<User>
        data={users.filter((u: User) =>
          u.fullName.toLowerCase().includes(search.toLowerCase())
        )}
        keyExtractor={(item: User) => item._id}
        renderItem={({ item }: { item: User }) => (
          <TouchableOpacity
            style={styles.chatItem}
            onPress={() => openChat(item)}
          >
            <Image source={{ uri: item.profilePic }} style={styles.avatar} />

            <View style={styles.chatInfo}>
              <Text style={styles.name}>{item.fullName}</Text>
              <Text style={styles.lastMessage}>Tap to start chatting</Text>
            </View>

            <Text style={styles.time}>Now</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  header: {
    height: 90,
    backgroundColor: "#1F242D",
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingBottom: 15,
  },

  headerTitle: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "700",
  },

  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    height: 50,
    borderRadius: 30,
    marginHorizontal: 20,
    marginTop: 10,
    paddingHorizontal: 15,
    gap: 10,
  },

  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#111827",
  },

  chatItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 0.4,
    borderColor: "#E5E7EB",
  },

  avatar: {
    width: 55,
    height: 55,
    borderRadius: 27,
  },

  chatInfo: {
    flex: 1,
    marginLeft: 15,
  },

  name: {
    fontSize: 17,
    fontWeight: "600",
    color: "#1F242D",
  },

  lastMessage: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 2,
  },

  time: {
    fontSize: 12,
    color: "#6B7280",
  },
});
