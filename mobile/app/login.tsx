import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "./config/api";

export default function Login() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      alert("Enter username & password");
      return;
    }

    try {
      setLoading(true);

      const res = await API.post("/auth/login", {
        username,
        password,
      });

      await AsyncStorage.setItem("user", JSON.stringify(res.data));

      router.replace("/chatlist");
    } catch (err: any) {
      console.log("LOGIN ERROR:", err.response?.data);
      alert(err?.response?.data?.error || "Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.push("/")}
        >
          <Ionicons name="chevron-back" size={28} color="#1F242D" />
        </TouchableOpacity>

        <Text style={styles.heading}>
          Welcome back! We've{"\n"}missed your presence here
        </Text>

        <View style={styles.inputBox}>
          <TextInput
            placeholder="Username"
            placeholderTextColor="#9CA3AF"
            style={styles.input}
            value={username}
            onChangeText={setUsername}
          />
        </View>

        <View style={styles.inputBox}>
          <TextInput
            placeholder="Password"
            placeholderTextColor="#9CA3AF"
            style={styles.input}
            secureTextEntry={!showPass}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            style={styles.eyeBtn}
            onPress={() => setShowPass(!showPass)}
          >
            <Ionicons
              name={!showPass ? "eye-off-outline" : "eye-outline"}
              size={20}
              color="#6B7280"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
          <Text style={styles.loginText}>
            {loading ? "Logging in..." : "Login"}
          </Text>
        </TouchableOpacity>

        <Text style={styles.bottomText}>
          Don’t have an account?{" "}
          <Text style={styles.signup} onPress={() => router.push("/register")}>
            SignUp
          </Text>
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 24,
  },
  inner: {
    flex: 1,
    marginTop: 60,
  },
  backBtn: {
    width: 48,
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  heading: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1F242D",
    marginTop: 40,
    lineHeight: 36,
  },
  inputBox: {
    marginTop: 25,
    height: 56,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 16,
    justifyContent: "center",
  },
  input: {
    fontSize: 16,
    color: "#111827",
  },
  eyeBtn: {
    position: "absolute",
    right: 16,
    top: 18,
  },
  loginBtn: {
    marginTop: 30,
    backgroundColor: "#1F242D",
    height: 56,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  loginText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
  bottomText: {
    marginTop: 30,
    textAlign: "center",
    fontSize: 16,
    color: "#6B7280",
  },
  signup: {
    color: "#1F242D",
    fontWeight: "700",
  },
});
