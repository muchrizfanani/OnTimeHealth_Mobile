import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BottomNav from "../components/BottomNav";
import { useApp } from "../context/AppContext";

export default function ModernCaregiverScreen() {
  const insets = useSafeAreaInsets();
  const { medicines, isSeniorMode } = useApp();

  const missed = medicines.filter((m) => m.status === "missed");
  const taken = medicines.filter((m) => m.status === "taken");

  // Grafik Mingguan (Dummy Kepatuhan Pasien)
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
    if (p >= 85) return "#0D9488";
    if (p >= 70) return "#F59E0B";
    return "#EF4444";
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
              <Ionicons name="people" size={24} color="#0D9488" />
            </View>
          </View>

          {/* CRITICAL ALERT: Obat Terlewat (P2 / Core PRD) */}
          {missed.length > 0 ? (
            missed.map((m) => (
              <View key={m.id} style={styles.criticalCard}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                  <Ionicons name="warning" size={22} color="#DC2626" />
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
              <Ionicons name="shield-checkmark" size={24} color="#0D9488" />
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
                <Text style={styles.analyticsSub}>7 hari terakhir</Text>
              </View>
              <Text style={styles.analyticsScore}>{averageWeekly}%</Text>
            </View>

            {/* Bar Chart Visual */}
            <View style={styles.chartRow}>
              {weeklyStats.map((item, index) => (
                <View key={index} style={styles.barCol}>
                  <View
                    style={[
                      styles.barFill,
                      {
                        height: `${item.percent}%`,
                        backgroundColor: getBarColor(item.percent),
                      },
                    ]}
                  />
                  <Text style={styles.barDayText}>{item.day}</Text>
                </View>
              ))}
            </View>

            {/* Tombol Ekspor PDF (PRD P1) */}
            <Pressable style={styles.exportBtn} onPress={handleExportPDF}>
              <Ionicons name="download-outline" size={18} color="#0D9488" />
              <Text style={styles.exportBtnText}>Cetak / Ekspor Laporan PDF</Text>
            </Pressable>
          </View>

          {/* Riwayat Obat Yang Sudah Dikonfirmasi */}
          <Text style={styles.sectionHeading}>Dosis Berhasil Diminum Hari Ini</Text>
          {taken.length > 0 ? (
            taken.map((m) => (
              <View key={m.id} style={styles.historyCard}>
                <Ionicons name="checkmark-circle" size={24} color="#0D9488" />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.historyName}>{m.name}</Text>
                  <Text style={styles.historyDetails}>{m.dosage} • Terkonfirmasi sekitar {m.time}</Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={{ fontSize: 13, color: "#94A3B8", fontStyle: "italic", marginTop: 4 }}>
              Belum ada obat yang dikonfirmasi diminum hari ini.
            </Text>
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
    backgroundColor: "#F8FAFC",
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
    color: "#0D9488",
    letterSpacing: 0.5,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "#0F172A",
    marginTop: 2,
  },
  headerSubtitle: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
  },
  avatarFamily: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#CCFBF1",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#99F6E4",
  },
  criticalCard: {
    backgroundColor: "#FEF2F2",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#FECACA",
    marginBottom: 14,
  },
  criticalTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#991B1B",
  },
  criticalDesc: {
    fontSize: 13,
    color: "#7F1D1D",
    marginTop: 6,
    lineHeight: 18,
  },
  callPatientBtn: {
    backgroundColor: "#DC2626",
    borderRadius: 12,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 12,
  },
  callPatientBtnText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "800",
  },
  goodCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0FDFA",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#99F6E4",
    marginBottom: 14,
  },
  goodTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#0F766E",
  },
  goodDesc: {
    fontSize: 12,
    color: "#115E59",
    marginTop: 2,
  },
  analyticsCard: {
    backgroundColor: "#FFF",
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 20,
  },
  analyticsTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#0F172A",
  },
  analyticsSub: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 2,
  },
  analyticsScore: {
    fontSize: 22,
    fontWeight: "900",
    color: "#0D9488",
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
  barFill: {
    width: 22,
    borderRadius: 8,
  },
  barDayText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#64748B",
    marginTop: 8,
  },
  exportBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#F0FDFA",
    borderRadius: 14,
    paddingVertical: 12,
    marginTop: 16,
    borderWidth: 1,
    borderColor: "#CCFBF1",
  },
  exportBtnText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#0F766E",
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 10,
  },
  historyCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 8,
  },
  historyName: {
    fontSize: 14,
    fontWeight: "800",
    color: "#0F172A",
  },
  historyDetails: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
  },
});
