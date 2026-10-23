import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BottomNav from "../components/BottomNav";
import { useApp } from "../context/AppContext";
import { colors, shadows } from "../styles/theme";

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { userProfile, currentRole, switchRole, isSeniorMode, toggleSeniorMode } = useApp();

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [stockAlertEnabled, setStockAlertEnabled] = useState(true);

  const handleCallDoctor = () => {
    Alert.alert("Telepon Dokter", "Menghubungi dr. Hendra, Sp.PD (Klinik Mitra Sehat)...");
  };

  const handleCallCaregiver = () => {
    Alert.alert("Telepon Keluarga", "Menghubungi Rizky Fanani (Pendamping Pasien)...");
  };

  const handleSwitchRolePress = (role: "patient" | "caregiver") => {
    switchRole(role);
    Alert.alert(
      "Peran Berhasil Diubah",
      role === "patient"
        ? "Anda sekarang masuk sebagai Pasien (Ibu Siti Rahma)."
        : "Anda sekarang masuk sebagai Pendamping (Keluarga Ibu Siti)."
    );
  };

  const handleLogout = () => {
    Alert.alert("Keluar Akun", "Apakah Anda ingin keluar atau berganti akun?", [
      { text: "Batal", style: "cancel" },
      { text: "Ganti Akun", onPress: () => router.push("/login") },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.content, { paddingTop: insets.top + 10, paddingBottom: insets.bottom + 80 }]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.badgeText}>AKUN & PENGATURAN</Text>
            <Text style={[styles.title, isSeniorMode && { fontSize: 26 }]}>
              Profil Pengguna
            </Text>
            <Text style={styles.subtitle}>
              Kelola data kesehatan, mode lansia & kontak darurat
            </Text>
          </View>

          {/* User Profile Card */}
          <View style={styles.profileCard}>
            <View style={styles.profileRow}>
              <View style={styles.avatarWrap}>
                <Text style={styles.avatarLetter}>{userProfile.name.charAt(0)}</Text>
                <View style={styles.onlineDot} />
              </View>

              <View style={{ flex: 1, marginLeft: 14 }}>
                <Text style={[styles.userName, isSeniorMode && { fontSize: 22 }]}>
                  {userProfile.name}
                </Text>
                <Text style={styles.userMeta}>
                  {userProfile.gender} • {userProfile.age} Tahun
                </Text>
                <View style={styles.roleBadge}>
                  <Ionicons
                    name={currentRole === "patient" ? "person" : "people"}
                    size={12}
                    color={colors.primary}
                  />
                  <Text style={styles.roleBadgeText}>
                    {currentRole === "patient" ? "Pasien Utama" : "Mode Pendamping (Caregiver)"}
                  </Text>
                </View>
              </View>
            </View>

            {/* Health Conditions Box */}
            <View style={styles.conditionBox}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                <Ionicons name="fitness" size={16} color={colors.primary} />
                <Text style={styles.conditionTitle}>Diagnosis / Riwayat Medis</Text>
              </View>
              <Text style={styles.conditionText}>{userProfile.condition}</Text>
            </View>
          </View>

          {/* Quick Role Switcher */}
          <View style={styles.sectionBox}>
            <Text style={styles.sectionTitle}>Pilih Peran Aplikasi</Text>
            <Text style={styles.sectionDesc}>
              Beralih antara mode Pasien pribadi dan Pendamping Keluarga:
            </Text>

            <View style={styles.roleSelectorRow}>
              <Pressable
                style={[
                  styles.roleSelectorCard,
                  currentRole === "patient" && styles.roleSelectorCardActive,
                ]}
                onPress={() => handleSwitchRolePress("patient")}
              >
                <Ionicons
                  name="person"
                  size={20}
                  color={currentRole === "patient" ? colors.primary : colors.textSecondary}
                />
                <Text
                  style={[
                    styles.roleSelectorTitle,
                    currentRole === "patient" && styles.roleSelectorTitleActive,
                  ]}
                >
                  Pasien
                </Text>
                <Text style={styles.roleSelectorDesc}>Ibu Siti Rahma</Text>
              </Pressable>

              <Pressable
                style={[
                  styles.roleSelectorCard,
                  currentRole === "caregiver" && styles.roleSelectorCardActive,
                ]}
                onPress={() => handleSwitchRolePress("caregiver")}
              >
                <Ionicons
                  name="heart-half"
                  size={20}
                  color={currentRole === "caregiver" ? colors.primary : colors.textSecondary}
                />
                <Text
                  style={[
                    styles.roleSelectorTitle,
                    currentRole === "caregiver" && styles.roleSelectorTitleActive,
                  ]}
                >
                  Pendamping
                </Text>
                <Text style={styles.roleSelectorDesc}>Rizky Fanani</Text>
              </Pressable>
            </View>
          </View>

          {/* Accessibility & Senior Mode */}
          <View style={styles.sectionBox}>
            <Text style={styles.sectionTitle}>Aksesibilitas & Pengingat</Text>

            {/* Senior Mode Toggle */}
            <View style={styles.settingRow}>
              <View style={styles.settingIconBox}>
                <Ionicons name="text-outline" size={20} color={colors.primary} />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={[styles.settingLabel, isSeniorMode && { fontSize: 16 }]}>
                  Mode Lansia (Senior UI)
                </Text>
                <Text style={styles.settingSub}>
                  Perbesar ukuran huruf, kontras warna tinggi & tombol besar
                </Text>
              </View>
              <Switch
                value={isSeniorMode}
                onValueChange={toggleSeniorMode}
                trackColor={{ false: "#CBD5E1", true: colors.primary }}
                thumbColor="#FFF"
              />
            </View>

            {/* Sound Toggle */}
            <View style={[styles.settingRow, { marginTop: 12 }]}>
              <View style={styles.settingIconBox}>
                <Ionicons name="volume-high-outline" size={20} color={colors.primary} />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.settingLabel}>Suara Alarm Keras</Text>
                <Text style={styles.settingSub}>Bunyikan alarm saat jadwal obat tiba</Text>
              </View>
              <Switch
                value={soundEnabled}
                onValueChange={setSoundEnabled}
                trackColor={{ false: "#CBD5E1", true: colors.primary }}
                thumbColor="#FFF"
              />
            </View>

            {/* Refill Stock Alert */}
            <View style={[styles.settingRow, { marginTop: 12 }]}>
              <View style={styles.settingIconBox}>
                <Ionicons name="cube-outline" size={20} color={colors.primary} />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.settingLabel}>Peringatan Stok Obat</Text>
                <Text style={styles.settingSub}>Kirim notifikasi bila stok tersisa ≤ 3 dosis</Text>
              </View>
              <Switch
                value={stockAlertEnabled}
                onValueChange={setStockAlertEnabled}
                trackColor={{ false: "#CBD5E1", true: colors.primary }}
                thumbColor="#FFF"
              />
            </View>
          </View>

          {/* Emergency & Medical Contacts */}
          <View style={styles.sectionBox}>
            <Text style={styles.sectionTitle}>Kontak Darurat & Pendamping</Text>
            <Text style={styles.sectionDesc}>
              Akses cepat menghubungi dokter dan pengasuh bila dibutuhkan:
            </Text>

            {/* Dokter Contact */}
            <View style={styles.contactCard}>
              <View style={styles.contactAvatar}>
                <Ionicons name="medkit" size={20} color={colors.primary} />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.contactName}>dr. Hendra, Sp.PD</Text>
                <Text style={styles.contactRole}>Dokter Spesialis Penyakit Dalam</Text>
                <Text style={styles.contactPhone}>0812-3456-7890</Text>
              </View>
              <Pressable style={styles.callIconBtn} onPress={handleCallDoctor}>
                <Ionicons name="call" size={18} color="#FFF" />
              </Pressable>
            </View>

            {/* Caregiver Contact */}
            <View style={[styles.contactCard, { marginTop: 10 }]}>
              <View style={[styles.contactAvatar, { backgroundColor: "#FEF3C7" }]}>
                <Ionicons name="heart" size={20} color="#B45309" />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.contactName}>Rizky Fanani</Text>
                <Text style={styles.contactRole}>Keluarga / Caregiver Pendamping</Text>
                <Text style={styles.contactPhone}>0821-9876-5432</Text>
              </View>
              <Pressable
                style={[styles.callIconBtn, { backgroundColor: "#0D9488" }]}
                onPress={handleCallCaregiver}
              >
                <Ionicons name="call" size={18} color="#FFF" />
              </Pressable>
            </View>
          </View>

          {/* App Info & Logout */}
          <View style={styles.sectionBox}>
            <Pressable
              style={styles.menuRow}
              onPress={() => router.push("/explore")}
            >
              <Ionicons name="book-outline" size={20} color={colors.primary} />
              <Text style={styles.menuLabel}>Pusat Edukasi & Penggunaan Obat</Text>
              <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
            </Pressable>

            <View style={styles.menuDivider} />

            <Pressable
              style={styles.menuRow}
              onPress={() =>
                Alert.alert(
                  "OnTimeHealth v1.0.0",
                  "Aplikasi Pengingat & Pemantau Kepatuhan Minum Obat Berbasis Mobile Expo & React Native."
                )
              }
            >
              <Ionicons name="information-circle-outline" size={20} color={colors.primary} />
              <Text style={styles.menuLabel}>Tentang Aplikasi & Versi</Text>
              <Text style={styles.versionTag}>v1.0.0</Text>
            </Pressable>

            <View style={styles.menuDivider} />

            <Pressable style={styles.logoutBtn} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={20} color={colors.statusMissed} />
              <Text style={styles.logoutText}>Ganti Akun / Masuk Ulang</Text>
            </Pressable>
          </View>
        </ScrollView>
      </View>
      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    marginBottom: 16,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "800",
    color: colors.primary,
    letterSpacing: 0.6,
  },
  title: {
    fontSize: 22,
    fontWeight: "900",
    color: colors.textPrimary,
    marginTop: 2,
  },
  subtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  profileCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 14,
    ...shadows.subtle,
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors.borderTeal,
    position: "relative",
    ...shadows.subtle,
  },
  avatarLetter: {
    fontSize: 24,
    fontWeight: "900",
    color: colors.primaryDark,
  },
  onlineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#10B981",
    position: "absolute",
    bottom: 0,
    right: 0,
    borderWidth: 2,
    borderColor: "#FFF",
  },
  userName: {
    fontSize: 18,
    fontWeight: "900",
    color: colors.textPrimary,
  },
  userMeta: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
    fontWeight: "600",
  },
  roleBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: colors.primaryLightest,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginTop: 6,
    borderWidth: 1,
    borderColor: colors.borderTeal,
  },
  roleBadgeText: {
    fontSize: 11,
    fontWeight: "800",
    color: colors.primaryDark,
  },
  conditionBox: {
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    padding: 12,
    marginTop: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  conditionTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: colors.primaryDark,
  },
  conditionText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textPrimary,
    marginTop: 4,
  },
  sectionBox: {
    backgroundColor: colors.cardBackground,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 14,
    ...shadows.subtle,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  sectionDesc: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
    marginBottom: 12,
  },
  roleSelectorRow: {
    flexDirection: "row",
    gap: 10,
  },
  roleSelectorCard: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: "center",
  },
  roleSelectorCardActive: {
    backgroundColor: colors.primaryLightest,
    borderColor: colors.primary,
  },
  roleSelectorTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.textSecondary,
    marginTop: 6,
  },
  roleSelectorTitleActive: {
    color: colors.primaryDark,
  },
  roleSelectorDesc: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: colors.primaryLightest,
    alignItems: "center",
    justifyContent: "center",
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  settingSub: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 1,
  },
  contactCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  contactAvatar: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  contactName: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  contactRole: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 1,
  },
  contactPhone: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: "700",
    marginTop: 2,
  },
  callIconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#10B981",
    alignItems: "center",
    justifyContent: "center",
    ...shadows.subtle,
  },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  menuLabel: {
    flex: 1,
    fontSize: 13,
    fontWeight: "700",
    color: colors.textPrimary,
    marginLeft: 12,
  },
  versionTag: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: "600",
  },
  menuDivider: {
    height: 1,
    backgroundColor: "#F1F5F9",
    marginVertical: 4,
  },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  logoutText: {
    fontSize: 13,
    fontWeight: "800",
    color: colors.statusMissed,
    marginLeft: 12,
  },
});
