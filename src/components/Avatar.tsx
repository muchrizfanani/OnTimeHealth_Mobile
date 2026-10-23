import React from "react";
import { View } from "react-native";
import { colors } from "../styles/theme";

type Props = { size?: number; skin?: string; hair?: string; shirt?: string; bg?: string };

// Ilustrasi avatar dari View (kepala, rambut, bahu) dengan tema Teal Modern
export default function Avatar({
  size = 48,
  skin = "#FED7AA",
  hair = "#475569",
  shirt = colors.primary,
  bg = colors.primaryLight,
}: Props) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: bg,
        overflow: "hidden",
        alignItems: "center",
        justifyContent: "flex-end",
        borderWidth: 1.5,
        borderColor: colors.borderTeal,
      }}
    >
      <View
        style={{
          position: "absolute",
          top: size * 0.18,
          width: size * 0.42,
          height: size * 0.42,
          borderRadius: size * 0.21,
          backgroundColor: skin,
        }}
      />
      <View
        style={{
          position: "absolute",
          top: size * 0.12,
          width: size * 0.46,
          height: size * 0.22,
          borderTopLeftRadius: size * 0.23,
          borderTopRightRadius: size * 0.23,
          backgroundColor: hair,
        }}
      />
      <View
        style={{
          width: size * 0.8,
          height: size * 0.34,
          borderTopLeftRadius: size * 0.4,
          borderTopRightRadius: size * 0.4,
          backgroundColor: shirt,
        }}
      />
    </View>
  );
}
