import { View } from "react-native";

type Props = { size?: number; skin?: string; hair?: string; shirt?: string; bg?: string };

// Ilustrasi avatar dari View (kepala, rambut, bahu)
export default function Avatar({ size = 48, skin = "#F5C4B3", hair = "#B4B2A9", shirt = "#0F6E56", bg = "#FAC775" }: Props) {
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: bg, overflow: "hidden", alignItems: "center", justifyContent: "flex-end" }}>
      <View style={{ position: "absolute", top: size * 0.18, width: size * 0.42, height: size * 0.42, borderRadius: size * 0.21, backgroundColor: skin }} />
      <View style={{ position: "absolute", top: size * 0.12, width: size * 0.46, height: size * 0.22, borderTopLeftRadius: size * 0.23, borderTopRightRadius: size * 0.23, backgroundColor: hair }} />
      <View style={{ width: size * 0.8, height: size * 0.34, borderTopLeftRadius: size * 0.4, borderTopRightRadius: size * 0.4, backgroundColor: shirt }} />
    </View>
  );
}
