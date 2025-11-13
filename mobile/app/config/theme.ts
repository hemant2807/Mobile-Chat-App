import {
  MD3LightTheme as DefaultLight,
  MD3DarkTheme as DefaultDark,
} from "react-native-paper";
import { ColorSchemeName } from "react-native";

export const lightTheme = {
  ...DefaultLight,
  colors: {
    ...DefaultLight.colors,
    primary: "#F6C042",
    background: "#FFFFFF",
    surface: "#FFF8EE",
    text: "#111111",
    placeholder: "#C38A12",
    border: "#EAD9B0",
    card: "#FFFFFF",
  },
  spacing: {
    pagePadding: 20,
    inputHeight: 50,
    radius: 12,
  },
};

export const darkTheme = {
  ...DefaultDark,
  colors: {
    ...DefaultDark.colors,
    primary: "#F6C042",
    background: "#121212",
    surface: "#1E1E1E",
    text: "#FFFFFF",
    placeholder: "#E1C27A",
    border: "#3A3A3A",
    card: "#1E1E1E",
  },
  spacing: {
    pagePadding: 20,
    inputHeight: 50,
    radius: 12,
  },
};

export const useThemeForScheme = (scheme: ColorSchemeName) => {
  return scheme === "dark" ? darkTheme : lightTheme;
};

export type ThemeType = typeof lightTheme;
