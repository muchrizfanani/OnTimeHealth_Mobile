import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { AppProvider } from "../context/AppContext";

export default function RootLayout() {
  return (
    <AppProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
        }}
      >
        <Stack.Screen name="index" options={{ title: "Beranda Pasien" }} />
        <Stack.Screen name="schedule" options={{ title: "Jadwal Obat" }} />
        <Stack.Screen name="history" options={{ title: "Riwayat & Kepatuhan" }} />
        <Stack.Screen name="profile" options={{ title: "Profil Pengguna" }} />
        <Stack.Screen name="reminder" options={{ title: "Smart Alarm & Aksi Obat" }} />
        <Stack.Screen name="caregiver" options={{ title: "Mode Pantau Keluarga" }} />
        <Stack.Screen name="add-medication" options={{ title: "Tambah Jadwal Obat", presentation: "modal" }} />
        <Stack.Screen name="login" options={{ title: "Masuk Akun" }} />
        <Stack.Screen name="explore" options={{ title: "Edukasi & Info" }} />
      </Stack>
    </AppProvider>
  );
}
