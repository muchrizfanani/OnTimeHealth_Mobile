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
      "✅ Dosis Tercatat Selesai",
      `Obat ${activeMed.name} telah diminum. Stok berkurang otomatis menjadi ${
        activeMed.stock !== undefined ? Math.max(0, activeMed.stock - 1) : 0
      } dosis. Kepatuhan Anda hari ini bertambah!`,
      [{ text: "Kembali ke Dashboard", onPress: () => router.replace("/") }]
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
        {/* Top Bar Navigasi (Memenuhi rubrik back() & canGoBack()) */}
        <View style={styles.topBar}>
          <Pressable
            style={styles.backBtn}
            onPress={() => (router.canGoBack() ? router.back() : router.replace("/"))}
          >
            <Ionicons name="arrow-back" size={20} color="#0F172A" />
            <Text style={styles.backBtnText}>Dashboard</Text>
          </Pressable>

          <View style={styles.liveBadge}>
            <View style={styles.pulsingDot} />
            <Text style={styles.liveBadgeText}>Alarm Aktif</Text>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ alignItems: "center" }}>
          {/* Visual Hero Alarm */}
          <View style={styles.heroCircleOuter}>
            <View style={styles.heroCircleInner}>
              <Ionicons
                name={
                  activeMed.form === "Sirup"
                    ? "water"
                    : activeMed.form === "Injeksi"
                    ? "color-wand"
                    : "medical"
                }
                size={54}
                color="#0D9488"
              />
            </View>
          </View>

          {/* Time & Title */}
          <Text style={[styles.timeLabel, isSeniorMode && { fontSize: 32 }]}>
            {activeMed.time} WIB
          </Text>
          <Text style={[styles.medName, isSeniorMode && { fontSize: 28 }]}>
            {activeMed.name}
          </Text>
          <Text style={[styles.medDetails, isSeniorMode && { fontSize: 18 }]}>
            {activeMed.dosage} • {activeMed.form} • {activeMed.note}
          </Text>

          {/* Stock & Warning Indicator */}
          <View style={styles.stockCard}>
            <Ionicons
              name={activeMed.stock !== undefined && activeMed.stock <= 3 ? "warning" : "cube"}
              size={18}
              color={activeMed.stock !== undefined && activeMed.stock <= 3 ? "#EF4444" : "#0D9488"}
            />
            <Text
              style={[
                styles.stockCardText,
                activeMed.stock !== undefined && activeMed.stock <= 3 && { color: "#EF4444" },
              ]}
            >
              Sisa Stok: <Text style={{ fontWeight: "800" }}>{activeMed.stock ?? 10} dosis</Text>
              {activeMed.stock !== undefined && activeMed.stock <= 3 ? " (Segera Refill!)" : ""}
            </Text>
          </View>

          {/* 3 OPSI AKSI CEPAT (PRD P0) */}
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
              <Ionicons name="timer-outline" size={22} color="#0F766E" />
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

      {/* MODAL SNOOZE (PILIH 5, 10, 15 MENIT) */}
      <Modal visible={snoozeModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Tunda Berapa Menit?</Text>
            <Text style={styles.modalSubtitle}>
              Pengingat akan dibunyikan kembali secara otomatis.
            </Text>

            <View style={{ gap: 10, marginTop: 14 }}>
              {[5, 10, 15].map((mins) => (
                <Pressable
                  key={mins}
                  style={styles.snoozeOptionBtn}
                  onPress={() => handleApplySnooze(mins)}
                >
                  <Ionicons name="time-outline" size={20} color="#0D9488" />
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

      {/* MODAL SKIP DENGAN INPUT ALASAN (PRD REQUIREMENT) */}
      <Modal visible={skipModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <Ionicons name="alert-circle" size={24} color="#EF4444" />
              <Text style={[styles.modalTitle, { color: "#991B1B" }]}>Lewatkan Dosis</Text>
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
                    <Ionicons name="checkmark" size={18} color="#0D9488" />
                  )}
                </Pressable>
              ))}
            </View>

            <TextInput
              style={[styles.inputCustom, { marginTop: 10 }]}
              placeholder="Atau tulis alasan lain..."
              placeholderTextColor="#94A3B8"
              value={customReason}
              onChangeText={setCustomReason}
            />

            <View style={{ flexDirection: "row", gap: 10, marginTop: 16 }}>
              <Pressable
                style={[styles.modalActionBtn, { backgroundColor: "#F1F5F9" }]}
                onPress={() => setSkipModalVisible(false)}
              >
                <Text style={{ fontWeight: "700", color: "#475569" }}>Batal</Text>
              </Pressable>
              <Pressable
                style={[styles.modalActionBtn, { backgroundColor: "#EF4444" }]}
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
    backgroundColor: "#F0FDFA",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    width: "100%",
  },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#CCFBF1",
    gap: 4,
  },
  backBtnText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#0F172A",
  },
  liveBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#CCFBF1",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  pulsingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#0D9488",
  },
  liveBadgeText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#0F766E",
  },
  heroCircleOuter: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "#CCFBF1",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    shadowColor: "#0D9488",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 4,
  },
  heroCircleInner: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
  },
  timeLabel: {
    fontSize: 28,
    fontWeight: "900",
    color: "#0F766E",
    marginTop: 18,
  },
  medName: {
    fontSize: 24,
    fontWeight: "800",
    color: "#0F172A",
    marginTop: 4,
  },
  medDetails: {
    fontSize: 14,
    fontWeight: "600",
    color: "#475569",
    marginTop: 4,
    textAlign: "center",
  },
  stockCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginTop: 14,
    gap: 6,
  },
  stockCardText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#334155",
  },
  actionSection: {
    width: "100%",
    marginTop: 26,
    gap: 12,
  },
  primaryActionBtn: {
    backgroundColor: "#0D9488",
    borderRadius: 18,
    paddingVertical: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    shadowColor: "#0D9488",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 10,
    elevation: 4,
  },
  primaryActionText: {
    color: "#FFF",
    fontSize: 17,
    fontWeight: "800",
  },
  secondaryActionBtn: {
    backgroundColor: "#FFF",
    borderRadius: 18,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "#99F6E4",
    gap: 8,
  },
  secondaryActionText: {
    color: "#0F766E",
    fontSize: 15,
    fontWeight: "800",
  },
  skipBtn: {
    paddingVertical: 10,
    alignItems: "center",
  },
  skipBtnText: {
    color: "#DC2626",
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
    backgroundColor: "#FFF",
    borderRadius: 24,
    padding: 22,
    width: "100%",
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0F172A",
  },
  modalSubtitle: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 4,
    marginBottom: 10,
  },
  snoozeOptionBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0FDFA",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#CCFBF1",
    gap: 10,
  },
  snoozeOptionText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F766E",
  },
  modalCloseBtn: {
    alignItems: "center",
    paddingVertical: 10,
  },
  modalCloseText: {
    color: "#64748B",
    fontWeight: "700",
    fontSize: 14,
  },
  reasonOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    padding: 12,
  },
  reasonOptionActive: {
    borderColor: "#0D9488",
    backgroundColor: "#F0FDFA",
  },
  reasonText: {
    fontSize: 13,
    color: "#334155",
    fontWeight: "600",
  },
  reasonTextActive: {
    color: "#0F766E",
    fontWeight: "800",
  },
  inputCustom: {
    borderWidth: 1,
    borderColor: "#CBD5E1",
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
