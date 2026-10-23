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
              <Ionicons name="book" size={14} color="#0D9488" />
              <Text style={styles.headerBadgeText}>EDUKASI MEDIS</Text>
            </View>
            <Text style={[styles.title, isSeniorMode && { fontSize: 26 }]}>
              Pusat Edukasi & Penggunaan Obat Aman
            </Text>
            <Text style={styles.subtitle}>
              Informasi terpercaya untuk membantu Anda dan keluarga mengonsumsi obat dengan tepat.
            </Text>
          </View>

          {/* Search Box */}
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color="#94A3B8" />
            <TextInput
              style={styles.searchInput}
              placeholder="Cari artikel / tips obat..."
              placeholderTextColor="#94A3B8"
              value={search}
              onChangeText={setSearch}
            />
            {search.length > 0 && (
              <Pressable onPress={() => setSearch("")}>
                <Ionicons name="close-circle" size={18} color="#94A3B8" />
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
          <View style={{ gap: 14, marginTop: 14 }}>
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
                      <Ionicons name={item.icon} size={22} color="#0D9488" />
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

                  {/* Isi Lengkap yang Bisa Dibuka/Tutup (Accordion) */}
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
                            "Fitur konsultasi langsung seputar obat ini akan menghubungkan Anda ke pusat layanan kesehatan mitra."
                          )
                        }
                      >
                        <Ionicons name="chatbubbles-outline" size={16} color="#0D9488" />
                        <Text style={styles.askDoctorText}>Tanyakan ke Apoteker</Text>
                      </Pressable>
                    </View>
                  )}

                  <View style={{ alignItems: "center", marginTop: 8 }}>
                    <Ionicons
                      name={isExpanded ? "chevron-up" : "chevron-down"}
                      size={18}
                      color="#94A3B8"
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
    backgroundColor: "#F8FAFC",
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
    backgroundColor: "#CCFBF1",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginBottom: 8,
  },
  headerBadgeText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#0F766E",
  },
  title: {
    fontSize: 22,
    fontWeight: "900",
    color: "#0F172A",
  },
  subtitle: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 4,
    lineHeight: 18,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#0F172A",
  },
  chipRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 14,
  },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 12,
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  categoryChipActive: {
    backgroundColor: "#0D9488",
    borderColor: "#0D9488",
  },
  categoryChipText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#64748B",
  },
  categoryChipTextActive: {
    color: "#FFF",
  },
  articleCard: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  articleCardActive: {
    borderColor: "#0D9488",
  },
  articleIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#CCFBF1",
    alignItems: "center",
    justifyContent: "center",
  },
  articleCategory: {
    fontSize: 10,
    fontWeight: "800",
    color: "#0D9488",
  },
  articleTime: {
    fontSize: 11,
    color: "#94A3B8",
  },
  articleTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#0F172A",
    marginTop: 2,
  },
  articleSummary: {
    fontSize: 12,
    color: "#64748B",
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
    color: "#334155",
    lineHeight: 20,
  },
  askDoctorBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#F0FDFA",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 12,
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "#99F6E4",
  },
  askDoctorText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#0F766E",
  },
});
