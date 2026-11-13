import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BottomNav from "../components/BottomNav";
import { useApp } from "../context/AppContext";
import { colors, shadows } from "../styles/theme";

interface HistoryLogItem {
  id: string;
  medName: string;
  dosage: string;
  form: string;
  date: string;
  time: string;
  status: "taken" | "missed" | "snoozed";
  reason?: string;
  note?: string;
}

export default function HistoryScreen() {
  const insets = useSafeAreaInsets();
  const { medicines, isSeniorMode } = useApp();

  const [filterType, setFilterType] = useState<"all" | "taken" | "missed" | "snoozed">("all");

  // Weekly analytics data
  const weeklyStats = [
    { day: "Sen", percent: 100, date: "17 Okt" },
    { day: "Sel", percent: 85, date: "18 Okt" },
    { day: "Rab", percent: 65, date: "19 Okt" },
    { day: "Kam", percent: 100, date: "20 Okt" },
    { day: "Jum", percent: 100, date: "21 Okt" },
    { day: "Sab", percent: 75, date: "22 Okt" },
    { day: "Min", percent: 90, date: "23 Okt" },
  ];

  const averageAdherence = Math.round(
    weeklyStats.reduce((sum, item) => sum + item.percent, 0) / weeklyStats.length
  );

  // Histori log statis + dinamis dari medicines
  const dynamicLogs: HistoryLogItem[] = medicines.map((m) => ({
    id: `dyn-${m.id}`,
    medName: m.name,
    dosage: m.dosage,
    form: m.form,
    date: "Hari ini, 23 Okt 2026",
    time: m.time,
    status: (m.status === "pending" ? "taken" : m.status) as "taken" | "missed" | "snoozed",
    reason: m.missedReason,
    note: m.note,
  }));

  const pastLogs: HistoryLogItem[] = [
    {
      id: "hist-1",
      medName: "Amlodipine",
      dosage: "5 mg",
      form: "Tablet",
      date: "Kemarin, 22 Okt 2026",
      time: "07:00",
      status: "taken",
      note: "Sesudah makan",
    },
    {
      id: "hist-2",
      medName: "Metformin",
      dosage: "500 mg",
      form: "Tablet",
      date: "Kemarin, 22 Okt 2026",
      time: "12:30",
      status: "taken",
      note: "Bersama makan",
    },
    {
      id: "hist-3",
      medName: "Captopril",
      dosage: "25 mg",
      form: "Tablet",
      date: "Kemarin, 22 Okt 2026",
      time: "21:00",
      status: "missed",
      reason: "Ketiduran lebih awal",
      note: "Sebelum tidur",
    },
    {
      id: "hist-4",
      medName: "Glimepiride",
      dosage: "2 mg",
      form: "Tablet",
      date: "21 Okt 2026",
      time: "18:00",
      status: "taken",
      note: "Sebelum makan",
    },
  ];

  const allLogs = [...dynamicLogs, ...pastLogs];

  const filteredLogs = allLogs.filter((log) => {
    if (filterType === "all") return true;
    return log.status === filterType;
  });

  const getBarColor = (p: number) => {
    if (p >= 85) return colors.primary;
    if (p >= 70) return colors.statusSnoozed;
    return colors.statusMissed;
  };

  const handleExportPDF = () => {
    Alert.alert(
      "📄 Ekspor Laporan PDF Selesai",
      "Ringkasan audit kepatuhan konsumsi obat pasien berhasil dibuat dalam format PDF (A4 standar medis). Siap dikirimkan ke Dokter atau dicetak.",
      [{ text: "Tutup" }]
    );
  };

  return (
    <View style={styles.container}>
      <View style={[styles.content, { paddingTop: insets.top + 10, paddingBottom: insets.bottom + 80 }]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.badgeText}>AUDIT & STATISTIK</Text>
              <Text style={[styles.title, isSeniorMode && { fontSize: 26 }]}>
                Riwayat & Kepatuhan
              </Text>
              <Text style={styles.subtitle}>
                Analisis kepatuhan minum obat dan histori harian
              </Text>
            </View>
            <Pressable style={styles.exportBtn} onPress={handleExportPDF}>
              <Ionicons name="document-text-outline" size={20} color={colors.primary} />
            </Pressable>
          </View>

          {/* Adherence Score Card */}
          <View style={styles.scoreCard}>
            <View style={styles.scoreRow}>
              <View>
                <View style={styles.streakBadge}>
                  <Text style={styles.streakText}>🔥 5 HARI STREAK DISIPLIN</Text>
                </View>
                <Text style={styles.scoreTitle}>Skor Kepatuhan Mingguan</Text>
                <Text style={styles.scoreDesc}>Status: Sangat Baik (Target ≥ 80%)</Text>
              </View>
              <View style={styles.scoreCircle}>
                <Text style={styles.scoreNumber}>{averageAdherence}%</Text>
              </View>
            </View>

            {/* Metrics pills */}
            <View style={styles.metricsBox}>
              <View style={styles.metricCol}>
                <Text style={styles.metricVal}>28</Text>
                <Text style={styles.metricLbl}>Dosis Diminum</Text>
              </View>
              <View style={styles.metricDivider} />
              <View style={styles.metricCol}>
                <Text style={[styles.metricVal, { color: colors.statusMissed }]}>3</Text>
                <Text style={styles.metricLbl}>Terlewat</Text>
              </View>
              <View style={styles.metricDivider} />
              <View style={styles.metricCol}>
                <Text style={[styles.metricVal, { color: colors.statusSnoozed }]}>4</Text>
                <Text style={styles.metricLbl}>Ditunda</Text>
              </View>
            </View>
          </View>

          {/* 7-Day Compliance Chart */}
          <View style={styles.chartCard}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <Text style={styles.chartTitle}>Grafik Kepatuhan 7 Hari Terakhir</Text>
              <Text style={styles.chartSub}>Rata-rata: {averageAdherence}%</Text>
            </View>

            <View style={styles.chartArea}>
              {weeklyStats.map((item, index) => (
                <View key={index} style={styles.chartCol}>
                  <Text style={styles.barPercent}>{item.percent}%</Text>
                  <View style={styles.barTrack}>
                    <View
                      style={[
                        styles.barFill,
                        {
                          height: `${item.percent}%`,
                          backgroundColor: getBarColor(item.percent),
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.barDayText}>{item.day}</Text>
                </View>
              ))}
            </View>

            {/* Legend */}
            <View style={styles.legendRow}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: colors.primary }]} />
                <Text style={styles.legendText}>Tinggi (≥ 85%)</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: colors.statusSnoozed }]} />
                <Text style={styles.legendText}>Sedang (70-84%)</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: colors.statusMissed }]} />
                <Text style={styles.legendText}>Rendah (&lt; 70%)</Text>
              </View>
            </View>
          </View>

          {/* CTA Export PDF */}
          <Pressable style={styles.exportBanner} onPress={handleExportPDF}>
            <View style={styles.exportIconBox}>
              <Ionicons name="download" size={20} color="#FFF" />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.exportBannerTitle}>Ekspor Laporan ke Dokter</Text>
              <Text style={styles.exportBannerDesc}>Unduh format PDF untuk ditunjukkan saat konsultasi klinik.</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.primary} />
          </Pressable>

          {/* Filter Pills Log */}
          <View style={styles.filterSection}>
            <Text style={styles.sectionTitle}>Log Histori Minum Obat</Text>
            <View style={styles.filterRow}>
              <Pressable
                style={[styles.filterBtn, filterType === "all" && styles.filterBtnActive]}
                onPress={() => setFilterType("all")}
              >
                <Text style={[styles.filterBtnText, filterType === "all" && styles.filterBtnTextActive]}>
                  Semua ({allLogs.length})
                </Text>
              </Pressable>
              <Pressable
                style={[styles.filterBtn, filterType === "taken" && styles.filterBtnActive]}
                onPress={() => setFilterType("taken")}
              >
                <Text style={[styles.filterBtnText, filterType === "taken" && styles.filterBtnTextActive]}>
                  Diminum
                </Text>
              </Pressable>
              <Pressable
                style={[styles.filterBtn, filterType === "missed" && styles.filterBtnActive]}
                onPress={() => setFilterType("missed")}
              >
                <Text style={[styles.filterBtnText, filterType === "missed" && styles.filterBtnTextActive]}>
                  Terlewat
                </Text>
              </Pressable>
              <Pressable
                style={[styles.filterBtn, filterType === "snoozed" && styles.filterBtnActive]}
                onPress={() => setFilterType("snoozed")}
              >
                <Text style={[styles.filterBtnText, filterType === "snoozed" && styles.filterBtnTextActive]}>
                  Ditunda
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Log List */}
          <View style={{ gap: 10, marginTop: 10 }}>
            {filteredLogs.map((log) => {
              const isTaken = log.status === "taken";
              const isMissed = log.status === "missed";
              const isSnoozed = log.status === "snoozed";

              return (
                <View key={log.id} style={styles.logCard}>
                  <View style={styles.logHeader}>
                    <View
                      style={[
                        styles.logIcon,
                        isTaken && { backgroundColor: colors.statusTakenBg },
                        isMissed && { backgroundColor: colors.statusMissedBg },
                        isSnoozed && { backgroundColor: colors.statusSnoozedBg },
                      ]}
                    >
                      <Ionicons
                        name={
                          isTaken
                            ? "checkmark-circle"
                            : isMissed
                            ? "close-circle"
                            : "time"
                        }
                        size={22}
                        color={
                          isTaken
                            ? colors.statusTaken
                            : isMissed
                            ? colors.statusMissed
                            : colors.statusSnoozed
                        }
                      />
                    </View>

                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <Text style={[styles.logMedName, isSeniorMode && { fontSize: 18 }]}>
                        {log.medName}
                      </Text>
                      <Text style={styles.logSub}>
                        {log.dosage} • {log.form} • {log.note || "Sesuai resep"}
                      </Text>
                    </View>

                    <View style={{ alignItems: "flex-end" }}>
                      <Text style={styles.logTime}>{log.time} WIB</Text>
                      <Text style={styles.logDate}>{log.date.split(",")[0]}</Text>
                    </View>
                  </View>

                  {/* Status label & reason */}
                  <View style={styles.logFooter}>
                    <View
                      style={[
                        styles.logStatusBadge,
                        isTaken && { backgroundColor: colors.statusTakenBg },
                        isMissed && { backgroundColor: colors.statusMissedBg },
                        isSnoozed && { backgroundColor: colors.statusSnoozedBg },
                      ]}
                    >
                      <Text
                        style={[
                          styles.logStatusText,
                          isTaken && { color: colors.statusTaken },
                          isMissed && { color: colors.statusMissed },
                          isSnoozed && { color: colors.statusSnoozed },
                        ]}
                      >
                        {isTaken ? "Terkonfirmasi Diminum" : isMissed ? "Dosis Terlewat" : "Alarm Ditunda"}
                      </Text>
                    </View>

                    {log.reason && (
                      <Text style={styles.reasonText}>
                        Alasan: "{log.reason}"
                      </Text>
                    )}
                  </View>
                </View>
              );
            })}
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
  exportBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.primaryLightest,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.borderTeal,
    ...shadows.subtle,
  },
  scoreCard: {
    backgroundColor: colors.primary,
    borderRadius: 22,
    padding: 20,
    marginBottom: 14,
    ...shadows.glow,
  },
  scoreRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  streakBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.22)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginBottom: 6,
  },
  streakText: {
    color: "#FFF",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  scoreTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#FFF",
  },
  scoreDesc: {
    fontSize: 12,
    color: colors.primaryLight,
    marginTop: 2,
  },
  scoreCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
    ...shadows.subtle,
  },
  scoreNumber: {
    fontSize: 20,
    fontWeight: "900",
    color: colors.primary,
  },
  metricsBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.12)",
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginTop: 16,
  },
  metricCol: {
    flex: 1,
    alignItems: "center",
  },
  metricVal: {
    fontSize: 16,
    fontWeight: "900",
    color: "#FFF",
  },
  metricLbl: {
    fontSize: 11,
    color: colors.primaryLight,
    marginTop: 2,
  },
  metricDivider: {
    width: 1,
    height: 22,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  chartCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 14,
    ...shadows.subtle,
  },
  chartTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  chartSub: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.primary,
  },
  chartArea: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 130,
    marginTop: 20,
    paddingBottom: 4,
  },
  chartCol: {
    flex: 1,
    alignItems: "center",
    height: "100%",
    justifyContent: "flex-end",
  },
  barPercent: {
    fontSize: 10,
    fontWeight: "700",
    color: colors.textMuted,
    marginBottom: 4,
  },
  barTrack: {
    width: 22,
    height: 80,
    backgroundColor: "#F1F5F9",
    borderRadius: 8,
    justifyContent: "flex-end",
    overflow: "hidden",
  },
  barFill: {
    width: "100%",
    borderRadius: 8,
  },
  barDayText: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.textSecondary,
    marginTop: 8,
  },
  legendRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F8FAFC",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: "600",
  },
  exportBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.cardBackground,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
    ...shadows.subtle,
  },
  exportIconBox: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  exportBannerTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  exportBannerDesc: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  filterSection: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.textPrimary,
    marginBottom: 10,
  },
  filterRow: {
    flexDirection: "row",
    gap: 8,
  },
  filterBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: colors.cardBackground,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterBtnActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterBtnText: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.textSecondary,
  },
  filterBtnTextActive: {
    color: "#FFF",
  },
  logCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.subtle,
  },
  logHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  logIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  logMedName: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  logSub: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  logTime: {
    fontSize: 13,
    fontWeight: "800",
    color: colors.primary,
  },
  logDate: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
  logFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#F8FAFC",
  },
  logStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  logStatusText: {
    fontSize: 10,
    fontWeight: "800",
  },
  reasonText: {
    fontSize: 11,
    color: colors.statusMissed,
    fontStyle: "italic",
  },
});
