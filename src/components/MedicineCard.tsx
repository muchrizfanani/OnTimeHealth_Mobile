import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Medicine, MedicineStatus } from '../types/medicine';
import { colors } from '../styles/theme';

interface MedicineCardProps {
  medicine: Medicine;
  onPressStatus?: (id: string) => void;
}

export const MedicineCard: React.FC<MedicineCardProps> = ({ medicine, onPressStatus }) => {
  // Helper fungsi untuk mendapatkan warna dinamis berdasarkan status obat
  const getStatusVisuals = (status: MedicineStatus) => {
    switch (status) {
      case 'taken':
        return {
          label: 'Sudah Diminum',
          textColor: colors.statusTaken,
          bgColor: colors.statusTakenBg,
          borderColor: colors.statusTaken,
        };
      case 'snoozed':
        return {
          label: 'Ditunda',
          textColor: colors.statusSnoozed,
          bgColor: colors.statusSnoozedBg,
          borderColor: colors.statusSnoozed,
        };
      case 'missed':
        return {
          label: 'Terlewat',
          textColor: colors.statusMissed,
          bgColor: colors.statusMissedBg,
          borderColor: colors.statusMissed,
        };
      case 'pending':
      default:
        return {
          label: 'Belum Diminum',
          textColor: colors.statusPending,
          bgColor: colors.statusPendingBg,
          borderColor: colors.border,
        };
    }
  };

  const statusVisual = getStatusVisuals(medicine.status);

  return (
    <View
      style={[
        styles.card,
        // INLINE STYLE: Mengubah border kiri card sesuai warna status
        { borderLeftColor: statusVisual.borderColor, borderLeftWidth: 5 },
      ]}
    >
      <View style={styles.contentRow}>
        <View style={styles.mainInfo}>
          <Text style={styles.medicineName}>{medicine.name}</Text>
          <Text style={styles.detailText}>
            {medicine.dose} • {medicine.form}
          </Text>
          <Text style={styles.instructionText}>ℹ️ {medicine.instruction}</Text>
        </View>

        <View style={styles.timeAndStatus}>
          <Text style={styles.timeText}>⏰ {medicine.time}</Text>

          {/* Badge Status Obat */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => onPressStatus && onPressStatus(medicine.id)}
            style={[
              styles.statusBadge,
              // INLINE STYLE: Mengubah background badge status secara dinamis
              { backgroundColor: statusVisual.bgColor },
            ]}
          >
            <Text
              style={[
                styles.statusText,
                // INLINE STYLE: Mengubah warna tulisan status secara dinamis
                { color: statusVisual.textColor },
              ]}
            >
              {statusVisual.label}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

// ==========================================
// EXTERNAL STYLES: Didefinisikan terpisah menggunakan StyleSheet.create
// ==========================================
const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  contentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mainInfo: {
    flex: 1,
    paddingRight: 12,
  },
  medicineName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  detailText: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  instructionText: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 6,
  },
  timeAndStatus: {
    alignItems: 'flex-end',
  },
  timeText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 8,
  },
  statusBadge: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
});
