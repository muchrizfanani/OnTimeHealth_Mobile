import { Ionicons } from "@expo/vector-icons";
import { Href, usePathname, useRouter } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, shadows } from "../styles/theme";

interface NavItem {
  label: string;
  iconActive: keyof typeof Ionicons.glyphMap;
  iconInactive: keyof typeof Ionicons.glyphMap;
  path: Href;
  route: string;
}

// 5 Menu Utama Aplikasi:
// 1. Beranda (Home Dashboard)
// 2. Jadwal (Medication Schedule)
// 3. Riwayat (History & Log Kepatuhan)
// 4. Keluarga (Caregiver & Pendamping)
// 5. Profil (User Profile & Pengaturan)
const items: NavItem[] = [
  { label: "Beranda", iconActive: "home", iconInactive: "home-outline", path: "/", route: "/" },
  { label: "Jadwal", iconActive: "calendar", iconInactive: "calendar-outline", path: "/schedule", route: "/schedule" },
  { label: "Riwayat", iconActive: "time", iconInactive: "time-outline", path: "/history", route: "/history" },
  { label: "Keluarga", iconActive: "people", iconInactive: "people-outline", path: "/caregiver", route: "/caregiver" },
  { label: "Profil", iconActive: "person", iconInactive: "person-outline", path: "/profile", route: "/profile" },
];

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.navContainer, { paddingBottom: Math.max(insets.bottom, 10) }]}>
      <View style={styles.navBar}>
        {items.map((item) => {
          const isActive = pathname === item.route;
          return (
            <Pressable
              key={item.label}
              style={[
                styles.navItem,
                isActive && styles.navItemActive,
              ]}
              onPress={() => router.replace(item.path)}
              android_ripple={{ color: "rgba(13, 148, 136, 0.1)", borderless: true }}
            >
              <View style={[styles.iconWrapper, isActive && styles.iconWrapperActive]}>
                <Ionicons
                  name={isActive ? item.iconActive : item.iconInactive}
                  size={22}
                  color={isActive ? colors.primary : colors.textSecondary}
                />
              </View>
              <Text
                style={[
                  styles.navLabel,
                  isActive ? styles.navLabelActive : styles.navLabelInactive,
                ]}
                numberOfLines={1}
              >
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  navContainer: {
    backgroundColor: colors.cardBackground,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 8,
    width: "100%",
    ...shadows.card,
  },
  navBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 8,
  },
  navItem: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 16,
    minWidth: 62,
  },
  navItemActive: {
    backgroundColor: colors.primaryLightest,
  },
  iconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  iconWrapperActive: {
    backgroundColor: colors.primaryLight,
  },
  navLabel: {
    fontSize: 11,
    marginTop: 2,
  },
  navLabelActive: {
    fontWeight: "800",
    color: colors.primary,
  },
  navLabelInactive: {
    fontWeight: "600",
    color: colors.textSecondary,
  },
});
