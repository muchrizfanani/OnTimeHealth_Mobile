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
import { colors } from './src/styles/theme';

export default function App() {
  const [medicines, setMedicines] = useState<Medicine[]>(dummyMedicines);

  // Toggle status saat card/badge ditekan
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
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <View style={globalStyles.container}>
        <Header userName="Rizky Fanani" subtitle="Jadwal Pengingat Obat Hari Ini" />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 28 }}
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
            <Text style={{ fontSize: 12, color: colors.textSecondary, fontStyle: 'italic' }}>
              *Klik kartu untuk ubah status
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
              icon="add"
              onPress={() =>
                Alert.alert(
                  'Tambah Obat Baru',
                  'Silakan gunakan form wizard tambah obat untuk memasukkan data dosis & frekuensi.'
                )
              }
            />
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
