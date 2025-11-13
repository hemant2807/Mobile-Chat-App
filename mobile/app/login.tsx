import { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import API from "./config/api";
import { useRouter } from "expo-router";

export default function LoginScreen() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const { data } = await API.post("/auth/login", { username, password });
      router.replace("/chatlist");
    } catch (err: any) {
      Alert.alert("Login Failed", err.response?.data?.error || "Server error");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Guftagu Login</Text>

      <TextInput
        placeholder="Username"
        style={styles.input}
        value={username}
        onChangeText={setUsername}
      />

      <TextInput
        placeholder="Password"
        style={styles.input}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Button title="Login" onPress={handleLogin} />

      <Text style={styles.link} onPress={() => router.push("/register")}>
        New user? Register here
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: { borderWidth: 1, padding: 10, borderRadius: 5, marginBottom: 10 },
  link: { marginTop: 10, color: "blue", textAlign: "center" },
});
