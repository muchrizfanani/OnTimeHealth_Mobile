import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BottomNav from "../components/BottomNav";
import { useApp } from "../context/AppContext";
import { colors, shadows } from "../styles/theme";

export default function ModernReminderScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { medicines, takeMedicine, snoozeMedicine, updateMedicineStatus, isSeniorMode } = useApp();

  // Ambil obat aktif (status pending / snoozed) atau obat pertama
  const activeMed =
    medicines.find((m) => m.status === "pending" || m.status === "snoozed") || medicines[0];

  const [skipModalVisible, setSkipModalVisible] = useState(false);
  const [snoozeModalVisible, setSnoozeModalVisible] = useState(false);
  const [selectedReason, setSelectedReason] = useState("Lupa bawa obat");
  const [customReason, setCustomReason] = useState("");

  const commonSkipReasons = [
    "Lupa membawa obat",
    "Perut masih kosong / belum makan",
    "Mengalami efek samping / mual",
    "Merasa sudah sembuh",
  ];

  // AKSI 1: SUDAH MINUM
  const handleTake = () => {
    takeMedicine(activeMed.id);
    Alert.alert(
      "✅ Dosis Berhasil Dicatat",
      `Obat ${activeMed.name} telah diminum. Stok fisik otomatis berkurang menjadi ${
        activeMed.stock !== undefined ? Math.max(0, activeMed.stock - 1) : 0
      } dosis. Kepatuhan Anda hari ini bertambah!`,
      [{ text: "Kembali ke Beranda", onPress: () => router.replace("/") }]
    );
  };

  // AKSI 2: SNOOZE / TUNDA
  const handleApplySnooze = (minutes: number) => {
    snoozeMedicine(activeMed.id, minutes);
    setSnoozeModalVisible(false);
    Alert.alert(
      "⏰ Alarm Ditunda (Snooze)",
      `Pengingat untuk ${activeMed.name} akan berdering kembali dalam ${minutes} menit.`
    );
  };

  // AKSI 3: LEWATKAN DOSIS (SKIP + ALASAN)
  const handleConfirmSkip = () => {
    const finalReason = customReason.trim() || selectedReason;
    updateMedicineStatus(activeMed.id, "missed", finalReason);
    setSkipModalVisible(false);
    Alert.alert(
      "⚠️ Dosis Terlewat Dicatat",
      `Alasan: "${finalReason}". Laporan telah dikirim ke catatan riwayat kepatuhan & mode keluarga.`,
      [{ text: "Kembali", onPress: () => router.replace("/") }]
    );
  };

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.content,
          {
            paddingTop: insets.top + 12,
            paddingBottom: insets.bottom + 80,
          },
        ]}
      >
        {/* Top Bar Navigasi */}
        <View style={styles.topBar}>
          <Pressable
            style={styles.backBtn}
            onPress={() => (router.canGoBack() ? router.back() : router.replace("/"))}
          >
            <Ionicons name="arrow-back" size={20} color={colors.textPrimary} />
            <Text style={styles.backBtnText}>Kembali</Text>
          </Pressable>

          <View style={styles.liveBadge}>
            <View style={styles.pulsingDot} />
            <Text style={styles.liveBadgeText}>Alarm Pengingat Aktif</Text>
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ alignItems: "center", paddingBottom: 20 }}
        >
          {/* Visual Hero Alarm (Glowing concentric mint rings) */}
          <View style={styles.heroCircleOuter}>
            <View style={styles.heroCircleMiddle}>
              <View style={styles.heroCircleInner}>
                <Ionicons
                  name={
                    activeMed.form === "Sirup"
                      ? "water"
                      : activeMed.form === "Injeksi"
                      ? "color-wand"
                      : activeMed.form === "Kapsul"
                      ? "medical"
                      : "disc"
                  }
                  size={52}
                  color={colors.primary}
                />
              </View>
            </View>
          </View>

          {/* Time & Title */}
          <Text style={[styles.timeLabel, isSeniorMode && { fontSize: 34 }]}>
            {activeMed.time} WIB
          </Text>
          <Text style={[styles.medName, isSeniorMode && { fontSize: 28 }]}>
            {activeMed.name}
          </Text>

          {/* Dose & Instruction Pill */}
          <View style={styles.instructionPill}>
            <Ionicons name="information-circle" size={16} color={colors.primary} />
            <Text style={[styles.medDetails, isSeniorMode && { fontSize: 16 }]}>
              {activeMed.dosage} • {activeMed.form} • {activeMed.note || "Sesudah makan"}
            </Text>
          </View>

          {/* Stock & Warning Indicator */}
          <View style={styles.stockCard}>
            <Ionicons
              name={activeMed.stock !== undefined && activeMed.stock <= 3 ? "warning" : "cube"}
              size={18}
              color={activeMed.stock !== undefined && activeMed.stock <= 3 ? colors.statusMissed : colors.primary}
            />
            <Text
              style={[
                styles.stockCardText,
                activeMed.stock !== undefined && activeMed.stock <= 3 && { color: colors.statusMissed },
              ]}
            >
              Sisa Stok Fisik: <Text style={{ fontWeight: "800" }}>{activeMed.stock ?? 10} dosis</Text>
              {activeMed.stock !== undefined && activeMed.stock <= 3 ? " (Segera Isi Ulang!)" : ""}
            </Text>
          </View>

          {/* 3 OPSI AKSI UTAMA */}
          <View style={styles.actionSection}>
            {/* OPSI 1: SUDAH MINUM */}
            <Pressable
              style={[styles.primaryActionBtn, isSeniorMode && { paddingVertical: 22 }]}
              onPress={handleTake}
            >
              <Ionicons name="checkmark-circle" size={26} color="#FFF" />
              <Text style={[styles.primaryActionText, isSeniorMode && { fontSize: 20 }]}>
                Sudah Diminum (Take)
              </Text>
            </Pressable>

            {/* OPSI 2: TUNDA (SNOOZE) */}
            <Pressable
              style={[styles.secondaryActionBtn, isSeniorMode && { paddingVertical: 18 }]}
              onPress={() => setSnoozeModalVisible(true)}
            >
              <Ionicons name="timer-outline" size={22} color={colors.primaryDark} />
              <Text style={[styles.secondaryActionText, isSeniorMode && { fontSize: 17 }]}>
                Tunda Alarm (Snooze)
              </Text>
            </Pressable>

            {/* OPSI 3: LEWATKAN (SKIP) */}
            <Pressable style={styles.skipBtn} onPress={() => setSkipModalVisible(true)}>
              <Text style={[styles.skipBtnText, isSeniorMode && { fontSize: 16 }]}>
                ✕ Lewatkan Dosis Ini (Skip)
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </View>

      {/* MODAL SNOOZE */}
      <Modal visible={snoozeModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Tunda Berapa Menit?</Text>
            <Text style={styles.modalSubtitle}>
              Pengingat obat {activeMed.name} akan dibunyikan kembali secara otomatis.
            </Text>

            <View style={{ gap: 10, marginTop: 14 }}>
              {[5, 10, 15, 30].map((mins) => (
                <Pressable
                  key={mins}
                  style={styles.snoozeOptionBtn}
                  onPress={() => handleApplySnooze(mins)}
                >
                  <Ionicons name="time-outline" size={20} color={colors.primary} />
                  <Text style={styles.snoozeOptionText}>Tunda {mins} Menit</Text>
                </Pressable>
              ))}
            </View>

            <Pressable
              style={[styles.modalCloseBtn, { marginTop: 14 }]}
              onPress={() => setSnoozeModalVisible(false)}
            >
              <Text style={styles.modalCloseText}>Batal</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* MODAL SKIP */}
      <Modal visible={skipModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <Ionicons name="alert-circle" size={24} color={colors.statusMissed} />
              <Text style={[styles.modalTitle, { color: colors.statusMissed }]}>
                Lewatkan Dosis
              </Text>
            </View>
            <Text style={styles.modalSubtitle}>
              Pilih alasan mengapa dosis obat ini dilewati untuk catatan riwayat dokter & keluarga:
            </Text>

            <View style={{ gap: 8, marginTop: 12 }}>
              {commonSkipReasons.map((reason) => (
                <Pressable
                  key={reason}
                  style={[
                    styles.reasonOption,
                    selectedReason === reason && styles.reasonOptionActive,
                  ]}
                  onPress={() => {
                    setSelectedReason(reason);
                    setCustomReason("");
                  }}
                >
                  <Text
                    style={[
                      styles.reasonText,
                      selectedReason === reason && styles.reasonTextActive,
                    ]}
                  >
                    {reason}
                  </Text>
                  {selectedReason === reason && (
                    <Ionicons name="checkmark" size={18} color={colors.primary} />
                  )}
                </Pressable>
              ))}
            </View>

            <TextInput
              style={[styles.inputCustom, { marginTop: 10 }]}
              placeholder="Atau tulis alasan lain..."
              placeholderTextColor={colors.textMuted}
              value={customReason}
              onChangeText={setCustomReason}
            />

            <View style={{ flexDirection: "row", gap: 10, marginTop: 16 }}>
              <Pressable
                style={[styles.modalActionBtn, { backgroundColor: "#F1F5F9" }]}
                onPress={() => setSkipModalVisible(false)}
              >
                <Text style={{ fontWeight: "700", color: colors.textSecondary }}>Batal</Text>
              </Pressable>
              <Pressable
                style={[styles.modalActionBtn, { backgroundColor: colors.statusMissed }]}
                onPress={handleConfirmSkip}
              >
                <Text style={{ fontWeight: "800", color: "#FFF" }}>Konfirmasi Lewat</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primaryLightest,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    width: "100%",
  },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.cardBackground,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.borderTeal,
    gap: 4,
    ...shadows.subtle,
  },
  backBtnText: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  liveBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
    borderWidth: 1,
    borderColor: colors.borderTeal,
  },
  pulsingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  liveBadgeText: {
    fontSize: 12,
    fontWeight: "800",
    color: colors.primaryDark,
  },
  heroCircleOuter: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "rgba(13, 148, 136, 0.12)",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  heroCircleMiddle: {
    width: 126,
    height: 126,
    borderRadius: 63,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors.borderTeal,
    ...shadows.glow,
  },
  heroCircleInner: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: colors.cardBackground,
    alignItems: "center",
    justifyContent: "center",
    ...shadows.subtle,
  },
  timeLabel: {
    fontSize: 30,
    fontWeight: "900",
    color: colors.primaryDark,
    marginTop: 16,
  },
  medName: {
    fontSize: 24,
    fontWeight: "900",
    color: colors.textPrimary,
    marginTop: 4,
  },
  instructionPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.cardBackground,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    marginTop: 8,
    borderWidth: 1,
    borderColor: colors.borderTeal,
  },
  medDetails: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.primaryDark,
    textAlign: "center",
  },
  stockCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.cardBackground,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: 12,
    gap: 6,
    ...shadows.subtle,
  },
  stockCardText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  actionSection: {
    width: "100%",
    marginTop: 22,
    gap: 12,
  },
  primaryActionBtn: {
    backgroundColor: colors.primary,
    borderRadius: 18,
    paddingVertical: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    ...shadows.glow,
  },
  primaryActionText: {
    color: "#FFF",
    fontSize: 17,
    fontWeight: "900",
  },
  secondaryActionBtn: {
    backgroundColor: colors.cardBackground,
    borderRadius: 18,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: colors.borderTeal,
    gap: 8,
    ...shadows.subtle,
  },
  secondaryActionText: {
    color: colors.primaryDark,
    fontSize: 15,
    fontWeight: "800",
  },
  skipBtn: {
    paddingVertical: 10,
    alignItems: "center",
  },
  skipBtnText: {
    color: colors.statusMissed,
    fontSize: 14,
    fontWeight: "700",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalBox: {
    backgroundColor: colors.cardBackground,
    borderRadius: 24,
    padding: 22,
    width: "100%",
    maxWidth: 400,
    ...shadows.card,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  modalSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
    marginBottom: 10,
  },
  snoozeOptionBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primaryLightest,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.borderTeal,
    gap: 10,
  },
  snoozeOptionText: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.primaryDark,
  },
  modalCloseBtn: {
    alignItems: "center",
    paddingVertical: 10,
  },
  modalCloseText: {
    color: colors.textSecondary,
    fontWeight: "700",
    fontSize: 14,
  },
  reasonOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 12,
  },
  reasonOptionActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLightest,
  },
  reasonText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: "600",
  },
  reasonTextActive: {
    color: colors.primaryDark,
    fontWeight: "800",
  },
  inputCustom: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 13,
    backgroundColor: "#F8FAFC",
  },
  modalActionBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
});
