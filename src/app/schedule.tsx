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
import { Medicine, MedicineStatus } from "../types/medicine";

export default function ScheduleScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { medicines, takeMedicine, snoozeMedicine, updateMedicineStatus, isSeniorMode } = useApp();

  const [selectedDay, setSelectedDay] = useState("Hari Ini");
  const [selectedPeriod, setSelectedPeriod] = useState<"Semua" | "Pagi" | "Siang" | "Sore" | "Malam">("Semua");
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "taken">("all");

  // Modals state
  const [snoozeModalVisible, setSnoozeModalVisible] = useState(false);
  const [skipModalVisible, setSkipModalVisible] = useState(false);
  const [activeMedicine, setActiveMedicine] = useState<Medicine | null>(null);
  const [skipReason, setSkipReason] = useState("Lupa membawa obat");
  const [customSkipReason, setCustomSkipReason] = useState("");

  const days = [
    { label: "Sen", date: "20" },
    { label: "Sel", date: "21" },
    { label: "Rab", date: "22" },
    { label: "Hari Ini", date: "23", isToday: true },
    { label: "Jum", date: "24" },
    { label: "Sab", date: "25" },
    { label: "Min", date: "26" },
  ];

  const periods = ["Semua", "Pagi", "Siang", "Sore", "Malam"] as const;

  const getTimePeriod = (timeStr: string): "Pagi" | "Siang" | "Sore" | "Malam" => {
    const hour = parseInt(timeStr.split(":")[0], 10) || 8;
    if (hour >= 5 && hour < 11) return "Pagi";
    if (hour >= 11 && hour < 15) return "Siang";
    if (hour >= 15 && hour < 18) return "Sore";
    return "Malam";
  };

  const filteredMedicines = medicines.filter((m) => {
    // Filter period
    if (selectedPeriod !== "Semua") {
      if (getTimePeriod(m.time) !== selectedPeriod) return false;
    }
    // Filter status
    if (filterStatus === "taken") return m.status === "taken";
    if (filterStatus === "pending") return m.status !== "taken";
    return true;
  });

  const takenCount = medicines.filter((m) => m.status === "taken").length;
  const totalCount = medicines.length;

  const handleTake = (med: Medicine) => {
    takeMedicine(med.id);
    Alert.alert("✅ Selesai", `Obat ${med.name} telah dicatat sudah diminum.`);
  };

  const handleOpenSnooze = (med: Medicine) => {
    setActiveMedicine(med);
    setSnoozeModalVisible(true);
  };

  const handleApplySnooze = (minutes: number) => {
    if (activeMedicine) {
      snoozeMedicine(activeMedicine.id, minutes);
      setSnoozeModalVisible(false);
      Alert.alert("⏰ Alarm Ditunda", `Pengingat untuk ${activeMedicine.name} ditunda ${minutes} menit.`);
    }
  };

  const handleOpenSkip = (med: Medicine) => {
    setActiveMedicine(med);
    setSkipModalVisible(true);
  };

  const handleConfirmSkip = () => {
    if (activeMedicine) {
      const finalReason = customSkipReason.trim() || skipReason;
      updateMedicineStatus(activeMedicine.id, "missed", finalReason);
      setSkipModalVisible(false);
      setCustomSkipReason("");
      Alert.alert("⚠️ Dosis Dilewati", `Dosis ${activeMedicine.name} dilewati dengan alasan: "${finalReason}".`);
    }
  };

  const getStatusBadge = (status: MedicineStatus) => {
    switch (status) {
      case "taken":
        return { label: "Diminum", bg: colors.statusTakenBg, fg: colors.statusTaken, icon: "checkmark-circle" as const };
      case "snoozed":
        return { label: "Ditunda", bg: colors.statusSnoozedBg, fg: colors.statusSnoozed, icon: "time" as const };
      case "missed":
        return { label: "Terlewat", bg: colors.statusMissedBg, fg: colors.statusMissed, icon: "close-circle" as const };
      case "pending":
      default:
        return { label: "Belum", bg: colors.statusPendingBg, fg: colors.statusPending, icon: "alarm-outline" as const };
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.content, { paddingTop: insets.top + 10, paddingBottom: insets.bottom + 80 }]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Top Bar */}
          <View style={styles.topBar}>
            <View>
              <Text style={styles.badgeText}>MANAJEMEN WAKTU OBAT</Text>
              <Text style={[styles.title, isSeniorMode && { fontSize: 26 }]}>Jadwal Obat</Text>
              <Text style={styles.subtitle}>Atur & pantau waktu konsumsi harian Anda</Text>
            </View>
            <Pressable
              style={styles.addBtn}
              onPress={() => router.push("/add-medication")}
            >
              <Ionicons name="add" size={20} color="#FFF" />
              <Text style={styles.addBtnText}>Tambah</Text>
            </Pressable>
          </View>

          {/* Day Calendar Strip */}
          <View style={styles.calendarStrip}>
            {days.map((item) => {
              const isSelected = selectedDay === item.label;
              return (
                <Pressable
                  key={item.label}
                  style={[
                    styles.dayCard,
                    isSelected && styles.dayCardActive,
                  ]}
                  onPress={() => setSelectedDay(item.label)}
                >
                  <Text style={[styles.dayLabel, isSelected && styles.dayLabelActive]}>
                    {item.label}
                  </Text>
                  <Text style={[styles.dateText, isSelected && styles.dateTextActive]}>
                    {item.date}
                  </Text>
                  {item.isToday && !isSelected && <View style={styles.todayDot} />}
                </Pressable>
              );
            })}
          </View>

          {/* Daily Progress Ribbon */}
          <View style={styles.progressRibbon}>
            <View style={styles.progressIcon}>
              <Ionicons name="medical" size={18} color={colors.primary} />
            </View>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.progressTitle}>
                {takenCount === totalCount ? "Semua Obat Telah Diminum! 🎉" : `${takenCount} dari ${totalCount} Dosis Selesai`}
              </Text>
              <Text style={styles.progressSub}>
                {totalCount - takenCount} obat tersisa untuk hari ini.
              </Text>
            </View>
            <View style={styles.progressPill}>
              <Text style={styles.progressPillText}>{Math.round((takenCount / totalCount) * 100) || 0}%</Text>
            </View>
          </View>

          {/* Time of Day Filter Pills (Pagi, Siang, Sore, Malam) */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.periodScroll}
          >
            {periods.map((period) => (
              <Pressable
                key={period}
                style={[
                  styles.periodChip,
                  selectedPeriod === period && styles.periodChipActive,
                ]}
                onPress={() => setSelectedPeriod(period)}
              >
                <Text
                  style={[
                    styles.periodChipText,
                    selectedPeriod === period && styles.periodChipTextActive,
                  ]}
                >
                  {period}
                </Text>
              </Pressable>
            ))}
          </ScrollView>

          {/* Filter Status Pills (Semua / Belum / Diminum) */}
          <View style={styles.statusFilterRow}>
            <Pressable
              style={[styles.statusFilterBtn, filterStatus === "all" && styles.statusFilterBtnActive]}
              onPress={() => setFilterStatus("all")}
            >
              <Text style={[styles.statusFilterText, filterStatus === "all" && styles.statusFilterTextActive]}>
                Semua
              </Text>
            </Pressable>
            <Pressable
              style={[styles.statusFilterBtn, filterStatus === "pending" && styles.statusFilterBtnActive]}
              onPress={() => setFilterStatus("pending")}
            >
              <Text style={[styles.statusFilterText, filterStatus === "pending" && styles.statusFilterTextActive]}>
                Belum Diminum
              </Text>
            </Pressable>
            <Pressable
              style={[styles.statusFilterBtn, filterStatus === "taken" && styles.statusFilterBtnActive]}
              onPress={() => setFilterStatus("taken")}
            >
              <Text style={[styles.statusFilterText, filterStatus === "taken" && styles.statusFilterTextActive]}>
                Sudah Diminum
              </Text>
            </Pressable>
          </View>

          {/* List of Medicines */}
          <View style={{ gap: 12, marginTop: 10 }}>
            {filteredMedicines.map((item) => {
              const badge = getStatusBadge(item.status);
              const isLowStock = item.stock !== undefined && item.stock <= 3;
              const period = getTimePeriod(item.time);

              return (
                <View
                  key={item.id}
                  style={[
                    styles.scheduleCard,
                    isSeniorMode && styles.scheduleCardSenior,
                    item.status === "taken" && { borderLeftColor: colors.primary, borderLeftWidth: 4 },
                    item.status === "missed" && { borderLeftColor: colors.statusMissed, borderLeftWidth: 4 },
                    item.status === "snoozed" && { borderLeftColor: colors.statusSnoozed, borderLeftWidth: 4 },
                  ]}
                >
                  {/* Top card row */}
                  <View style={styles.cardHeader}>
                    <View style={styles.formIcon}>
                      <Ionicons
                        name={
                          item.form === "Sirup"
                            ? "water"
                            : item.form === "Injeksi"
                            ? "color-wand"
                            : item.form === "Kapsul"
                            ? "medical"
                            : "disc"
                        }
                        size={22}
                        color={item.status === "taken" ? colors.primary : colors.textSecondary}
                      />
                    </View>

                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <Text style={[styles.medName, isSeniorMode && { fontSize: 20 }]}>
                        {item.name}
                      </Text>
                      <Text style={[styles.medDetails, isSeniorMode && { fontSize: 14 }]}>
                        {item.dosage} • {item.form} • {item.note || "Sesudah makan"}
                      </Text>
                    </View>

                    <View style={{ alignItems: "flex-end" }}>
                      <View style={styles.timeTag}>
                        <Ionicons name="time-outline" size={13} color={colors.primary} />
                        <Text style={styles.timeText}>{item.time}</Text>
                      </View>
                      <Text style={styles.periodTag}>{period}</Text>
                    </View>
                  </View>

                  {/* Badges row */}
                  <View style={styles.badgesRow}>
                    <View style={[styles.statusBadge, { backgroundColor: badge.bg }]}>
                      <Ionicons name={badge.icon} size={13} color={badge.fg} />
                      <Text style={[styles.statusBadgeText, { color: badge.fg }]}>
                        {badge.label}
                      </Text>
                    </View>

                    {item.stock !== undefined && (
                      <View style={[styles.stockPill, isLowStock && styles.stockPillLow]}>
                        <Text style={[styles.stockText, isLowStock && { color: colors.statusMissed }]}>
                          Stok: {item.stock} {isLowStock ? "⚠️ Menipis" : ""}
                        </Text>
                      </View>
                    )}
                  </View>

                  {item.missedReason && (
                    <View style={styles.missedReasonBox}>
                      <Ionicons name="alert-circle" size={14} color={colors.statusMissed} />
                      <Text style={styles.missedReasonText}>
                        Alasan: "{item.missedReason}"
                      </Text>
                    </View>
                  )}

                  {/* Direct Action Buttons on Card */}
                  <View style={styles.cardActionsRow}>
                    <Pressable
                      style={[
                        styles.takeBtn,
                        item.status === "taken" && styles.takeBtnDone,
                        isSeniorMode && { paddingVertical: 12 },
                      ]}
                      onPress={() => handleTake(item)}
                    >
                      <Ionicons
                        name={item.status === "taken" ? "checkmark-done" : "checkmark-circle"}
                        size={16}
                        color="#FFF"
                      />
                      <Text style={styles.takeBtnText}>
                        {item.status === "taken" ? "Sudah Diminum" : "Minum Sekarang"}
                      </Text>
                    </Pressable>

                    <Pressable
                      style={styles.snoozeBtn}
                      onPress={() => handleOpenSnooze(item)}
                    >
                      <Ionicons name="timer-outline" size={16} color={colors.statusSnoozed} />
                      <Text style={styles.snoozeBtnText}>Tunda</Text>
                    </Pressable>

                    <Pressable
                      style={styles.skipBtn}
                      onPress={() => handleOpenSkip(item)}
                    >
                      <Ionicons name="close-circle-outline" size={16} color={colors.statusMissed} />
                      <Text style={styles.skipBtnText}>Lewatkan</Text>
                    </Pressable>
                  </View>
                </View>
              );
            })}

            {filteredMedicines.length === 0 && (
              <View style={styles.emptyCard}>
                <Ionicons name="checkmark-done-circle" size={48} color={colors.primary} />
                <Text style={styles.emptyTitle}>Tidak ada jadwal obat</Text>
                <Text style={styles.emptyDesc}>
                  Tidak ada obat untuk waktu dan filter yang dipilih.
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </View>

      {/* SNOOZE MODAL */}
      <Modal visible={snoozeModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Tunda Pengingat</Text>
            <Text style={styles.modalSubtitle}>
              Pilih berapa menit ingin menunda alarm obat {activeMedicine?.name}:
            </Text>

            <View style={{ gap: 10, marginTop: 14 }}>
              {[5, 10, 15, 30].map((mins) => (
                <Pressable
                  key={mins}
                  style={styles.snoozeOptionBtn}
                  onPress={() => handleApplySnooze(mins)}
                >
                  <Ionicons name="time-outline" size={18} color={colors.primary} />
                  <Text style={styles.snoozeOptionText}>Tunda {mins} Menit</Text>
                </Pressable>
              ))}
            </View>

            <Pressable
              style={styles.modalCancelBtn}
              onPress={() => setSnoozeModalVisible(false)}
            >
              <Text style={styles.modalCancelText}>Batal</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* SKIP MODAL */}
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
              Pilih alasan dosis {activeMedicine?.name} ini dilewati:
            </Text>

            <View style={{ gap: 8, marginTop: 12 }}>
              {[
                "Lupa membawa obat",
                "Perut masih kosong / belum makan",
                "Mengalami efek samping / mual",
                "Merasa sudah sembuh",
              ].map((reason) => (
                <Pressable
                  key={reason}
                  style={[
                    styles.reasonItem,
                    skipReason === reason && styles.reasonItemActive,
                  ]}
                  onPress={() => {
                    setSkipReason(reason);
                    setCustomSkipReason("");
                  }}
                >
                  <Text
                    style={[
                      styles.reasonText,
                      skipReason === reason && styles.reasonTextActive,
                    ]}
                  >
                    {reason}
                  </Text>
                  {skipReason === reason && (
                    <Ionicons name="checkmark" size={16} color={colors.primary} />
                  )}
                </Pressable>
              ))}
            </View>

            <TextInput
              style={styles.customReasonInput}
              placeholder="Atau tulis alasan lain..."
              placeholderTextColor={colors.textMuted}
              value={customSkipReason}
              onChangeText={setCustomSkipReason}
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
                <Text style={{ fontWeight: "800", color: "#FFF" }}>Simpan Lewat</Text>
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
    backgroundColor: colors.background,
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
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 14,
    gap: 4,
    ...shadows.glow,
  },
  addBtnText: {
    color: "#FFF",
    fontSize: 13,
    fontWeight: "800",
  },
  calendarStrip: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  dayCard: {
    flex: 1,
    alignItems: "center",
    backgroundColor: colors.cardBackground,
    paddingVertical: 10,
    borderRadius: 14,
    marginHorizontal: 2,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.subtle,
  },
  dayCardActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    ...shadows.glow,
  },
  dayLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.textSecondary,
  },
  dayLabelActive: {
    color: colors.primaryLight,
  },
  dateText: {
    fontSize: 15,
    fontWeight: "900",
    color: colors.textPrimary,
    marginTop: 2,
  },
  dateTextActive: {
    color: "#FFF",
  },
  todayDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.primary,
    marginTop: 4,
  },
  progressRibbon: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primaryLightest,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.borderTeal,
    marginBottom: 14,
  },
  progressIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  progressTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: colors.primaryDark,
  },
  progressSub: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 1,
  },
  progressPill: {
    backgroundColor: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  progressPillText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "900",
  },
  periodScroll: {
    gap: 8,
    paddingBottom: 4,
    marginBottom: 12,
  },
  periodChip: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 12,
    backgroundColor: colors.cardBackground,
    borderWidth: 1,
    borderColor: colors.border,
  },
  periodChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  periodChipText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.textSecondary,
  },
  periodChipTextActive: {
    color: "#FFF",
  },
  statusFilterRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  statusFilterBtn: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: colors.cardBackground,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statusFilterBtnActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.borderTeal,
  },
  statusFilterText: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.textSecondary,
  },
  statusFilterTextActive: {
    color: colors.primaryDark,
    fontWeight: "800",
  },
  scheduleCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.subtle,
  },
  scheduleCardSenior: {
    padding: 20,
    borderWidth: 2,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  formIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  medName: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  medDetails: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
    fontWeight: "600",
  },
  timeTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: colors.primaryLightest,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  timeText: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.primary,
  },
  periodTag: {
    fontSize: 10,
    color: colors.textMuted,
    fontWeight: "700",
    marginTop: 3,
  },
  badgesRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    gap: 4,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: "800",
  },
  stockPill: {
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  stockPillLow: {
    backgroundColor: colors.statusMissedBg,
  },
  stockText: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: "600",
  },
  missedReasonBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.statusMissedBg,
    borderRadius: 10,
    padding: 8,
    marginTop: 8,
  },
  missedReasonText: {
    fontSize: 11,
    color: colors.statusMissed,
    fontWeight: "600",
  },
  cardActionsRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F8FAFC",
  },
  takeBtn: {
    flex: 2,
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 9,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    ...shadows.glow,
  },
  takeBtnDone: {
    backgroundColor: colors.primaryDark,
  },
  takeBtnText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "800",
  },
  snoozeBtn: {
    flex: 1,
    backgroundColor: colors.statusSnoozedBg,
    borderRadius: 12,
    paddingVertical: 9,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    borderWidth: 1,
    borderColor: colors.statusSnoozedBorder,
  },
  snoozeBtnText: {
    color: colors.statusSnoozed,
    fontSize: 11,
    fontWeight: "700",
  },
  skipBtn: {
    flex: 1,
    backgroundColor: colors.statusMissedBg,
    borderRadius: 12,
    paddingVertical: 9,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    borderWidth: 1,
    borderColor: colors.statusMissedBorder,
  },
  skipBtnText: {
    color: colors.statusMissed,
    fontSize: 11,
    fontWeight: "700",
  },
  emptyCard: {
    alignItems: "center",
    paddingVertical: 40,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  emptyDesc: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: "center",
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
  modalCancelBtn: {
    alignItems: "center",
    paddingVertical: 12,
    marginTop: 12,
  },
  modalCancelText: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.textSecondary,
  },
  reasonItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 12,
  },
  reasonItemActive: {
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
  customReasonInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 13,
    backgroundColor: "#F8FAFC",
    marginTop: 10,
  },
  modalActionBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
});
