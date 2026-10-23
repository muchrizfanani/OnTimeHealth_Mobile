import { Stack } from "expo-router";
import { AppProvider } from "../context/AppContext";

export default function RootLayout() {
  return (
    <AppProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
        }}
      >
        <Stack.Screen name="index" options={{ title: "Dashboard Pasien" }} />
        <Stack.Screen name="add-medication" options={{ title: "Tambah Jadwal Obat", presentation: "modal" }} />
        <Stack.Screen name="reminder" options={{ title: "Smart Alarm & Aksi Obat" }} />
        <Stack.Screen name="caregiver" options={{ title: "Mode Pantau Keluarga" }} />
        <Stack.Screen name="login" options={{ title: "Masuk Akun" }} />
        <Stack.Screen name="explore" options={{ title: "Edukasi & Info" }} />
      </Stack>
    </AppProvider>
  );
}
