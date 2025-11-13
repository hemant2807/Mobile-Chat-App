import React from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

type Props = {
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  secure?: boolean;
  showToggle?: boolean;
  onToggle?: () => void;
  keyboardType?: any;
};

export default function AuthInput({
  value,
  onChangeText,
  placeholder,
  secure,
  showToggle,
  onToggle,
  keyboardType,
}: Props) {
  return (
    <View style={styles.wrap}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#B89C5A"
        secureTextEntry={secure}
        style={styles.input}
        keyboardType={keyboardType}
      />
      {showToggle ? (
        <TouchableOpacity onPress={onToggle} style={styles.icon}>
          <MaterialIcons
            name={secure ? "visibility" : "visibility-off"}
            size={20}
            color="#B89C5A"
          />
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginVertical: 8,
    position: "relative",
  },
  input: {
    height: 48,
    borderBottomWidth: 1,
    borderBottomColor: "#EAD9B0",
    paddingHorizontal: 8,
    paddingRight: 44,
    fontSize: 16,
    color: "#111",
  },
  icon: {
    position: "absolute",
    right: 6,
    top: 12,
  },
});
