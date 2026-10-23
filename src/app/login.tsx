import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
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
        "Sebagai Pasien: Menampilkan jadwal minum obat pribadi dan konfirmasi alarm harian.",
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
      // Masuk sebagai Pasien -> Dashboard Jadwal Utama
      router.replace("/");
    } else {
      // Masuk sebagai Pendamping -> Halaman Mode Keluarga
      router.replace("/caregiver");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#F8FAFC" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 24 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Logo & Title */}
        <View style={styles.headerBox}>
          <View style={styles.logoBadge}>
            <Ionicons name="medical" size={36} color="#0D9488" />
          </View>
          <Text style={styles.title}>OnTimeHealth</Text>
          <Text style={styles.subtitle}>
            Aplikasi Pengingat & Pemantau Kepatuhan Minum Obat
          </Text>
        </View>

        {/* Pilihan Peran Akun (Role Selector): Pasien vs Pendamping */}
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
                role === "patient" && { backgroundColor: "#0D9488" },
              ]}
            >
              <Ionicons
                name="person"
                size={22}
                color={role === "patient" ? "#FFF" : "#64748B"}
              />
            </View>
            <Text
              style={[
                styles.roleTitle,
                role === "patient" && { color: "#0F766E" },
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
                role === "caregiver" && { backgroundColor: "#0D9488" },
              ]}
            >
              <Ionicons
                name="heart-half"
                size={22}
                color={role === "caregiver" ? "#FFF" : "#64748B"}
              />
            </View>
            <Text
              style={[
                styles.roleTitle,
                role === "caregiver" && { color: "#0F766E" },
              ]}
            >
              Pendamping
            </Text>
            <Text style={styles.roleDesc}>Pantau keluarga & riwayat</Text>
          </Pressable>
        </View>

        {/* Keterangan Perbedaan Peran */}
        <View style={styles.roleExplanationBox}>
          <Ionicons name="information-circle" size={18} color="#0F766E" />
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
            placeholderTextColor="#94A3B8"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={[styles.inputLabel, { marginTop: 14 }]}>Kata Sandi</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            placeholderTextColor="#94A3B8"
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
    backgroundColor: "#CCFBF1",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: "900",
    color: "#0F172A",
  },
  subtitle: {
    fontSize: 13,
    color: "#64748B",
    textAlign: "center",
    marginTop: 4,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 10,
  },
  roleContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  roleCard: {
    flex: 1,
    backgroundColor: "#FFF",
    borderWidth: 2,
    borderColor: "#E2E8F0",
    borderRadius: 18,
    padding: 14,
    alignItems: "center",
  },
  roleCardActive: {
    borderColor: "#0D9488",
    backgroundColor: "#F0FDFA",
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
    color: "#0F172A",
    marginTop: 8,
  },
  roleDesc: {
    fontSize: 11,
    color: "#64748B",
    textAlign: "center",
    marginTop: 2,
  },
  roleExplanationBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#F0FDFA",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#99F6E4",
  },
  roleExplanationText: {
    flex: 1,
    fontSize: 12,
    color: "#0F766E",
    fontWeight: "600",
    lineHeight: 16,
  },
  formCard: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 20,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#0F172A",
  },
  input: {
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginTop: 6,
    fontSize: 15,
    color: "#0F172A",
    backgroundColor: "#F8FAFC",
  },
  loginBtn: {
    backgroundColor: "#0D9488",
    borderRadius: 14,
    paddingVertical: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 18,
  },
  loginBtnText: {
    color: "white",
    fontSize: 15,
    fontWeight: "800",
  },
});
