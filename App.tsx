import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  StatusBar,
  Alert,
} from 'react-native';
import { Header } from './src/components/Header';
import { SummaryCard } from './src/components/SummaryCard';
import { MedicineCard } from './src/components/MedicineCard';
import { PrimaryButton } from './src/components/PrimaryButton';
import { dummyMedicines } from './src/data/dummyMedicines';
import { Medicine, MedicineStatus } from './src/types/medicine';
import { hitungKepatuhan } from './src/utils/medicineLogic';
import { globalStyles } from './src/styles/globalStyles';

export default function App() {
  const [medicines, setMedicines] = useState<Medicine[]>(dummyMedicines);

  // Toggle status saat card/badge ditekan untuk demonstrasi live demo inline style
  const handleToggleStatus = (id: string) => {
    setMedicines((prev) =>
      prev.map((med) => {
        if (med.id === id) {
          const nextStatusMap: Record<MedicineStatus, MedicineStatus> = {
            pending: 'taken',
            taken: 'snoozed',
            snoozed: 'missed',
            missed: 'pending',
          };
          return { ...med, status: nextStatusMap[med.status] };
        }
        return med;
      })
    );
  };

  const totalObat = medicines.length;
  const sudahDiminum = medicines.filter((m) => m.status === 'taken').length;
  const kepatuhan = hitungKepatuhan(medicines);

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F7F9FC" />
      <View style={globalStyles.container}>
        <Header userName="Rizky Fanani" subtitle="Jadwal Pengingat Obat Hari Ini" />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 24 }}
        >
          {/* Ringkasan Kepatuhan (Summary Card) */}
          <SummaryCard
            total={totalObat}
            taken={sudahDiminum}
            percentage={kepatuhan}
          />

          {/* Section List Obat */}
          <View style={globalStyles.rowBetween}>
            <Text style={globalStyles.sectionTitle}>Daftar Obat Hari Ini</Text>
            {/* Inline Style: Keterangan tips interaktif */}
            <Text style={{ fontSize: 12, color: '#64748B', fontStyle: 'italic' }}>
              *Klik badge untuk ubah status
            </Text>
          </View>

          {medicines.map((medicine) => (
            <MedicineCard
              key={medicine.id}
              medicine={medicine}
              onPressStatus={handleToggleStatus}
            />
          ))}

          {/* Tombol Aksi Tambah Obat */}
          <View style={{ marginTop: 12 }}>
            <PrimaryButton
              title="+ Tambah Jadwal Obat Baru"
              onPress={() =>
                Alert.alert(
                  'Tambah Obat',
                  'Fitur form penambahan obat akan diimplementasikan.'
                )
              }
            />
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
