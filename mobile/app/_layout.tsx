import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
      }}
    >
      <Stack.Screen name="login" options={{ title: "Login" }} />
      <Stack.Screen name="register" options={{ title: "Register" }} />
      <Stack.Screen name="chatlist" options={{ title: "Chats" }} />
      <Stack.Screen name="chat" options={{ title: "Conversation" }} />
    </Stack>
  );
}
