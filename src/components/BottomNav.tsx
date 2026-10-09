import { Ionicons } from "@expo/vector-icons";
import { Href, usePathname, useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, styles } from "../constants/styles";

interface NavItem {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  path: Href;
  route: string;
}

const items: NavItem[] = [
  { label: "Beranda", icon: "home", path: "/", route: "/" },
  { label: "Pengingat", icon: "alarm", path: "/reminder", route: "/reminder" },
  { label: "Keluarga", icon: "people", path: "/caregiver", route: "/caregiver" },
];

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.nav, { paddingBottom: insets.bottom + 8 }]}>
      {items.map((item) => {
        const active = pathname === item.route;
        return (
          <Pressable key={item.label} style={styles.navItem} onPress={() => router.replace(item.path)}>
            <Ionicons name={item.icon} size={26} color={active ? colors.primary : colors.muted} />
            <Text style={[styles.navLabel, { color: active ? colors.primary : colors.muted }]}>{item.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}
