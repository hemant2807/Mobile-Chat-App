import { Stack } from "expo-router";
import { OnlineProvider } from "./context/OnlineContext";

export default function Layout() {
  return (
    <OnlineProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
        <Stack.Screen name="chatlist" />
        <Stack.Screen name="chat" />
      </Stack>
    </OnlineProvider>
  );
}
