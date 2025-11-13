import React from "react";
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from "react-native";

type Props = {
  title: string;
  onPress?: () => void;
  style?: ViewStyle;
};

export default function PrimaryButton({ title, onPress, style }: Props) {
  return (
    <TouchableOpacity style={[styles.btn, style]} onPress={onPress}>
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    height: 48,
    borderRadius: 10,
    backgroundColor: "#F6C042",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
    elevation: 2,
  },
  title: {
    color: "#000",
    fontWeight: "700",
    fontSize: 16,
  },
});
