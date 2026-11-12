import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
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
import {
  fetchHealthEducationArticles,
  verifyBPOMRegistration,
} from "../services/healthApiService";
import { colors, shadows } from "../styles/theme";
import { BPOMVerificationResult, HealthArticle } from "../types/api";

export default function ExploreScreen() {
  const insets = useSafeAreaInsets();
  const { isSeniorMode } = useApp();

  // State untuk API data
  const [articles, setArticles] = useState<HealthArticle[]>([]);
  const [isLoadingArticles, setIsLoadingArticles] = useState<boolean>(true);
  const [apiSourceInfo, setApiSourceInfo] = useState<string>("Memuat dari External API...");

  // State untuk filter & pencarian
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // State untuk Fitur BPOM (.then, .resolve, .reject)
  const [bpomInput, setBpomInput] = useState("BPOM-TR213567891");
  const [isVerifyingBpom, setIsVerifyingBpom] = useState(false);
  const [bpomResult, setBpomResult] = useState<BPOMVerificationResult | null>(null);
  const [bpomError, setBpomError] = useState<string | null>(null);

  const categories = ["Semua", "Panduan", "Interaksi", "Tips", "Info Medis"];

  // ===============================================================
  // RUBRIK MODUL 3: Custom & Pre-built Async Function (fetch())
  // Memanggil service asynchronous untuk mengambil data External API
  // ===============================================================
  const loadArticlesFromApi = async () => {
    setIsLoadingArticles(true);
    try {
      const response = await fetchHealthEducationArticles();
      setArticles(response.data);
      setApiSourceInfo(
        `${response.source === "external_api" ? "🌐 REST API Eksternal (dummyjson.com)" : "💾 Cache Lokal Offline"} • ${response.timestamp}`
      );
      if (response.data.length > 0) {
        setExpandedId(response.data[0].id);
      }
    } catch (err) {
      console.error("[ExploreScreen] Gagal memuat data API:", err);
    } finally {
      setIsLoadingArticles(false);
    }
  };

  useEffect(() => {
    loadArticlesFromApi();
  }, []);

  // ===============================================================
  // RUBRIK MODUL 3: Penggunaan fungsi .then() pada Promise
  // Menangani Promise dengan .then() dan .catch()
  // ===============================================================
  const handleVerifyBPOM = () => {
    if (!bpomInput.trim()) {
      Alert.alert("Perhatian", "Silakan masukkan nomor registrasi BPOM terlebih dahulu.");
      return;
    }

    setIsVerifyingBpom(true);
    setBpomResult(null);
    setBpomError(null);

    // Memanggil Custom Promise yang menggunakan resolve() dan reject()
    verifyBPOMRegistration(bpomInput)
      .then((result: BPOMVerificationResult) => {
        // Blok .then() berjalan bila Promise memanggil resolve()
        setBpomResult(result);
        Alert.alert(
          "✅ BPOM Terverifikasi Resmi (.resolve)",
          `Nomor ${result.drugCode} valid dan terdaftar:\n${result.tradeName}\nProdusen: ${result.distributor}`
        );
      })
      .catch((error: Error) => {
        // Blok .catch() berjalan bila Promise memanggil reject()
        setBpomError(error.message);
        Alert.alert("❌ Verifikasi Ditolak (.reject)", error.message);
      })
      .finally(() => {
        setIsVerifyingBpom(false);
      });
  };

  const filteredArticles = articles.filter((art) => {
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
              <Ionicons name="cloud-download" size={13} color={colors.primary} />
              <Text style={styles.headerBadgeText}>EDUKASI MEDIS & API CALL</Text>
            </View>
            <Text style={[styles.title, isSeniorMode && { fontSize: 26 }]}>
              Pusat Edukasi Obat
            </Text>
            <Text style={styles.subtitle}>
              Informasi medis yang diambil secara asynchronous dari API cloud eksternal.
            </Text>
          </View>

          {/* Status Sinkronisasi API */}
          <View style={styles.apiStatusBar}>
            <View style={styles.apiPulseDot} />
            <Text style={styles.apiStatusText}>{apiSourceInfo}</Text>
            <Pressable
              style={styles.apiRefreshBtn}
              onPress={loadArticlesFromApi}
              disabled={isLoadingArticles}
            >
              <Ionicons
                name={isLoadingArticles ? "hourglass-outline" : "refresh"}
                size={14}
                color={colors.primary}
              />
              <Text style={styles.apiRefreshText}>
                {isLoadingArticles ? "Memuat..." : "Refresh"}
              </Text>
            </Pressable>
          </View>

          {/* =============================================================== */}
          {/* WIDGET 1: CEK BPOM (Demonstrasi .resolve, .reject, .then)         */}
          {/* =============================================================== */}
          <View style={styles.bpomCard}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <View style={styles.bpomIconBox}>
                <Ionicons name="shield-checkmark" size={20} color="#FFF" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.bpomTitle}>Verifikasi BPOM Asynchronous</Text>
                <Text style={styles.bpomSubtitle}>
                  Uji Promise: .resolve(), .reject(), dan .then()
                </Text>
              </View>
            </View>

            <View style={styles.bpomInputRow}>
              <TextInput
                style={styles.bpomInput}
                placeholder="Contoh: BPOM-TR123456 / DKL-99"
                placeholderTextColor={colors.textMuted}
                value={bpomInput}
                onChangeText={setBpomInput}
                autoCapitalize="characters"
              />
              <Pressable
                style={[styles.bpomVerifyBtn, isVerifyingBpom && { opacity: 0.7 }]}
                onPress={handleVerifyBPOM}
                disabled={isVerifyingBpom}
              >
                {isVerifyingBpom ? (
                  <ActivityIndicator size="small" color="#FFF" />
                ) : (
                  <>
                    <Ionicons name="search" size={16} color="#FFF" />
                    <Text style={styles.bpomVerifyBtnText}>Cek</Text>
                  </>
                )}
              </Pressable>
            </View>

            {/* Quick Test Chips untuk Asisten Praktikum */}
            <View style={styles.quickChipRow}>
              <Text style={styles.quickChipLabel}>Tes Cepat:</Text>
              <Pressable
                style={styles.quickChip}
                onPress={() => setBpomInput("BPOM-TR213567891")}
              >
                <Text style={styles.quickChipText}>Kode Valid (.resolve)</Text>
              </Pressable>
              <Pressable
                style={[styles.quickChip, { borderColor: colors.statusMissedBorder }]}
                onPress={() => setBpomInput("INVALID-999-X")}
              >
                <Text style={[styles.quickChipText, { color: colors.statusMissed }]}>
                  Kode Salah (.reject)
                </Text>
              </Pressable>
            </View>

            {/* Hasil Verifikasi Sukses (.resolve) */}
            {bpomResult && (
              <View style={styles.bpomSuccessBox}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                  <Ionicons name="checkmark-circle" size={18} color={colors.primary} />
                  <Text style={styles.bpomSuccessTitle}>Resmi Terdaftar di BPOM RI</Text>
                </View>
                <Text style={styles.bpomResultText}>
                  Kode: <Text style={{ fontWeight: "800" }}>{bpomResult.drugCode}</Text>
                </Text>
                <Text style={styles.bpomResultText}>
                  Distributor: {bpomResult.distributor}
                </Text>
                <Text style={styles.bpomResultTime}>
                  Diverifikasi via Promise.resolve() pada: {bpomResult.verifiedAt}
                </Text>
              </View>
            )}

            {/* Hasil Verifikasi Gagal (.reject) */}
            {bpomError && (
              <View style={styles.bpomErrorBox}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                  <Ionicons name="close-circle" size={18} color={colors.statusMissed} />
                  <Text style={styles.bpomErrorTitle}>Ditolak oleh Promise (.reject)</Text>
                </View>
                <Text style={styles.bpomErrorText}>{bpomError}</Text>
              </View>
            )}
          </View>

          {/* Search Box Artikel */}
          <View style={styles.searchBar}>
            <Ionicons name="search" size={18} color={colors.textMuted} />
            <TextInput
              style={styles.searchInput}
              placeholder="Cari artikel / tips medis dari API..."
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

          {/* Loader saat API Call berlangsung */}
          {isLoadingArticles && (
            <View style={styles.loadingBox}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={styles.loadingText}>
                Mengambil data dari External REST API...
              </Text>
              <Text style={styles.loadingSub}>
                Menerapkan asynchronous fetch() & TypeScript Interface
              </Text>
            </View>
          )}

          {/* Daftar Artikel Edukasi dari API */}
          {!isLoadingArticles && (
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
                        <Ionicons
                          name={
                            item.category === "Panduan"
                              ? "restaurant-outline"
                              : item.category === "Interaksi"
                              ? "warning-outline"
                              : item.category === "Tips"
                              ? "shield-checkmark-outline"
                              : "fitness-outline"
                          }
                          size={22}
                          color={colors.primary}
                        />
                      </View>
                      <View style={{ flex: 1, marginLeft: 12 }}>
                        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                          <View style={styles.catBadge}>
                            <Text style={styles.articleCategory}>{item.category.toUpperCase()}</Text>
                          </View>
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
                        <View style={styles.articleSourceBadge}>
                          <Ionicons name="server-outline" size={12} color={colors.primaryDark} />
                          <Text style={styles.articleSourceText}>Sumber: {item.source}</Text>
                        </View>
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

              {filteredArticles.length === 0 && (
                <View style={styles.emptyBox}>
                  <Ionicons name="search-outline" size={36} color={colors.textMuted} />
                  <Text style={styles.emptyTitle}>Artikel Tidak Ditemukan</Text>
                  <Text style={styles.emptyDesc}>Coba gunakan kata kunci pencarian yang lain.</Text>
                </View>
              )}
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
  header: {
    marginBottom: 12,
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
  apiStatusBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primaryLightest,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.borderTeal,
  },
  apiPulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginRight: 8,
  },
  apiStatusText: {
    flex: 1,
    fontSize: 11,
    fontWeight: "700",
    color: colors.primaryDark,
  },
  apiRefreshBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#FFF",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.borderTeal,
  },
  apiRefreshText: {
    fontSize: 11,
    fontWeight: "800",
    color: colors.primary,
  },
  bpomCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 14,
    ...shadows.subtle,
  },
  bpomIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  bpomTitle: {
    fontSize: 14,
    fontWeight: "900",
    color: colors.textPrimary,
  },
  bpomSubtitle: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 1,
  },
  bpomInputRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
  },
  bpomInput: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  bpomVerifyBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingHorizontal: 16,
    gap: 6,
  },
  bpomVerifyBtnText: {
    color: "#FFF",
    fontSize: 13,
    fontWeight: "800",
  },
  quickChipRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 10,
  },
  quickChipLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.textMuted,
  },
  quickChip: {
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  quickChipText: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.textSecondary,
  },
  bpomSuccessBox: {
    backgroundColor: colors.primaryLightest,
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: colors.borderTeal,
  },
  bpomSuccessTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: colors.primaryDark,
  },
  bpomResultText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  bpomResultTime: {
    fontSize: 10,
    color: colors.primary,
    fontWeight: "700",
    marginTop: 4,
  },
  bpomErrorBox: {
    backgroundColor: colors.statusMissedBg,
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: colors.statusMissedBorder,
  },
  bpomErrorTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: colors.statusMissed,
  },
  bpomErrorText: {
    fontSize: 12,
    color: "#7F1D1D",
    marginTop: 2,
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
    flexWrap: "wrap",
    gap: 8,
    marginTop: 12,
  },
  categoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
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
    fontSize: 11,
    fontWeight: "700",
    color: colors.textSecondary,
  },
  categoryChipTextActive: {
    color: "#FFF",
  },
  loadingBox: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.cardBackground,
    borderRadius: 18,
    padding: 28,
    marginTop: 14,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 8,
  },
  loadingText: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.textPrimary,
    marginTop: 4,
  },
  loadingSub: {
    fontSize: 11,
    color: colors.textMuted,
    textAlign: "center",
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
  catBadge: {
    backgroundColor: colors.primaryLightest,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  articleCategory: {
    fontSize: 9,
    fontWeight: "800",
    color: colors.primaryDark,
  },
  articleTime: {
    fontSize: 11,
    color: colors.textMuted,
  },
  articleTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.textPrimary,
    marginTop: 4,
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
  articleSourceBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 8,
    alignSelf: "flex-start",
    backgroundColor: colors.primaryLightest,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  articleSourceText: {
    fontSize: 10,
    color: colors.primaryDark,
    fontWeight: "700",
  },
  askDoctorBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.primaryLightest,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 10,
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: colors.borderTeal,
  },
  askDoctorText: {
    fontSize: 12,
    fontWeight: "800",
    color: colors.primaryDark,
  },
  emptyBox: {
    alignItems: "center",
    padding: 30,
    gap: 6,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  emptyDesc: {
    fontSize: 12,
    color: colors.textMuted,
  },
});
