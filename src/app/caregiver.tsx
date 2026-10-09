import { Ionicons } from "@expo/vector-icons";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Avatar from "../components/Avatar";
import BottomNav from "../components/BottomNav";
import { useScale } from "../constants/responsive";
import { colors, styles } from "../constants/styles";
import { medicines, weekly } from "../data/medicines";

// Warna batang grafik
const barColor = (percent: number) => (percent >= 90 ? colors.mid : percent >= 70 ? colors.amber : colors.redBar);

export default function Caregiver() {
  const insets = useSafeAreaInsets();
  const s = useScale();
  const missed = medicines.filter((m) => m.status === "missed");
  const taken = medicines.filter((m) => m.status === "taken");

  // PRIMITIVE LOOP: bangun batang grafik sebelum return
  const bars = [];
  for (let i = 0; i < weekly.length; i++) {
    bars.push(
      <View key={i} style={styles.chartCol}>
        <View style={{ height: `${weekly[i].percent}%`, backgroundColor: barColor(weekly[i].percent), borderRadius: 8 }} />
      </View>
    );
  }
  const average = Math.round(weekly.reduce((sum, d) => sum + d.percent, 0) / weekly.length);

  return (
    <View style={styles.screen}>
      <View style={[styles.content, { paddingTop: insets.top + 8 }]}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <View style={styles.rowBetween}>
            <View>
              <Text style={styles.greeting}>Mode keluarga</Text>
              <Text style={[styles.userName, { fontSize: s(22) }]}>Pantau Bu Siti</Text>
            </View>
            <Avatar size={s(54)} bg="#B5D4F4" shirt="#185FA5" hair="#444441" />
          </View>

          {/* MAP: satu kartu peringatan per obat terlewat */}
          {missed.map((m) => (
            <View key={m.id} style={styles.alertCard}>
              <View style={styles.rowCenter}>
                <Ionicons name="warning" size={24} color="#A32D2D" />
                <Text style={[styles.alertTitle, { fontSize: s(17) }]}>Obat terlewat</Text>
              </View>
              <Text style={styles.alertText}>{m.name} {m.dosage} dijadwalkan {m.time} dan belum dikonfirmasi.</Text>
              <Pressable style={styles.alertBtn} onPress={() => Alert.alert("Menghubungi", "Memanggil Bu Siti...")}>
                <Text style={{ color: "white", fontSize: 16, fontWeight: "800" }}>Hubungi Bu Siti</Text>
              </Pressable>
            </View>
          ))}

          <View style={styles.chartBox}>
            <View style={styles.rowBetween}>
              <Text style={styles.sectionTitle}>Kepatuhan minggu ini</Text>
              <Text style={{ color: colors.primary, fontSize: s(20), fontWeight: "800" }}>{average}%</Text>
            </View>
            <View style={styles.chartRow}>{bars}</View>
            <View style={{ flexDirection: "row", gap: 8, marginTop: 6 }}>
              {weekly.map((d, i) => (
                <Text key={i} style={styles.chartDay}>{d.day}</Text>
              ))}
            </View>
          </View>

          <Text style={[styles.sectionTitle, { marginTop: 22 }]}>Sudah dikonfirmasi</Text>
          {taken.map((m) => (
            <View key={m.id} style={styles.card}>
              <View style={[styles.cardIcon, { backgroundColor: colors.primaryLight }]}>
                <Ionicons name="checkmark-circle" size={26} color={colors.mid} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.medName}>{m.name}</Text>
                <Text style={styles.medInfo}>Diminum sekitar {m.time}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
      <BottomNav />
    </View>
  );
}
