import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";

export default function Landing() {
  const router = useRouter();

  return (
    <ImageBackground
      source={require("./assets/images/image.png")}
      style={styles.bg}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.buttonsBox}>
          <TouchableOpacity
            style={styles.loginBtn}
            onPress={() => router.push("/login")}
          >
            <Text style={styles.loginText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.registerBtn}
            onPress={() => router.push("/register")}
          >
            <Text style={styles.registerText}>Register</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    width: "100%",
    height: "100%",
  },

  container: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 80,
  },

  buttonsBox: {
    width: "85%",
    alignItems: "center",
    gap: 18,
  },

  loginBtn: {
    width: "100%",
    backgroundColor: "#1F242D",
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
  },
  loginText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
  },

  registerBtn: {
    width: "100%",
    backgroundColor: "#ffffffcc",
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#1F242D",
  },
  registerText: {
    color: "#1F242D",
    fontSize: 20,
    fontWeight: "600",
  },
});
