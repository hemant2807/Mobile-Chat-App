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

export default function Register() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [gender, setGender] = useState<"male" | "female" | null>(null);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.push("/")}
        >
          <Ionicons name="chevron-back" size={28} color="#1F242D" />
        </TouchableOpacity>

        <Text style={styles.heading}>Register to start exploring</Text>

        <View style={styles.inputBox}>
          <TextInput
            placeholder="Full Name"
            placeholderTextColor="#9CA3AF"
            style={styles.input}
            value={fullName}
            onChangeText={setFullName}
          />
        </View>

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

        <View style={styles.inputBox}>
          <TextInput
            placeholder="Confirm Password"
            placeholderTextColor="#9CA3AF"
            style={styles.input}
            secureTextEntry={!showConfirm}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <TouchableOpacity
            style={styles.eyeBtn}
            onPress={() => setShowConfirm(!showConfirm)}
          >
            <Ionicons
              name={!showConfirm ? "eye-off-outline" : "eye-outline"}
              size={20}
              color="#6B7280"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.genderRow}>
          <TouchableOpacity
            style={styles.genderOption}
            onPress={() => setGender("male")}
          >
            <View
              style={[styles.radio, gender === "male" && styles.radioActive]}
            />
            <Text style={styles.genderLabel}>Male</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.genderOption}
            onPress={() => setGender("female")}
          >
            <View
              style={[styles.radio, gender === "female" && styles.radioActive]}
            />
            <Text style={styles.genderLabel}>Female</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.registerBtn}>
          <Text style={styles.registerText}>Register</Text>
        </TouchableOpacity>

        <Text style={styles.bottomText}>
          Already have an account?{" "}
          <Text style={styles.loginLink} onPress={() => router.push("/login")}>
            Login
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
    marginBottom: 10,
  },

  inputBox: {
    marginTop: 18,
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

  genderRow: {
    flexDirection: "row",
    gap: 30,
    marginTop: 20,
  },

  genderOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#1F242D",
  },

  radioActive: {
    backgroundColor: "#1F242D",
  },

  genderLabel: {
    fontSize: 16,
    color: "#1F242D",
  },

  registerBtn: {
    marginTop: 30,
    backgroundColor: "#1F242D",
    height: 56,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },

  registerText: {
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

  loginLink: {
    color: "#1F242D",
    fontWeight: "700",
  },
});
