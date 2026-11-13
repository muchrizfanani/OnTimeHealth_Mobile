import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
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
import { colors, shadows } from "../styles/theme";
import { Medicine, MedicineStatus } from "../types/medicine";

export default function ModernDashboard() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { medicines, userProfile, isSeniorMode, toggleSeniorMode, updateMedicineStatus } = useApp();

  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "taken">("all");

  // Logika Perhitungan Kepatuhan
  const totalCount = medicines.length;
  const takenCount = medicines.filter((m) => m.status === "taken").length;
  const percent = totalCount > 0 ? Math.round((takenCount / totalCount) * 100) : 0;
  const nextMed = medicines.find((m) => m.status === "pending" || m.status === "snoozed");

  // Filtered medicines
  const filteredMedicines = medicines.filter((m) => {
    if (filterStatus === "taken") return m.status === "taken";
    if (filterStatus === "pending") return m.status === "pending" || m.status === "snoozed" || m.status === "missed";
    return true;
  });

  // Cek stok menipis
  const lowStockMedicines = medicines.filter((m) => m.stock !== undefined && m.stock <= 3);

  useEffect(() => {
    if (lowStockMedicines.length > 0) {
      console.log(`[Peringatan Stok] ${lowStockMedicines.length} obat membutuhkan isi ulang (refill).`);
    }
  }, []);

  useEffect(() => {
    console.log(`[Sinkronisasi Kepatuhan] ${takenCount}/${totalCount} obat tercatat diminum (${percent}%)`);
  }, [medicines]);

  // Status Visual Helper
  const getStatusBadge = (status: MedicineStatus) => {
    switch (status) {
      case "taken":
        return {
          label: "Sudah Diminum",
          bg: colors.statusTakenBg,
          fg: colors.statusTaken,
          icon: "checkmark-circle" as const,
        };
      case "snoozed":
        return {
          label: "Ditunda (Snooze)",
          bg: colors.statusSnoozedBg,
          fg: colors.statusSnoozed,
          icon: "time" as const,
        };
      case "missed":
        return {
          label: "Terlewat (Skip)",
          bg: colors.statusMissedBg,
          fg: colors.statusMissed,
          icon: "close-circle" as const,
        };
      case "pending":
      default:
        return {
          label: "Menunggu Jadwal",
          bg: colors.statusPendingBg,
          fg: colors.statusPending,
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

  const renderMedicineCard = ({ item }: { item: Medicine }) => {
    const badge = getStatusBadge(item.status);
    const isLowStock = item.stock !== undefined && item.stock <= 3;

    return (
      <Pressable
        style={[
          styles.medicineCard,
          isSeniorMode && styles.medicineCardSenior,
          item.status === "taken" && { borderLeftColor: colors.primary, borderLeftWidth: 4 },
          item.status === "missed" && { borderLeftColor: colors.statusMissed, borderLeftWidth: 4 },
          item.status === "snoozed" && { borderLeftColor: colors.statusSnoozed, borderLeftWidth: 4 },
        ]}
        onPress={() => handleToggleCardStatus(item)}
      >
        <View style={styles.cardHeaderRow}>
          <View
            style={[
              styles.formIconWrap,
              item.status === "taken" && { backgroundColor: colors.primaryLight },
            ]}
          >
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
              size={isSeniorMode ? 24 : 20}
              color={item.status === "taken" ? colors.primary : colors.textSecondary}
            />
          </View>

          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={[styles.cardMedName, isSeniorMode && { fontSize: 20 }]}>
              {item.name}
            </Text>
            <Text style={[styles.cardMedDosage, isSeniorMode && { fontSize: 14 }]}>
              {item.dosage} • {item.form} • {item.note || "Sesudah makan"}
            </Text>
          </View>

          <View style={{ alignItems: "flex-end" }}>
            <View style={styles.timeRow}>
              <Ionicons name="time-outline" size={14} color={colors.primary} />
              <Text style={[styles.cardTime, isSeniorMode && { fontSize: 17 }]}>
                {item.time}
              </Text>
            </View>
            {item.stock !== undefined && (
              <Text
                style={[
                  styles.stockBadge,
                  isLowStock && { color: colors.statusMissed, fontWeight: "800" },
                ]}
              >
                Stok: {item.stock} {isLowStock ? "⚠️" : ""}
              </Text>
            )}
          </View>
        </View>

        {/* Status Chip & Tap Tip */}
        <View style={styles.cardFooterRow}>
          <View style={[styles.statusChip, { backgroundColor: badge.bg }]}>
            <Ionicons name={badge.icon} size={14} color={badge.fg} />
            <Text style={[styles.statusChipText, { color: badge.fg }]}>
              {badge.label}
            </Text>
          </View>

          <Text style={styles.tapTipText}>*Ketuk untuk ubah status</Text>
        </View>

        {item.missedReason && (
          <View style={styles.missedReasonBox}>
            <Ionicons name="information-circle" size={14} color={colors.statusMissed} />
            <Text style={styles.missedReasonText}>
              Alasan: "{item.missedReason}"
            </Text>
          </View>
        )}
      </Pressable>
    );
  };

  const headerComponent = (
    <View style={{ marginBottom: 12 }}>
      {/* 1. Header Profile & Role Indicator */}
      <View style={styles.profileRow}>
        <Pressable
          style={styles.avatarWrap}
          onPress={() => router.push("/profile")}
        >
          <Text style={styles.avatarLetter}>{userProfile.name.charAt(0)}</Text>
        </Pressable>

        <Pressable
          style={{ flex: 1, marginLeft: 12 }}
          onPress={() => router.push("/profile")}
        >
          <Text style={styles.greetingText}>Selamat beraktivitas 👋</Text>
          <Text style={[styles.userNameText, isSeniorMode && { fontSize: 22 }]}>
            {userProfile.name}
          </Text>
          <View style={styles.conditionBadge}>
            <Ionicons name="heart" size={11} color={colors.primary} />
            <Text style={styles.conditionText}>{userProfile.condition}</Text>
          </View>
        </Pressable>

        <View style={{ flexDirection: "row", gap: 8 }}>
          <Pressable
            style={styles.headerActionBtn}
            onPress={() => router.push("/reminder")}
          >
            <Ionicons name="alarm-outline" size={20} color={colors.primary} />
          </Pressable>
          <Pressable
            style={styles.headerActionBtn}
            onPress={() => router.push("/login")}
          >
            <Ionicons name="swap-horizontal" size={20} color={colors.primary} />
          </Pressable>
        </View>
      </View>

      {/* 2. Mode Lansia (Senior Accessibility Toggle) */}
      <View style={styles.seniorToggleCard}>
        <View style={styles.seniorIconBox}>
          <Ionicons name="text-outline" size={20} color={colors.primary} />
        </View>
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={styles.seniorToggleTitle}>Mode Lansia (Senior UI)</Text>
          <Text style={styles.seniorToggleDesc}>
            Perbesar teks, kontras tinggi & tombol nyaman
          </Text>
        </View>
        <Switch
          value={isSeniorMode}
          onValueChange={toggleSeniorMode}
          trackColor={{ false: "#CBD5E1", true: colors.primary }}
          thumbColor="#FFF"
        />
      </View>

      {/* 3. Hero Card: Jadwal Obat Berikutnya (Next Dose) */}
      <Pressable
        style={[styles.heroCard, isSeniorMode && { padding: 24 }]}
        onPress={() => router.push("/reminder")}
      >
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
          <View style={{ flex: 1, paddingRight: 8 }}>
            <View style={styles.heroTag}>
              <Ionicons name="alarm" size={13} color="#FFF" />
              <Text style={styles.heroTagText}>JADWAL BERIKUTNYA</Text>
            </View>
            <Text style={[styles.heroMedName, isSeniorMode && { fontSize: 26 }]}>
              {nextMed ? nextMed.name : "Semua Dosis Selesai! 🎉"}
            </Text>
            <Text style={[styles.heroMedSub, isSeniorMode && { fontSize: 15 }]}>
              {nextMed
                ? `${nextMed.dosage} • Pukul ${nextMed.time} WIB • ${nextMed.note || "Sesudah makan"}`
                : "Luar biasa! Semua jadwal obat hari ini sudah Anda minum dengan teratur."}
            </Text>
          </View>
          <View style={styles.heroArrowBtn}>
            <Ionicons name="arrow-forward" size={20} color={colors.primary} />
          </View>
        </View>
      </Pressable>

      {/* 4. Ringkasan Kepatuhan Hari Ini */}
      <View style={styles.adherenceCard}>
        <View style={styles.adherenceHeader}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <Ionicons name="shield-checkmark" size={18} color={colors.primary} />
            <Text style={[styles.adherenceTitle, isSeniorMode && { fontSize: 18 }]}>
              Kepatuhan Hari Ini
            </Text>
          </View>
          <View style={styles.adherenceScoreBadge}>
            <Text style={styles.adherenceScoreText}>{percent}%</Text>
          </View>
        </View>

        <Text style={styles.adherenceSubText}>
          {takenCount} dari {totalCount} obat sudah diminum tepat waktu
        </Text>

        <View style={styles.progressBarTrack}>
          <View style={[styles.progressBarFill, { width: `${percent}%` }]} />
        </View>
      </View>

      {/* 5. Quick Shortcut Actions Grid */}
      <View style={styles.shortcutsRow}>
        <Pressable
          style={styles.shortcutItem}
          onPress={() => router.push("/schedule")}
        >
          <View style={[styles.shortcutIconWrap, { backgroundColor: colors.primaryLight }]}>
            <Ionicons name="calendar" size={20} color={colors.primary} />
          </View>
          <Text style={styles.shortcutLabel}>Jadwal</Text>
        </Pressable>

        <Pressable
          style={styles.shortcutItem}
          onPress={() => router.push("/reminder")}
        >
          <View style={[styles.shortcutIconWrap, { backgroundColor: "#FEF3C7" }]}>
            <Ionicons name="alarm" size={20} color="#B45309" />
          </View>
          <Text style={styles.shortcutLabel}>Alarm</Text>
        </Pressable>

        <Pressable
          style={styles.shortcutItem}
          onPress={() => router.push("/history")}
        >
          <View style={[styles.shortcutIconWrap, { backgroundColor: "#E0E7FF" }]}>
            <Ionicons name="stats-chart" size={20} color="#4338CA" />
          </View>
          <Text style={styles.shortcutLabel}>Riwayat</Text>
        </Pressable>

        <Pressable
          style={styles.shortcutItem}
          onPress={() => router.push("/explore")}
        >
          <View style={[styles.shortcutIconWrap, { backgroundColor: "#FCE7F3" }]}>
            <Ionicons name="book" size={20} color="#BE185D" />
          </View>
          <Text style={styles.shortcutLabel}>Edukasi</Text>
        </Pressable>
      </View>

      {/* 6. Low Stock Alert Banner (Jika ada stok <= 3) */}
      {lowStockMedicines.length > 0 && (
        <View style={styles.stockAlertBanner}>
          <Ionicons name="warning" size={20} color={colors.statusMissed} />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.stockAlertTitle}>Perlu Refill Stok Obat</Text>
            <Text style={styles.stockAlertDesc}>
              {lowStockMedicines.map((m) => m.name).join(", ")} tersisa ≤ 3 dosis.
            </Text>
          </View>
        </View>
      )}

      {/* 7. Section Title & Filter Chips */}
      <View style={styles.sectionHeaderRow}>
        <View>
          <Text style={[styles.sectionTitle, isSeniorMode && { fontSize: 20 }]}>
            Jadwal Obat Harian
          </Text>
          <Text style={styles.sectionSubTitle}>Ketuk card untuk mengubah status</Text>
        </View>
        <Pressable
          style={styles.addMedBtn}
          onPress={() => router.push("/add-medication")}
        >
          <Ionicons name="add" size={18} color="#FFF" />
          <Text style={styles.addMedBtnText}>+ Tambah</Text>
        </Pressable>
      </View>

      {/* Filter Tabs (Semua / Belum / Selesai) */}
      <View style={styles.filterRow}>
        <Pressable
          style={[styles.filterChip, filterStatus === "all" && styles.filterChipActive]}
          onPress={() => setFilterStatus("all")}
        >
          <Text style={[styles.filterChipText, filterStatus === "all" && styles.filterChipTextActive]}>
            Semua ({medicines.length})
          </Text>
        </Pressable>
        <Pressable
          style={[styles.filterChip, filterStatus === "pending" && styles.filterChipActive]}
          onPress={() => setFilterStatus("pending")}
        >
          <Text style={[styles.filterChipText, filterStatus === "pending" && styles.filterChipTextActive]}>
            Belum Selesai ({totalCount - takenCount})
          </Text>
        </Pressable>
        <Pressable
          style={[styles.filterChip, filterStatus === "taken" && styles.filterChipActive]}
          onPress={() => setFilterStatus("taken")}
        >
          <Text style={[styles.filterChipText, filterStatus === "taken" && styles.filterChipTextActive]}>
            Sudah Diminum ({takenCount})
          </Text>
        </Pressable>
      </View>
    </View>
  );

  return (
    <View style={styles.screen}>
      <View style={[styles.content, { paddingTop: insets.top + 8 }]}>
        <FlatList
          data={filteredMedicines}
          keyExtractor={(item) => item.id}
          renderItem={renderMedicineCard}
          ListHeaderComponent={headerComponent}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: insets.bottom + 80 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="checkmark-done-circle" size={48} color={colors.primary} />
              <Text style={styles.emptyTitle}>Tidak ada jadwal obat</Text>
              <Text style={styles.emptyDesc}>Semua obat untuk kategori ini telah selesai atau belum ditambahkan.</Text>
            </View>
          }
        />
      </View>
      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  avatarWrap: {
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
  avatarLetter: {
    fontSize: 20,
    fontWeight: "900",
    color: colors.primaryDark,
  },
  greetingText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: "600",
  },
  userNameText: {
    fontSize: 18,
    fontWeight: "900",
    color: colors.textPrimary,
  },
  conditionBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  conditionText: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: "700",
  },
  headerActionBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.cardBackground,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.subtle,
  },
  seniorToggleCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.cardBackground,
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 14,
    ...shadows.subtle,
  },
  seniorIconBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: colors.primaryLightest,
    alignItems: "center",
    justifyContent: "center",
  },
  seniorToggleTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  seniorToggleDesc: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 1,
  },
  heroCard: {
    backgroundColor: colors.primary,
    borderRadius: 22,
    padding: 20,
    marginBottom: 14,
    ...shadows.glow,
  },
  heroTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginBottom: 8,
  },
  heroTagText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#FFF",
    letterSpacing: 0.8,
  },
  heroMedName: {
    fontSize: 22,
    fontWeight: "900",
    color: "#FFF",
  },
  heroMedSub: {
    fontSize: 13,
    color: colors.primaryLight,
    marginTop: 4,
    fontWeight: "600",
    lineHeight: 18,
  },
  heroArrowBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
    ...shadows.subtle,
  },
  adherenceCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 14,
    ...shadows.subtle,
  },
  adherenceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  adherenceTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  adherenceScoreBadge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  adherenceScoreText: {
    fontSize: 13,
    fontWeight: "800",
    color: colors.primaryDark,
  },
  adherenceSubText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
    fontWeight: "500",
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
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  shortcutsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
    gap: 8,
  },
  shortcutItem: {
    flex: 1,
    alignItems: "center",
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.subtle,
  },
  shortcutIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  shortcutLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  stockAlertBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.statusMissedBg,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.statusMissedBorder,
    marginBottom: 14,
  },
  stockAlertTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: colors.statusMissed,
  },
  stockAlertDesc: {
    fontSize: 11,
    color: "#7F1D1D",
    marginTop: 2,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: colors.textPrimary,
  },
  sectionSubTitle: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 1,
  },
  addMedBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 4,
    ...shadows.glow,
  },
  addMedBtnText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "800",
  },
  filterRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  filterChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: colors.cardBackground,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterChipText: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.textSecondary,
  },
  filterChipTextActive: {
    color: "#FFF",
  },
  medicineCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 10,
    ...shadows.subtle,
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
    color: colors.textPrimary,
  },
  cardMedDosage: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
    fontWeight: "600",
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  cardTime: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.primary,
  },
  stockBadge: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 3,
    fontWeight: "600",
  },
  cardFooterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#F8FAFC",
  },
  statusChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 4,
  },
  statusChipText: {
    fontSize: 11,
    fontWeight: "800",
  },
  tapTipText: {
    fontSize: 11,
    color: colors.textMuted,
    fontStyle: "italic",
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
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
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
    paddingHorizontal: 20,
  },
});
