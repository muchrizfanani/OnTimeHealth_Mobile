import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BottomNav from "../components/BottomNav";
import { useApp } from "../context/AppContext";
import { Medicine, MedicineStatus } from "../types/medicine";

export default function ModernDashboard() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { medicines, userProfile, isSeniorMode, toggleSeniorMode, updateMedicineStatus } = useApp();

  // Logika Perhitungan Kepatuhan (P0 / Modul 2 Logic)
  const totalCount = medicines.length;
  const takenCount = medicines.filter((m) => m.status === "taken").length;
  const percent = totalCount > 0 ? Math.round((takenCount / totalCount) * 100) : 0;
  const nextMed = medicines.find((m) => m.status === "pending" || m.status === "snoozed");

  // ===============================================================
  // RUBRIK MODUL 2: Menerapkan useEffect()
  // ===============================================================
  useEffect(() => {
    // 1. Initial mount: cek stok menipis
    const lowStock = medicines.filter((m) => m.stock !== undefined && m.stock <= 3);
    if (lowStock.length > 0) {
      console.log(`[Peringatan Stok] ${lowStock.length} obat membutuhkan isi ulang (refill).`);
    }
  }, []);

  useEffect(() => {
    // 2. Dependency tracker: pantau update kepatuhan
    console.log(`[Sinkronisasi Kepatuhan] ${takenCount}/${totalCount} obat tercatat diminum (${percent}%)`);
  }, [medicines]);

  // Status Visual Helper (Anggota 1 Styling Specialist)
  const getStatusBadge = (status: MedicineStatus) => {
    switch (status) {
      case "taken":
        return {
          label: "Sudah Diminum",
          bg: "#CCFBF1",
          fg: "#0F766E",
          icon: "checkmark-circle" as const,
        };
      case "snoozed":
        return {
          label: "Ditunda (Snooze)",
          bg: "#FEF3C7",
          fg: "#B45309",
          icon: "time" as const,
        };
      case "missed":
        return {
          label: "Terlewat (Skip)",
          bg: "#FEE2E2",
          fg: "#B91C1C",
          icon: "close-circle" as const,
        };
      case "pending":
      default:
        return {
          label: "Menunggu Jadwal",
          bg: "#F1F5F9",
          fg: "#475569",
          icon: "alarm-outline" as const,
        };
    }
  };

  const handleToggleCardStatus = (med: Medicine) => {
    const nextMap: Record<MedicineStatus, MedicineStatus> = {
      pending: "taken",
      taken: "snoozed",
      snoozed: "missed",
      missed: "pending",
    };
    updateMedicineStatus(med.id, nextMap[med.status]);
  };

  // Render Item FlatList
  const renderItem = ({ item }: { item: Medicine }) => {
    const badge = getStatusBadge(item.status);
    const isLowStock = item.stock !== undefined && item.stock <= 3;

    return (
      <Pressable
        style={[
          styles.medicineCard,
          isSeniorMode && styles.medicineCardSenior,
          // INLINE STYLING DINAMIS: Border status
          item.status === "taken" && { borderLeftColor: "#0D9488", borderLeftWidth: 5 },
          item.status === "missed" && { borderLeftColor: "#EF4444", borderLeftWidth: 5 },
        ]}
        onPress={() => handleToggleCardStatus(item)}
      >
        <View style={styles.cardHeaderRow}>
          <View
            style={[
              styles.formIconWrap,
              item.status === "taken" && { backgroundColor: "#CCFBF1" },
            ]}
          >
            <Ionicons
              name={
                item.form === "Sirup"
                  ? "water"
                  : item.form === "Injeksi"
                  ? "color-wand"
                  : "disc"
              }
              size={22}
              color={item.status === "taken" ? "#0D9488" : "#64748B"}
            />
          </View>

          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={[styles.cardMedName, isSeniorMode && { fontSize: 20 }]}>
              {item.name}
            </Text>
            <Text style={[styles.cardMedDosage, isSeniorMode && { fontSize: 15 }]}>
              {item.dosage} • {item.form} • {item.note || "Sesudah makan"}
            </Text>
          </View>

          <View style={{ alignItems: "flex-end" }}>
            <Text style={[styles.cardTime, isSeniorMode && { fontSize: 16 }]}>
              {item.time}
            </Text>
            {item.stock !== undefined && (
              <Text
                style={[
                  styles.stockBadge,
                  isLowStock && { color: "#EF4444", fontWeight: "800" },
                ]}
              >
                Stok: {item.stock} {isLowStock ? "⚠️" : ""}
              </Text>
            )}
          </View>
        </View>

        {/* Status Chip (Dynamic Inline Style) */}
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
          <View style={[styles.statusChip, { backgroundColor: badge.bg }]}>
            <Ionicons name={badge.icon} size={14} color={badge.fg} />
            <Text style={[styles.statusChipText, { color: badge.fg }]}>
              {badge.label}
            </Text>
          </View>

          <Text style={styles.tapTipText}>*Ketuk untuk ganti status</Text>
        </View>

        {item.missedReason && (
          <View style={styles.missedReasonBox}>
            <Text style={styles.missedReasonText}>
              Alasan Terlewat: "{item.missedReason}"
            </Text>
          </View>
        )}
      </Pressable>
    );
  };

  const headerComponent = (
    <View style={{ marginBottom: 14 }}>
      {/* Profil Bar & Mode Senior Toggle */}
      <View style={styles.profileRow}>
        <View style={styles.avatarWrap}>
          <Text style={styles.avatarLetter}>{userProfile.name.charAt(0)}</Text>
        </View>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.greetingText}>Selamat beraktivitas 👋</Text>
          <Text style={[styles.userNameText, isSeniorMode && { fontSize: 22 }]}>
            {userProfile.name} ({userProfile.age} th)
          </Text>
          <Text style={styles.conditionText}>Kondisi: {userProfile.condition}</Text>
        </View>

        <Pressable
          style={styles.loginShortcutBtn}
          onPress={() => router.push("/login")}
        >
          <Ionicons name="swap-horizontal" size={20} color="#0D9488" />
        </Pressable>
      </View>

      {/* P1: SENIOR ACCESSIBILITY TOGGLE */}
      <View style={styles.seniorToggleCard}>
        <View style={{ flex: 1 }}>
          <Text style={styles.seniorToggleTitle}>Mode Lansia (Senior UI)</Text>
          <Text style={styles.seniorToggleDesc}>
            Perbesar teks, kontras tinggi & navigasi sederhana
          </Text>
        </View>
        <Switch
          value={isSeniorMode}
          onValueChange={toggleSeniorMode}
          trackColor={{ false: "#CBD5E1", true: "#0D9488" }}
          thumbColor="#FFF"
        />
      </View>

      {/* Hero Card: Next Dose (Akses Cepat Pengingat) */}
      <Pressable
        style={[styles.heroCard, isSeniorMode && { padding: 24 }]}
        onPress={() => router.push("/reminder")}
      >
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
          <View style={{ flex: 1 }}>
            <View style={styles.heroTag}>
              <Ionicons name="alarm" size={14} color="#FFF" />
              <Text style={styles.heroTagText}>JADWAL BERIKUTNYA</Text>
            </View>
            <Text style={[styles.heroMedName, isSeniorMode && { fontSize: 26 }]}>
              {nextMed ? nextMed.name : "Semua Selesai! 🎉"}
            </Text>
            <Text style={[styles.heroMedSub, isSeniorMode && { fontSize: 16 }]}>
              {nextMed
                ? `${nextMed.dosage} • Pukul ${nextMed.time} WIB • ${nextMed.note}`
                : "Hebat! Semua obat hari ini sudah Anda minum tepat waktu."}
            </Text>
          </View>
          <View style={styles.heroArrowBtn}>
            <Ionicons name="arrow-forward" size={20} color="#0D9488" />
          </View>
        </View>
      </Pressable>

      {/* Adherence Summary Bar */}
      <View style={styles.adherenceCard}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <Text style={[styles.adherenceTitle, isSeniorMode && { fontSize: 18 }]}>
            Kepatuhan Hari Ini
          </Text>
          <Text style={styles.adherenceScore}>
            {takenCount} dari {totalCount} ({percent}%)
          </Text>
        </View>

        {/* Dynamic Inline Style: Progress Bar Width */}
        <View style={styles.progressBarTrack}>
          <View style={[styles.progressBarFill, { width: `${percent}%` }]} />
        </View>
      </View>

      {/* Section Title & Add Button */}
      <View style={styles.sectionHeaderRow}>
        <Text style={[styles.sectionTitle, isSeniorMode && { fontSize: 20 }]}>
          Jadwal Obat Harian
        </Text>
        <Pressable
          style={styles.addMedBtn}
          onPress={() => router.push("/add-medication")}
        >
          <Ionicons name="add" size={18} color="#FFF" />
          <Text style={styles.addMedBtnText}>+ Tambah Obat</Text>
        </Pressable>
      </View>
    </View>
  );

  return (
    <View style={styles.screen}>
      <View style={[styles.content, { paddingTop: insets.top + 8 }]}>
        <FlatList
          data={medicines}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ListHeaderComponent={headerComponent}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: insets.bottom + 80 }}
          showsVerticalScrollIndicator={false}
        />
      </View>
      <BottomNav />
    </View>
  );
}

// EXTERNAL STYLES: Dibuat terpisah menggunakan StyleSheet.create
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  content: {
    flex: 1,
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  avatarWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#CCFBF1",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#99F6E4",
  },
  avatarLetter: {
    fontSize: 20,
    fontWeight: "900",
    color: "#0F766E",
  },
  greetingText: {
    fontSize: 12,
    color: "#64748B",
    fontWeight: "600",
  },
  userNameText: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0F172A",
  },
  conditionText: {
    fontSize: 11,
    color: "#0D9488",
    fontWeight: "600",
    marginTop: 1,
  },
  loginShortcutBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F0FDFA",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#CCFBF1",
  },
  seniorToggleCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 14,
  },
  seniorToggleTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: "#0F172A",
  },
  seniorToggleDesc: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 1,
  },
  heroCard: {
    backgroundColor: "#0D9488",
    borderRadius: 22,
    padding: 20,
    shadowColor: "#0D9488",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 14,
    elevation: 4,
    marginBottom: 14,
  },
  heroTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginBottom: 8,
  },
  heroTagText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#FFF",
  },
  heroMedName: {
    fontSize: 22,
    fontWeight: "900",
    color: "#FFF",
  },
  heroMedSub: {
    fontSize: 13,
    color: "#CCFBF1",
    marginTop: 4,
    fontWeight: "600",
  },
  heroArrowBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
  },
  adherenceCard: {
    backgroundColor: "#FFF",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 18,
  },
  adherenceTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#0F172A",
  },
  adherenceScore: {
    fontSize: 13,
    fontWeight: "700",
    color: "#0D9488",
  },
  progressBarTrack: {
    height: 8,
    backgroundColor: "#F1F5F9",
    borderRadius: 4,
    marginTop: 10,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#0D9488",
    borderRadius: 4,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0F172A",
  },
  addMedBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0D9488",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
    gap: 4,
  },
  addMedBtnText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "800",
  },
  medicineCard: {
    backgroundColor: "#FFF",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  medicineCardSenior: {
    padding: 20,
    borderWidth: 2,
  },
  cardHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  formIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  cardMedName: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0F172A",
  },
  cardMedDosage: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
    fontWeight: "600",
  },
  cardTime: {
    fontSize: 15,
    fontWeight: "800",
    color: "#0D9488",
  },
  stockBadge: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 2,
    fontWeight: "600",
  },
  statusChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusChipText: {
    fontSize: 11,
    fontWeight: "800",
  },
  tapTipText: {
    fontSize: 11,
    color: "#94A3B8",
    fontStyle: "italic",
  },
  missedReasonBox: {
    backgroundColor: "#FEF2F2",
    borderRadius: 10,
    padding: 8,
    marginTop: 8,
  },
  missedReasonText: {
    fontSize: 11,
    color: "#B91C1C",
    fontWeight: "600",
  },
});
