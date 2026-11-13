import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useApp } from "../context/AppContext";
import { colors, shadows } from "../styles/theme";
import { Medicine, MedicineForm } from "../types/medicine";

export default function AddMedicationScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { addMedicine, isSeniorMode } = useApp();

  const [step, setStep] = useState<number>(1);

  // Form State (5 Langkah)
  const [name, setName] = useState("");
  const [form, setForm] = useState<MedicineForm>("Tablet");
  const [dosage, setDosage] = useState("1 Tablet (500 mg)");
  const [mealRule, setMealRule] = useState("Sesudah makan");
  const [time, setTime] = useState("08:00");
  const [frequency, setFrequency] = useState("2x sehari");
  const [duration, setDuration] = useState("Rutin / Jangka Panjang");
  const [stock, setStock] = useState("20");
  const [specialNote, setSpecialNote] = useState("");

  const handleNext = () => {
    if (step === 1 && !name.trim()) {
      Alert.alert("Perhatian", "Silakan masukkan nama obat terlebih dahulu.");
      return;
    }
    if (step < 5) {
      setStep(step + 1);
    } else {
      // Simpan Obat Baru
      const newMed: Medicine = {
        id: `med-${Date.now()}`,
        name: name.trim(),
        dosage: dosage.trim(),
        dose: dosage.trim(),
        form,
        time: time.trim() || "08:00",
        status: "pending",
        note: specialNote.trim() ? `${mealRule} • ${specialNote.trim()}` : mealRule,
        instruction: specialNote.trim() ? `${mealRule} • ${specialNote.trim()}` : mealRule,
        frequency,
        duration,
        stock: parseInt(stock, 10) || 10,
      };

      addMedicine(newMed);
      Alert.alert(
        "🎉 Jadwal Tersimpan",
        `Obat ${newMed.name} berhasil ditambahkan dan pengingat telah diaktifkan!`,
        [{ text: "OK", onPress: () => router.back() }]
      );
    }
  };

  const forms: { type: MedicineForm; icon: keyof typeof Ionicons.glyphMap; desc: string }[] = [
    { type: "Tablet", icon: "disc", desc: "Pil padat bulat/oval" },
    { type: "Kapsul", icon: "medical", desc: "Kapsul gelatin" },
    { type: "Sirup", icon: "water", desc: "Obat cair/larutan" },
    { type: "Injeksi", icon: "color-wand", desc: "Suntikan/Insulin" },
  ];

  const mealRules = ["Sebelum makan", "Sesudah makan", "Bersama makan"];
  const frequencies = ["1x sehari", "2x sehari", "3x sehari", "Bila perlu (PRN)"];

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <Pressable
          style={styles.backBtn}
          onPress={() => (step > 1 ? setStep(step - 1) : router.back())}
        >
          <Ionicons name="arrow-back" size={20} color={colors.textPrimary} />
        </Pressable>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={[styles.headerTitle, isSeniorMode && { fontSize: 20 }]}>
            Tambah Jadwal Obat
          </Text>
          <Text style={styles.headerSubtitle}>Langkah {step} dari 5</Text>
        </View>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="close-circle-outline" size={26} color={colors.textMuted} />
        </Pressable>
      </View>

      {/* Progress Bar Multi-Step */}
      <View style={styles.progressBarTrack}>
        <View style={[styles.progressBarFill, { width: `${(step / 5) * 100}%` }]} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* STEP 1: NAMA OBAT */}
        {step === 1 && (
          <View style={styles.stepCard}>
            <View style={styles.badgeStep}>
              <Ionicons name="medkit" size={24} color={colors.primary} />
            </View>
            <Text style={styles.stepTitle}>Apa nama obat yang diminum?</Text>
            <Text style={styles.stepDesc}>Ketik nama obat sesuai resep dokter atau kemasan.</Text>

            <TextInput
              style={[styles.input, isSeniorMode && styles.inputSenior]}
              placeholder="Contoh: Parasetamol, Amlodipine"
              placeholderTextColor={colors.textMuted}
              value={name}
              onChangeText={setName}
              autoFocus
            />

            <Text style={[styles.label, { marginTop: 18 }]}>Catatan Khusus (Opsional):</Text>
            <TextInput
              style={[styles.input, { minHeight: 70, textAlignVertical: "top" }]}
              placeholder="Contoh: Jangan diminum bersama susu, habiskan antibiotik"
              placeholderTextColor={colors.textMuted}
              value={specialNote}
              onChangeText={setSpecialNote}
              multiline
            />
          </View>
        )}

        {/* STEP 2: BENTUK OBAT */}
        {step === 2 && (
          <View style={styles.stepCard}>
            <View style={styles.badgeStep}>
              <Ionicons name="shapes" size={24} color={colors.primary} />
            </View>
            <Text style={styles.stepTitle}>Pilih bentuk sediaan obat</Text>
            <Text style={styles.stepDesc}>Bentuk obat membantu visualisasi pengingat yang jelas.</Text>

            <View style={{ gap: 10, marginTop: 10 }}>
              {forms.map((item) => (
                <Pressable
                  key={item.type}
                  style={[
                    styles.optionCard,
                    form === item.type && styles.optionCardActive,
                  ]}
                  onPress={() => setForm(item.type)}
                >
                  <View
                    style={[
                      styles.iconWrap,
                      form === item.type && { backgroundColor: colors.primary },
                    ]}
                  >
                    <Ionicons
                      name={item.icon}
                      size={22}
                      color={form === item.type ? "#FFF" : colors.primary}
                    />
                  </View>
                  <View style={{ flex: 1, marginLeft: 14 }}>
                    <Text
                      style={[
                        styles.optionTitle,
                        form === item.type && { color: colors.primaryDark },
                        isSeniorMode && { fontSize: 18 },
                      ]}
                    >
                      {item.type}
                    </Text>
                    <Text style={styles.optionDesc}>{item.desc}</Text>
                  </View>
                  {form === item.type && (
                    <Ionicons name="checkmark-circle" size={22} color={colors.primary} />
                  )}
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {/* STEP 3: DOSIS & ATURAN PAKAI */}
        {step === 3 && (
          <View style={styles.stepCard}>
            <View style={styles.badgeStep}>
              <Ionicons name="nutrition" size={24} color={colors.primary} />
            </View>
            <Text style={styles.stepTitle}>Berapa dosis & aturan pakainya?</Text>
            <Text style={styles.stepDesc}>Tentukan takaran yang harus diminum setiap jadwal.</Text>

            <Text style={styles.label}>Dosis per Konsumsi:</Text>
            <TextInput
              style={[styles.input, isSeniorMode && styles.inputSenior]}
              placeholder="Contoh: 1 Tablet (500 mg) / 10 ml"
              placeholderTextColor={colors.textMuted}
              value={dosage}
              onChangeText={setDosage}
            />

            <Text style={[styles.label, { marginTop: 18 }]}>Aturan Minum Terhadap Makanan:</Text>
            <View style={{ flexDirection: "row", gap: 8, marginTop: 8 }}>
              {mealRules.map((rule) => (
                <Pressable
                  key={rule}
                  style={[
                    styles.chip,
                    mealRule === rule && styles.chipActive,
                  ]}
                  onPress={() => setMealRule(rule)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      mealRule === rule && styles.chipTextActive,
                    ]}
                  >
                    {rule}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {/* STEP 4: FREKUENSI & JAM ALARM */}
        {step === 4 && (
          <View style={styles.stepCard}>
            <View style={styles.badgeStep}>
              <Ionicons name="alarm" size={24} color={colors.primary} />
            </View>
            <Text style={styles.stepTitle}>Kapan obat harus diminum?</Text>
            <Text style={styles.stepDesc}>Atur jam dan frekuensi alarm berbunyi secara berkala.</Text>

            <Text style={styles.label}>Frekuensi Minum:</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
              {frequencies.map((freq) => (
                <Pressable
                  key={freq}
                  style={[
                    styles.chip,
                    frequency === freq && styles.chipActive,
                  ]}
                  onPress={() => setFrequency(freq)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      frequency === freq && styles.chipTextActive,
                    ]}
                  >
                    {freq}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Text style={[styles.label, { marginTop: 18 }]}>Waktu Alarm (Jam : Menit WIB):</Text>
            <TextInput
              style={[
                styles.input,
                { fontSize: 24, textAlign: "center", fontWeight: "900", color: colors.primaryDark },
              ]}
              placeholder="08:00"
              placeholderTextColor={colors.textMuted}
              value={time}
              onChangeText={setTime}
            />
          </View>
        )}

        {/* STEP 5: DURASI & STOK */}
        {step === 5 && (
          <View style={styles.stepCard}>
            <View style={styles.badgeStep}>
              <Ionicons name="cube" size={24} color={colors.primary} />
            </View>
            <Text style={styles.stepTitle}>Durasi & Stok Obat</Text>
            <Text style={styles.stepDesc}>Sistem akan memberi tahu secara pintar bila stok tersisa sedikit.</Text>

            <Text style={styles.label}>Durasi Pengobatan:</Text>
            <TextInput
              style={styles.input}
              placeholder="Contoh: 7 hari / 30 hari / Rutin"
              placeholderTextColor={colors.textMuted}
              value={duration}
              onChangeText={setDuration}
            />

            <Text style={[styles.label, { marginTop: 18 }]}>Jumlah Stok Fisik Tersedia:</Text>
            <TextInput
              style={styles.input}
              placeholder="Contoh: 20"
              placeholderTextColor={colors.textMuted}
              keyboardType="numeric"
              value={stock}
              onChangeText={setStock}
            />

            <View style={styles.stockNoticeBox}>
              <Ionicons name="notifications" size={20} color={colors.primary} />
              <Text style={styles.stockNoticeText}>
                Smart Reminder akan otomatis memperingatkan Anda saat stok obat tersisa ≤ 3 dosis agar tidak terlambat membeli isi ulang.
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Footer Navigasi */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 14 }]}>
        <Pressable style={styles.submitBtn} onPress={handleNext}>
          <Text style={[styles.submitBtnText, isSeniorMode && { fontSize: 18 }]}>
            {step === 5 ? "Simpan & Aktifkan Alarm" : "Lanjutkan"}
          </Text>
          <Ionicons
            name={step === 5 ? "checkmark-circle" : "arrow-forward"}
            size={20}
            color="#FFF"
          />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 12,
    backgroundColor: colors.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "900",
    color: colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
    fontWeight: "600",
  },
  progressBarTrack: {
    height: 4,
    backgroundColor: "#E2E8F0",
  },
  progressBarFill: {
    height: 4,
    backgroundColor: colors.primary,
  },
  content: {
    padding: 20,
  },
  stepCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 24,
    padding: 22,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card,
  },
  badgeStep: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.borderTeal,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: colors.textPrimary,
  },
  stepDesc: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
    marginBottom: 18,
  },
  label: {
    fontSize: 13,
    fontWeight: "800",
    color: colors.textPrimary,
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  inputSenior: {
    fontSize: 18,
    paddingVertical: 18,
    borderWidth: 2,
    borderColor: colors.primaryDark,
  },
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 18,
    padding: 16,
  },
  optionCardActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLightest,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  optionDesc: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  chip: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.textSecondary,
  },
  chipTextActive: {
    color: "#FFF",
  },
  stockNoticeBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primaryLightest,
    borderRadius: 16,
    padding: 14,
    marginTop: 20,
    borderWidth: 1,
    borderColor: colors.borderTeal,
    gap: 10,
  },
  stockNoticeText: {
    flex: 1,
    fontSize: 12,
    color: colors.primaryDark,
    fontWeight: "600",
    lineHeight: 18,
  },
  footer: {
    backgroundColor: colors.cardBackground,
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  submitBtn: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    ...shadows.glow,
  },
  submitBtnText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "900",
  },
});
