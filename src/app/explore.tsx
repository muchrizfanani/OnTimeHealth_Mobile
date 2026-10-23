import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Alert,
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

interface HealthArticle {
  id: string;
  category: "Panduan" | "Interaksi" | "Tips";
  title: string;
  summary: string;
  content: string;
  readTime: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const ARTICLES: HealthArticle[] = [
  {
    id: "art-1",
    category: "Panduan",
    title: "Aturan Minum Obat: Sebelum vs Sesudah Makan",
    summary: "Mengapa ada obat yang wajib diminum saat perut kosong dan ada yang bersama makanan?",
    content:
      "Obat 'sebelum makan' biasanya diserap lebih baik saat lambung kosong (minimal 1 jam sebelum atau 2 jam sesudah makan), contohnya obat lambung dan antibiotik tertentu. Sebaliknya, obat 'sesudah makan' (seperti anti-nyeri atau Metformin) diminum untuk mencegah iritasi dinding lambung atau mual.",
    readTime: "3 mnt baca",
    icon: "restaurant-outline",
  },
  {
    id: "art-2",
    category: "Interaksi",
    title: "Obat yang Tidak Boleh Diminum Bersama Susu",
    summary: "Kalsium dalam susu dapat mengikat zat aktif obat dan menurunkan efektivitasnya.",
    content:
      "Kandungan kalsium pada susu, yoghurt, atau antasida dapat mengikat beberapa jenis antibiotik (seperti Ciprofloxacin atau Doksisiklin) dan suplemen zat besi, membentuk senyawa yang tidak bisa diserap tubuh. Berikan jeda minimal 2 jam antara minum susu dan obat-obatan tersebut.",
    readTime: "4 mnt baca",
    icon: "warning-outline",
  },
  {
    id: "art-3",
    category: "Panduan",
    title: "Pentingnya Menghabiskan Antibiotik Sampai Tuntas",
    summary: "Mengapa Anda dilarang berhenti minum antibiotik meski tubuh sudah terasa sehat?",
    content:
      "Menghentikan antibiotik sebelum habis memberikan kesempatan bagi sisa bakteri yang masih hidup untuk bermutasi dan kebal (resistensi antibiotik). Akibatnya, saat infeksi kambuh di masa mendatang, antibiotik yang sama tidak akan mempan lagi.",
    readTime: "3 mnt baca",
    icon: "shield-checkmark-outline",
  },
  {
    id: "art-4",
    category: "Tips",
    title: "Cara Benar Menyimpan Obat di Rumah",
    summary: "Hindari menyimpan obat di tempat lembap atau terkena sinar matahari langsung.",
    content:
      "Simpan obat pada suhu ruang yang sejuk (di bawah 25-30°C) dan kering. Hindari menyimpan obat di kamar mandi karena udara lembap dapat merusak stabilitas kimia obat. Beberapa sirup antibiotik atau insulin membutuhkan penyimpanan khusus di kulkas (bukan freezer).",
    readTime: "2 mnt baca",
    icon: "home-outline",
  },
];

export default function ExploreScreen() {
  const insets = useSafeAreaInsets();
  const { isSeniorMode } = useApp();

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");
  const [expandedId, setExpandedId] = useState<string | null>("art-1");

  const categories = ["Semua", "Panduan", "Interaksi", "Tips"];

  const filteredArticles = ARTICLES.filter((art) => {
    const matchCat = selectedCategory === "Semua" || art.category === selectedCategory;
    const matchSearch =
      art.title.toLowerCase().includes(search.toLowerCase()) ||
      art.summary.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.content,
          {
            paddingTop: insets.top + 10,
            paddingBottom: insets.bottom + 80,
          },
        ]}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerBadge}>
              <Ionicons name="book" size={13} color={colors.primary} />
              <Text style={styles.headerBadgeText}>EDUKASI MEDIS</Text>
            </View>
            <Text style={[styles.title, isSeniorMode && { fontSize: 26 }]}>
              Pusat Edukasi Obat
            </Text>
            <Text style={styles.subtitle}>
              Informasi terpercaya untuk membantu Anda dan keluarga mengonsumsi obat dengan aman & tepat.
            </Text>
          </View>

          {/* Search Box */}
          <View style={styles.searchBar}>
            <Ionicons name="search" size={18} color={colors.textMuted} />
            <TextInput
              style={styles.searchInput}
              placeholder="Cari artikel / tips minum obat..."
              placeholderTextColor={colors.textMuted}
              value={search}
              onChangeText={setSearch}
            />
            {search.length > 0 && (
              <Pressable onPress={() => setSearch("")}>
                <Ionicons name="close-circle" size={18} color={colors.textMuted} />
              </Pressable>
            )}
          </View>

          {/* Kategori Filter Chips */}
          <View style={styles.chipRow}>
            {categories.map((cat) => (
              <Pressable
                key={cat}
                style={[
                  styles.categoryChip,
                  selectedCategory === cat && styles.categoryChipActive,
                ]}
                onPress={() => setSelectedCategory(cat)}
              >
                <Text
                  style={[
                    styles.categoryChipText,
                    selectedCategory === cat && styles.categoryChipTextActive,
                  ]}
                >
                  {cat}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Daftar Artikel Edukasi */}
          <View style={{ gap: 12, marginTop: 14 }}>
            {filteredArticles.map((item) => {
              const isExpanded = expandedId === item.id;
              return (
                <Pressable
                  key={item.id}
                  style={[styles.articleCard, isExpanded && styles.articleCardActive]}
                  onPress={() => setExpandedId(isExpanded ? null : item.id)}
                >
                  <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
                    <View style={styles.articleIconWrap}>
                      <Ionicons name={item.icon} size={22} color={colors.primary} />
                    </View>
                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        <Text style={styles.articleCategory}>{item.category.toUpperCase()}</Text>
                        <Text style={styles.articleTime}>{item.readTime}</Text>
                      </View>
                      <Text style={[styles.articleTitle, isSeniorMode && { fontSize: 18 }]}>
                        {item.title}
                      </Text>
                      <Text style={styles.articleSummary}>{item.summary}</Text>
                    </View>
                  </View>

                  {/* Isi Lengkap (Accordion) */}
                  {isExpanded && (
                    <View style={styles.expandedContent}>
                      <Text style={[styles.articleFullText, isSeniorMode && { fontSize: 16, lineHeight: 24 }]}>
                        {item.content}
                      </Text>
                      <Pressable
                        style={styles.askDoctorBtn}
                        onPress={() =>
                          Alert.alert(
                            "Konsultasi Apoteker / Dokter",
                            "Layanan tanya apoteker menghubungkan Anda ke pusat informasi farmasi mitra OnTimeHealth."
                          )
                        }
                      >
                        <Ionicons name="chatbubbles-outline" size={16} color={colors.primary} />
                        <Text style={styles.askDoctorText}>Tanyakan ke Apoteker</Text>
                      </Pressable>
                    </View>
                  )}

                  <View style={{ alignItems: "center", marginTop: 8 }}>
                    <Ionicons
                      name={isExpanded ? "chevron-up" : "chevron-down"}
                      size={18}
                      color={colors.textMuted}
                    />
                  </View>
                </Pressable>
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
    marginBottom: 16,
  },
  headerBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.borderTeal,
  },
  headerBadgeText: {
    fontSize: 11,
    fontWeight: "800",
    color: colors.primaryDark,
  },
  title: {
    fontSize: 22,
    fontWeight: "900",
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
    lineHeight: 18,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.cardBackground,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 8,
    ...shadows.subtle,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: colors.textPrimary,
  },
  chipRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
  },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 12,
    backgroundColor: colors.cardBackground,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryChipText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.textSecondary,
  },
  categoryChipTextActive: {
    color: "#FFF",
  },
  articleCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.subtle,
  },
  articleCardActive: {
    borderColor: colors.borderTeal,
  },
  articleIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  articleCategory: {
    fontSize: 10,
    fontWeight: "800",
    color: colors.primary,
  },
  articleTime: {
    fontSize: 11,
    color: colors.textMuted,
  },
  articleTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.textPrimary,
    marginTop: 2,
  },
  articleSummary: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
    lineHeight: 16,
  },
  expandedContent: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  articleFullText: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  askDoctorBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.primaryLightest,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 12,
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: colors.borderTeal,
  },
  askDoctorText: {
    fontSize: 12,
    fontWeight: "800",
    color: colors.primaryDark,
  },
});
