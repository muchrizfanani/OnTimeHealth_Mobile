import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useApp } from "../context/AppContext";
import { colors, shadows } from "../styles/theme";

type UserRole = "patient" | "caregiver";

export default function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { switchRole } = useApp();

  const [role, setRole] = useState<UserRole>("patient");
  const [email, setEmail] = useState("pasien@ontime.com");
  const [password, setPassword] = useState("123");

  const DUMMY_ACCOUNTS = {
    patient: {
      email: "pasien@ontime.com",
      password: "123",
      name: "Ibu Siti Rahma",
      roleDesc:
        "Sebagai Pasien: Menampilkan jadwal minum obat pribadi, notifikasi alarm harian, dan konfirmasi dosis.",
    },
    caregiver: {
      email: "keluarga@ontime.com",
      password: "123",
      name: "Rizky (Keluarga / Caregiver)",
      roleDesc:
        "Sebagai Pendamping: Menampilkan dashboard monitoring kepatuhan Ibu Siti, riwayat obat terlewat, dan kontak darurat.",
    },
  };

  const handleSelectRole = (newRole: UserRole) => {
    setRole(newRole);
    setEmail(DUMMY_ACCOUNTS[newRole].email);
    setPassword(DUMMY_ACCOUNTS[newRole].password);
  };

  const handleLogin = () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Perhatian", "Silakan masukkan email dan kata sandi.");
      return;
    }

    // Ubah state global role
    switchRole(role);

    if (role === "patient") {
      router.replace("/");
    } else {
      router.replace("/caregiver");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Logo & Title */}
        <View style={styles.headerBox}>
          <View style={styles.logoBadge}>
            <Ionicons name="medical" size={36} color={colors.primary} />
          </View>
          <Text style={styles.title}>OnTimeHealth</Text>
          <Text style={styles.subtitle}>
            Aplikasi Pengingat & Pemantau Kepatuhan Minum Obat
          </Text>
        </View>

        {/* Pilihan Peran Akun: Pasien vs Pendamping */}
        <Text style={styles.sectionLabel}>Pilih Peran Akun Anda:</Text>
        <View style={styles.roleContainer}>
          {/* Opsi 1: Pasien */}
          <Pressable
            style={[
              styles.roleCard,
              role === "patient" && styles.roleCardActive,
            ]}
            onPress={() => handleSelectRole("patient")}
          >
            <View
              style={[
                styles.roleIconWrap,
                role === "patient" && { backgroundColor: colors.primary },
              ]}
            >
              <Ionicons
                name="person"
                size={22}
                color={role === "patient" ? "#FFF" : colors.textSecondary}
              />
            </View>
            <Text
              style={[
                styles.roleTitle,
                role === "patient" && { color: colors.primaryDark },
              ]}
            >
              Pasien
            </Text>
            <Text style={styles.roleDesc}>Jadwal pribadi & alarm obat</Text>
          </Pressable>

          {/* Opsi 2: Pendamping / Caregiver */}
          <Pressable
            style={[
              styles.roleCard,
              role === "caregiver" && styles.roleCardActive,
            ]}
            onPress={() => handleSelectRole("caregiver")}
          >
            <View
              style={[
                styles.roleIconWrap,
                role === "caregiver" && { backgroundColor: colors.primary },
              ]}
            >
              <Ionicons
                name="heart-half"
                size={22}
                color={role === "caregiver" ? "#FFF" : colors.textSecondary}
              />
            </View>
            <Text
              style={[
                styles.roleTitle,
                role === "caregiver" && { color: colors.primaryDark },
              ]}
            >
              Pendamping
            </Text>
            <Text style={styles.roleDesc}>Pantau keluarga & riwayat</Text>
          </Pressable>
        </View>

        {/* Keterangan Perbedaan Peran */}
        <View style={styles.roleExplanationBox}>
          <Ionicons name="information-circle" size={18} color={colors.primary} />
          <Text style={styles.roleExplanationText}>
            {DUMMY_ACCOUNTS[role].roleDesc}
          </Text>
        </View>

        {/* Formulir Input Login */}
        <View style={styles.formCard}>
          <Text style={styles.inputLabel}>Email Akun</Text>
          <TextInput
            style={styles.input}
            placeholder="contoh@email.com"
            placeholderTextColor={colors.textMuted}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={[styles.inputLabel, { marginTop: 14 }]}>Kata Sandi</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            placeholderTextColor={colors.textMuted}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          {/* Tombol Masuk */}
          <Pressable style={styles.loginBtn} onPress={handleLogin}>
            <Text style={styles.loginBtnText}>
              Masuk sebagai{" "}
              {role === "patient"
                ? "Pasien (Ibu Siti)"
                : "Pendamping (Keluarga)"}
            </Text>
            <Ionicons name="arrow-forward" size={18} color="white" />
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  headerBox: {
    alignItems: "center",
    marginBottom: 20,
  },
  logoBadge: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    borderWidth: 2,
    borderColor: colors.borderTeal,
    ...shadows.subtle,
  },
  title: {
    fontSize: 26,
    fontWeight: "900",
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: "center",
    marginTop: 4,
    maxWidth: 280,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.textPrimary,
    marginBottom: 10,
  },
  roleContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  roleCard: {
    flex: 1,
    backgroundColor: colors.cardBackground,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 18,
    padding: 14,
    alignItems: "center",
    ...shadows.subtle,
  },
  roleCardActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLightest,
  },
  roleIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  roleTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.textPrimary,
    marginTop: 8,
  },
  roleDesc: {
    fontSize: 11,
    color: colors.textSecondary,
    textAlign: "center",
    marginTop: 2,
  },
  roleExplanationBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.primaryLightest,
    borderRadius: 14,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.borderTeal,
  },
  roleExplanationText: {
    flex: 1,
    fontSize: 12,
    color: colors.primaryDark,
    fontWeight: "600",
    lineHeight: 16,
  },
  formCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 20,
    ...shadows.card,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  input: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginTop: 6,
    fontSize: 15,
    color: colors.textPrimary,
    backgroundColor: "#F8FAFC",
  },
  loginBtn: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 20,
    ...shadows.glow,
  },
  loginBtnText: {
    color: "white",
    fontSize: 15,
    fontWeight: "900",
  },
});
