import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Alert, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BottomNav from "../components/BottomNav";
import Capsule from "../components/Capsule";
import { useScale } from "../constants/responsive";
import { colors, styles } from "../constants/styles";
import { medicines } from "../data/medicines";

// CALLBACK FUNCTION
function confirmMedicine(name: string, callback: () => void) {
  Alert.alert("Terkonfirmasi", `${name} sudah diminum. Keluarga akan diberi tahu.`);
  callback();
}

export default function Reminder() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const s = useScale();
  const med = medicines.find((m) => m.status === "pending") ?? medicines[0];

  return (
    <View style={styles.remindBg}>
      <View style={[styles.content, { paddingTop: insets.top + 16, paddingHorizontal: 22, alignItems: "center" }]}>
        <Text style={[styles.muted, { color: "#085041" }]}>{med.time}</Text>

        {/* Ilustrasi botol obat + kapsul */}
        <View style={{ width: s(190), height: s(190), borderRadius: s(95), backgroundColor: "#9FE1CB", alignItems: "center", justifyContent: "center", marginTop: 14 }}>
          <View style={{ width: s(140), height: s(140), borderRadius: s(70), backgroundColor: "#5DCAA5", alignItems: "center", justifyContent: "center" }}>
            <View style={{ width: s(70), height: s(24), borderRadius: 8, backgroundColor: colors.primary }} />
            <View style={{ width: s(60), height: s(70), borderRadius: 10, backgroundColor: "white", marginTop: -2, alignItems: "center", justifyContent: "center" }}>
              <View style={{ width: s(40), height: s(26), borderRadius: 6, backgroundColor: colors.primaryLight }} />
            </View>
          </View>
          <View style={{ position: "absolute", right: s(6), bottom: s(18) }}>
            <Capsule size={s(24)} />
          </View>
        </View>

        <Text style={[styles.remindTitle, { fontSize: s(26) }]}>Waktunya minum obat</Text>
        <Text style={[styles.remindName, { fontSize: s(22) }]}>{med.name}</Text>
        <Text style={styles.remindInfo}>{med.dosage} • 1 tablet • {med.note ?? "-"}</Text>

        <View style={{ marginTop: "auto", width: "100%", paddingBottom: 12 }}>
          <Pressable style={styles.bigBtn} onPress={() => confirmMedicine(med.name, () => router.replace("/"))}>
            <Ionicons name="checkmark-circle" size={s(30)} color="white" />
            <Text style={[styles.bigBtnText, { fontSize: s(21) }]}>Saya sudah minum</Text>
          </Pressable>
          <Pressable onPress={() => Alert.alert("Diingatkan", "Pengingat 10 menit lagi")}>
            <Text style={styles.snooze}>Ingatkan 10 menit lagi</Text>
          </Pressable>
        </View>
      </View>
      <BottomNav />
    </View>
  );
}
