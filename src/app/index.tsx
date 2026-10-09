import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Alert, FlatList, Pressable, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Avatar from "../components/Avatar";
import BottomNav from "../components/BottomNav";
import Capsule from "../components/Capsule";
import { useScale } from "../constants/responsive";
import { colors, styles } from "../constants/styles";
import { medicines } from "../data/medicines";
import { Medicine, MedicineStatus } from "../types/medicine";

// SWITCH CASE
function getStatusLabel(status: MedicineStatus): string {
  switch (status) {
    case "taken": return "Selesai";
    case "pending": return "Menunggu";
    case "missed": return "Terlewat";
    default: return "-";
  }
}

// IF / ELSE IF
function getStatusColors(status: MedicineStatus) {
  if (status === "taken") { return { fg: "#085041", bg: "#E1F5EE", icon: "checkmark-circle" as const, tint: colors.mid }; }
  else if (status === "pending") { return { fg: colors.amberText, bg: colors.amberBg, icon: "time" as const, tint: "#BA7517" }; }
  else { return { fg: "#791F1F", bg: colors.redBg, icon: "alert-circle" as const, tint: colors.redBar }; }
}

// CUSTOM FUNCTION: kartu obat
const renderMedicineCard = (item: Medicine) => {
  const c = getStatusColors(item.status);
  return (
    <View style={styles.card}>
      {/* INLINE STYLING: warna dinamis sesuai status */}
      <View style={[styles.cardIcon, { backgroundColor: c.bg }]}>
        <Ionicons name={c.icon} size={26} color={c.tint} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.medName}>{item.name}</Text>
        <Text style={styles.medInfo}>{item.time} • {item.dosage}</Text>
      </View>
      <View style={[styles.chip, { backgroundColor: c.bg }]}>
        <Text style={[styles.chipText, { color: c.fg }]}>{getStatusLabel(item.status)}</Text>
      </View>
    </View>
  );
};

export default function Index() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const s = useScale();

  const next = medicines.find((m) => m.status === "pending");
  const takenCount = medicines.filter((m) => m.status === "taken").length;
  const percent = Math.round((takenCount / medicines.length) * 100);

  const header = (
    <View>
      <View style={styles.rowBetween}>
        <View style={styles.rowCenter}>
          <Avatar size={s(54)} />
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.greeting}>Selamat pagi</Text>
            <Text style={[styles.userName, { fontSize: s(22) }]}>Bu Siti</Text>
          </View>
        </View>
        <Pressable style={styles.iconBtn} onPress={() => Alert.alert("Notifikasi", "Tidak ada notifikasi baru")}>
          <Ionicons name="notifications-outline" size={22} color={colors.text} />
        </Pressable>
      </View>

      {/* Kartu obat berikutnya */}
      <Pressable style={styles.hero} onPress={() => router.push("/reminder")}>
        <Text style={styles.heroLabel}>Obat berikutnya</Text>
        <Text style={[styles.heroTitle, { fontSize: s(26) }]}>{next ? next.name : "Semua selesai"}</Text>
        <Text style={styles.heroInfo}>{next ? `${next.dosage} • ${next.time}` : "Kerja bagus hari ini"}</Text>
        <View style={{ position: "absolute", right: -6, bottom: 22 }}>
          <Capsule size={s(34)} />
        </View>
      </Pressable>

      <View style={[styles.rowBetween, { marginTop: 22 }]}>
        <Text style={[styles.sectionTitle, { fontSize: s(18) }]}>Hari ini</Text>
        <Text style={styles.muted}>{takenCount} dari {medicines.length} obat</Text>
      </View>
      <View style={styles.barTrack}>
        <View style={[styles.barFill, { width: `${percent}%` }]} />
      </View>
    </View>
  );

  const footer = (
    <View style={styles.formBox}>
      <Text style={styles.sectionTitle}>Tambah jadwal obat</Text>
      <TextInput placeholder="Nama obat" placeholderTextColor={colors.muted} style={styles.input} />
      <View style={styles.inputRow}>
        <TextInput placeholder="Dosis" placeholderTextColor={colors.muted} style={[styles.input, { flex: 1 }]} />
        <TextInput placeholder="Waktu 08:00" placeholderTextColor={colors.muted} style={[styles.input, { flex: 1 }]} />
      </View>
      <Pressable style={styles.primaryBtn} onPress={() => Alert.alert("Info", "Jadwal disimpan (demo)")}>
        <Ionicons name="add-circle" size={24} color="white" />
        <Text style={styles.primaryBtnText}>Simpan jadwal</Text>
      </Pressable>
    </View>
  );

  return (
    <View style={styles.screen}>
      <View style={[styles.content, { paddingTop: insets.top + 8 }]}>
        {/* FLATLIST */}
        <FlatList
          data={medicines}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => renderMedicineCard(item)}
          ListHeaderComponent={header}
          ListFooterComponent={footer}
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        />
      </View>
      <BottomNav />
    </View>
  );
}
