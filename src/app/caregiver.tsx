import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BottomNav from "../components/BottomNav";
import { useApp } from "../context/AppContext";
import { colors, shadows } from "../styles/theme";

export default function ModernCaregiverScreen() {
  const insets = useSafeAreaInsets();
  const { medicines, isSeniorMode } = useApp();

  const missed = medicines.filter((m) => m.status === "missed");
  const taken = medicines.filter((m) => m.status === "taken");

  // Grafik Mingguan (Kepatuhan Pasien)
  const weeklyStats = [
    { day: "Sen", percent: 100 },
    { day: "Sel", percent: 85 },
    { day: "Rab", percent: 60 },
    { day: "Kam", percent: 100 },
    { day: "Jum", percent: 100 },
    { day: "Sab", percent: 75 },
    { day: "Min", percent: 90 },
  ];

  const averageWeekly = Math.round(
    weeklyStats.reduce((sum, item) => sum + item.percent, 0) / weeklyStats.length
  );

  const getBarColor = (p: number) => {
    if (p >= 85) return colors.primary;
    if (p >= 70) return colors.statusSnoozed;
    return colors.statusMissed;
  };

  const handleExportPDF = () => {
    Alert.alert(
      "📄 Ekspor Laporan Kepatuhan (PDF)",
      "Laporan kepatuhan minum obat Ibu Siti berhasil dibuat (Format PDF Siap Cetak). Anda dapat mengirimkannya ke WhatsApp dokter atau menyimpannya di dokumen.",
      [{ text: "Tutup" }]
    );
  };

  return (
    <View style={styles.container}>
      <View style={[styles.content, { paddingTop: insets.top + 10, paddingBottom: insets.bottom + 80 }]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header Caretaker */}
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.badgeText}>MODE KELUARGA / CARETAKER</Text>
              <Text style={[styles.headerTitle, isSeniorMode && { fontSize: 24 }]}>
                Pantau Ibu Siti
              </Text>
              <Text style={styles.headerSubtitle}>
                Sinkronisasi otomatis dengan HP Pasien
              </Text>
            </View>
            <View style={styles.avatarFamily}>
              <Ionicons name="people" size={24} color={colors.primary} />
            </View>
          </View>

          {/* CRITICAL ALERT: Obat Terlewat */}
          {missed.length > 0 ? (
            missed.map((m) => (
              <View key={m.id} style={styles.criticalCard}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                  <Ionicons name="warning" size={22} color={colors.statusMissed} />
                  <Text style={styles.criticalTitle}>Perhatian: Obat Terlewat!</Text>
                </View>
                <Text style={styles.criticalDesc}>
                  Obat <Text style={{ fontWeight: "800" }}>{m.name}</Text> ({m.dosage}) terjadwal pukul {m.time} belum diminum.
                  {m.missedReason ? `\nAlasan pasien: "${m.missedReason}"` : ""}
                </Text>
                <Pressable
                  style={styles.callPatientBtn}
                  onPress={() => Alert.alert("Telepon Pasien", "Menghubungi nomor HP Ibu Siti...")}
                >
                  <Ionicons name="call" size={18} color="#FFF" />
                  <Text style={styles.callPatientBtnText}>Hubungi Ibu Siti</Text>
                </Pressable>
              </View>
            ))
          ) : (
            <View style={styles.goodCard}>
              <View style={styles.goodIconWrap}>
                <Ionicons name="shield-checkmark" size={22} color={colors.primary} />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.goodTitle}>Semua Terkendali</Text>
                <Text style={styles.goodDesc}>Tidak ada jadwal obat yang terlewat hari ini.</Text>
              </View>
            </View>
          )}

          {/* Kartu Analitik Grafik Kepatuhan */}
          <View style={styles.analyticsCard}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <View>
                <Text style={styles.analyticsTitle}>Rata-Rata Kepatuhan Mingguan</Text>
                <Text style={styles.analyticsSub}>7 hari terakhir pemantauan</Text>
              </View>
              <View style={styles.scorePill}>
                <Text style={styles.analyticsScore}>{averageWeekly}%</Text>
              </View>
            </View>

            {/* Bar Chart Visual */}
            <View style={styles.chartRow}>
              {weeklyStats.map((item, index) => (
                <View key={index} style={styles.barCol}>
                  <Text style={styles.barPercentText}>{item.percent}%</Text>
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

            {/* Tombol Ekspor PDF */}
            <Pressable style={styles.exportBtn} onPress={handleExportPDF}>
              <Ionicons name="download-outline" size={18} color={colors.primary} />
              <Text style={styles.exportBtnText}>Cetak / Ekspor Laporan PDF</Text>
            </Pressable>
          </View>

          {/* Riwayat Obat Yang Sudah Dikonfirmasi */}
          <Text style={styles.sectionHeading}>Dosis Berhasil Diminum Hari Ini</Text>
          {taken.length > 0 ? (
            taken.map((m) => (
              <View key={m.id} style={styles.historyCard}>
                <View style={styles.historyIconBox}>
                  <Ionicons name="checkmark-circle" size={22} color={colors.primary} />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.historyName}>{m.name}</Text>
                  <Text style={styles.historyDetails}>{m.dosage} • Terkonfirmasi sekitar pukul {m.time} WIB</Text>
                </View>
                <View style={styles.verifiedBadge}>
                  <Text style={styles.verifiedText}>Terkonfirmasi</Text>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyTakenBox}>
              <Ionicons name="hourglass-outline" size={24} color={colors.textMuted} />
              <Text style={styles.emptyTakenText}>
                Belum ada obat yang dikonfirmasi diminum hari ini.
              </Text>
            </View>
          )}
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
  headerRow: {
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
  headerTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: colors.textPrimary,
    marginTop: 2,
  },
  headerSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  avatarFamily: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors.borderTeal,
    ...shadows.subtle,
  },
  criticalCard: {
    backgroundColor: colors.statusMissedBg,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.statusMissedBorder,
    marginBottom: 14,
  },
  criticalTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.statusMissed,
  },
  criticalDesc: {
    fontSize: 13,
    color: "#7F1D1D",
    marginTop: 6,
    lineHeight: 18,
  },
  callPatientBtn: {
    backgroundColor: colors.statusMissed,
    borderRadius: 14,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 12,
    ...shadows.subtle,
  },
  callPatientBtnText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "800",
  },
  goodCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primaryLightest,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.borderTeal,
    marginBottom: 14,
  },
  goodIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  goodTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.primaryDark,
  },
  goodDesc: {
    fontSize: 12,
    color: colors.primaryDeep,
    marginTop: 2,
  },
  analyticsCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 18,
    ...shadows.subtle,
  },
  analyticsTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  analyticsSub: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  scorePill: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderTeal,
  },
  analyticsScore: {
    fontSize: 18,
    fontWeight: "900",
    color: colors.primaryDark,
  },
  chartRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 120,
    marginTop: 18,
    paddingBottom: 4,
  },
  barCol: {
    flex: 1,
    alignItems: "center",
    height: "100%",
    justifyContent: "flex-end",
  },
  barPercentText: {
    fontSize: 9,
    fontWeight: "700",
    color: colors.textMuted,
    marginBottom: 3,
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
  exportBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: colors.primaryLightest,
    borderRadius: 14,
    paddingVertical: 12,
    marginTop: 16,
    borderWidth: 1,
    borderColor: colors.borderTeal,
  },
  exportBtnText: {
    fontSize: 13,
    fontWeight: "800",
    color: colors.primaryDark,
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.textPrimary,
    marginBottom: 10,
  },
  historyCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 8,
    ...shadows.subtle,
  },
  historyIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  historyName: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  historyDetails: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  verifiedBadge: {
    backgroundColor: colors.primaryLightest,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.borderTeal,
  },
  verifiedText: {
    fontSize: 10,
    fontWeight: "800",
    color: colors.primaryDark,
  },
  emptyTakenBox: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 6,
  },
  emptyTakenText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontStyle: "italic",
    textAlign: "center",
  },
});
