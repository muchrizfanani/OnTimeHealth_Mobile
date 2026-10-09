import { View } from "react-native";

type Props = { size?: number; rotate?: string };

// Ilustrasi kapsul dari View
export default function Capsule({ size = 30, rotate = "-35deg" }: Props) {
  return (
    <View style={{ flexDirection: "row", width: size * 2.2, height: size, borderRadius: size / 2, overflow: "hidden", transform: [{ rotate }] }}>
      <View style={{ flex: 1, backgroundColor: "#FFFFFF" }} />
      <View style={{ flex: 1, backgroundColor: "#EF9F27" }} />
    </View>
  );
}
