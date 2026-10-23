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
import { Medicine, MedicineForm } from "../types/medicine";

export default function AddMedicationScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { addMedicine, isSeniorMode } = useApp();

  const [step, setStep] = useState<number>(1);

  // Form State (5 Langkah sesuai PRD)
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
      // Simpan Obat
      const newMed: Medicine = {
        id: `med-${Date.now()}`,
        name: name.trim(),
        dosage: dosage.trim(),
        form,
        time: time.trim() || "08:00",
        status: "pending",
        note: specialNote.trim() ? `${mealRule} • ${specialNote.trim()}` : mealRule,
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
      style={{ flex: 1, backgroundColor: "#F8FAFC" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <Pressable
          style={styles.backBtn}
          onPress={() => (step > 1 ? setStep(step - 1) : router.back())}
        >
          <Ionicons name="arrow-back" size={22} color="#0F172A" />
        </Pressable>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={[styles.headerTitle, isSeniorMode && { fontSize: 20 }]}>
            Tambah Jadwal Obat
          </Text>
          <Text style={styles.headerSubtitle}>Langkah {step} dari 5</Text>
        </View>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="close-circle-outline" size={26} color="#64748B" />
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
              <Ionicons name="medkit-outline" size={24} color="#0D9488" />
            </View>
            <Text style={styles.stepTitle}>Apa nama obat yang diminum?</Text>
            <Text style={styles.stepDesc}>Ketik nama obat sesuai resep dokter atau kemasan.</Text>

            <TextInput
              style={[styles.input, isSeniorMode && styles.inputSenior]}
              placeholder="Contoh: Parasetamol, Amlodipine"
              placeholderTextColor="#94A3B8"
              value={name}
              onChangeText={setName}
              autoFocus
            />

            <Text style={[styles.label, { marginTop: 18 }]}>Catatan Khusus (Opsional):</Text>
            <TextInput
              style={[styles.input, { minHeight: 60 }]}
              placeholder="Contoh: Jangan diminum dengan susu, habiskan obat"
              placeholderTextColor="#94A3B8"
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
              <Ionicons name="shapes-outline" size={24} color="#0D9488" />
            </View>
            <Text style={styles.stepTitle}>Pilih bentuk obat</Text>
            <Text style={styles.stepDesc}>Bentuk obat membantu visualisasi pengingat Anda.</Text>

            <View style={{ gap: 10, marginTop: 14 }}>
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
                      form === item.type && { backgroundColor: "#0D9488" },
                    ]}
                  >
                    <Ionicons
                      name={item.icon}
                      size={22}
                      color={form === item.type ? "#FFF" : "#0D9488"}
                    />
                  </View>
                  <View style={{ flex: 1, marginLeft: 14 }}>
                    <Text
                      style={[
                        styles.optionTitle,
                        form === item.type && { color: "#0F766E" },
                        isSeniorMode && { fontSize: 18 },
                      ]}
                    >
                      {item.type}
                    </Text>
                    <Text style={styles.optionDesc}>{item.desc}</Text>
                  </View>
                  {form === item.type && (
                    <Ionicons name="checkmark-circle" size={22} color="#0D9488" />
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
              <Ionicons name="nutrition-outline" size={24} color="#0D9488" />
            </View>
            <Text style={styles.stepTitle}>Berapa dosis & aturan pakainya?</Text>
            <Text style={styles.stepDesc}>Tentukan jumlah yang harus diminum setiap jadwal.</Text>

            <Text style={styles.label}>Dosis per Konsumsi:</Text>
            <TextInput
              style={[styles.input, isSeniorMode && styles.inputSenior]}
              placeholder="Contoh: 1 Tablet (500 mg) / 10 ml"
              placeholderTextColor="#94A3B8"
              value={dosage}
              onChangeText={setDosage}
            />

            <Text style={[styles.label, { marginTop: 18 }]}>Aturan Minum:</Text>
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

        {/* STEP 4: FREKUENSI & JAM */}
        {step === 4 && (
          <View style={styles.stepCard}>
            <View style={styles.badgeStep}>
              <Ionicons name="alarm-outline" size={24} color="#0D9488" />
            </View>
            <Text style={styles.stepTitle}>Kapan obat harus diminum?</Text>
            <Text style={styles.stepDesc}>Atur jam dan frekuensi alarm berbunyi.</Text>

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

            <Text style={[styles.label, { marginTop: 18 }]}>Waktu Alarm (Jam:Menit):</Text>
            <TextInput
              style={[styles.input, { fontSize: 24, textAlign: "center", fontWeight: "800", color: "#0F766E" }]}
              placeholder="08:00"
              placeholderTextColor="#94A3B8"
              value={time}
              onChangeText={setTime}
            />
          </View>
        )}

        {/* STEP 5: DURASI & STOK */}
        {step === 5 && (
          <View style={styles.stepCard}>
            <View style={styles.badgeStep}>
              <Ionicons name="cube-outline" size={24} color="#0D9488" />
            </View>
            <Text style={styles.stepTitle}>Durasi & Stok Obat</Text>
            <Text style={styles.stepDesc}>Sistem akan memberi tahu jika stok obat tersisa sedikit.</Text>

            <Text style={styles.label}>Durasi Pengobatan:</Text>
            <TextInput
              style={styles.input}
              placeholder="Contoh: 7 hari / 30 hari / Rutin"
              placeholderTextColor="#94A3B8"
              value={duration}
              onChangeText={setDuration}
            />

            <Text style={[styles.label, { marginTop: 18 }]}>Stok Fisik Tersedia:</Text>
            <TextInput
              style={styles.input}
              placeholder="Contoh: 20"
              placeholderTextColor="#94A3B8"
              keyboardType="numeric"
              value={stock}
              onChangeText={setStock}
            />

            <View style={styles.stockNoticeBox}>
              <Ionicons name="notifications" size={20} color="#0D9488" />
              <Text style={styles.stockNoticeText}>
                Smart Reminder akan otomatis memperingatkan Anda jika stok tersisa $\le 3$ dosis.
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Footer Navigasi Tombol */}
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
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
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
    fontWeight: "800",
    color: "#0F172A",
  },
  headerSubtitle: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
    fontWeight: "600",
  },
  progressBarTrack: {
    height: 4,
    backgroundColor: "#E2E8F0",
  },
  progressBarFill: {
    height: 4,
    backgroundColor: "#0D9488",
  },
  content: {
    padding: 20,
  },
  stepCard: {
    backgroundColor: "#FFF",
    borderRadius: 24,
    padding: 22,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  badgeStep: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#CCFBF1",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0F172A",
  },
  stepDesc: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 4,
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
    color: "#334155",
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1.5,
    borderColor: "#CBD5E1",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    fontWeight: "600",
    color: "#0F172A",
  },
  inputSenior: {
    fontSize: 18,
    paddingVertical: 18,
    borderWidth: 2,
    borderColor: "#0F766E",
  },
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    borderRadius: 18,
    padding: 16,
  },
  optionCardActive: {
    borderColor: "#0D9488",
    backgroundColor: "#F0FDFA",
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#CCFBF1",
    alignItems: "center",
    justifyContent: "center",
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0F172A",
  },
  optionDesc: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
  },
  chip: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  chipActive: {
    backgroundColor: "#0D9488",
    borderColor: "#0D9488",
  },
  chipText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#475569",
  },
  chipTextActive: {
    color: "#FFF",
  },
  stockNoticeBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0FDFA",
    borderRadius: 14,
    padding: 14,
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#99F6E4",
    gap: 10,
  },
  stockNoticeText: {
    flex: 1,
    fontSize: 12,
    color: "#0F766E",
    fontWeight: "600",
  },
  footer: {
    backgroundColor: "#FFF",
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },
  submitBtn: {
    backgroundColor: "#0D9488",
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowColor: "#0D9488",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  submitBtnText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "800",
  },
});
