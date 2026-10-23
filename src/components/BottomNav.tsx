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

// 4 Menu Utama sesuai Rancangan:
// 1. Beranda (Dashboard)
// 2. Pengingat (Notifikasi & Konfirmasi Minum Obat)
// 3. Pendamping (Caretaker Mode & Monitoring Keluarga)
// 4. Laporan / Info (Riwayat, Kepatuhan, Edukasi)
const items: NavItem[] = [
  { label: "Beranda", icon: "home", path: "/", route: "/" },
  { label: "Pengingat", icon: "alarm", path: "/reminder", route: "/reminder" },
  { label: "Keluarga", icon: "people", path: "/caregiver", route: "/caregiver" },
  { label: "Edukasi", icon: "book-outline", path: "/explore", route: "/explore" },
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
          <Pressable
            key={item.label}
            style={styles.navItem}
            onPress={() => router.replace(item.path)}
          >
            <Ionicons
              name={item.icon}
              size={24}
              color={active ? colors.primary : colors.muted}
            />
            <Text
              style={[
                styles.navLabel,
                { color: active ? colors.primary : colors.muted },
              ]}
            >
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
