import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, shadows } from '../styles/theme';
import { Medicine, MedicineStatus } from '../types/medicine';

interface MedicineCardProps {
  medicine: Medicine;
  onPressStatus?: (id: string) => void;
  onPressCard?: (medicine: Medicine) => void;
  isSeniorMode?: boolean;
}

export const MedicineCard: React.FC<MedicineCardProps> = ({
  medicine,
  onPressStatus,
  onPressCard,
  isSeniorMode = false,
}) => {
  // Helper fungsi untuk mendapatkan warna dan label dinamis berdasarkan status obat
  const getStatusVisuals = (status: MedicineStatus) => {
    switch (status) {
      case 'taken':
        return {
          label: 'Sudah Diminum',
          textColor: colors.statusTaken,
          bgColor: colors.statusTakenBg,
          borderColor: colors.statusTakenBorder,
          icon: 'checkmark-circle' as const,
        };
      case 'snoozed':
        return {
          label: 'Ditunda',
          textColor: colors.statusSnoozed,
          bgColor: colors.statusSnoozedBg,
          borderColor: colors.statusSnoozedBorder,
          icon: 'time' as const,
        };
      case 'missed':
        return {
          label: 'Terlewat',
          textColor: colors.statusMissed,
          bgColor: colors.statusMissedBg,
          borderColor: colors.statusMissedBorder,
          icon: 'close-circle' as const,
        };
      case 'pending':
      default:
        return {
          label: 'Belum Diminum',
          textColor: colors.statusPending,
          bgColor: colors.statusPendingBg,
          borderColor: colors.statusPendingBorder,
          icon: 'alarm-outline' as const,
        };
    }
  };

  const statusVisual = getStatusVisuals(medicine.status);
  const isLowStock = medicine.stock !== undefined && medicine.stock <= 3;
  const doseDisplay = medicine.dosage || medicine.dose || '1 Dosis';
  const instructionDisplay = medicine.note || medicine.instruction || 'Sesudah makan';

  const getFormIcon = () => {
    switch (medicine.form) {
      case 'Sirup':
        return 'water' as const;
      case 'Injeksi':
        return 'color-wand' as const;
      case 'Kapsul':
        return 'medical' as const;
      case 'Tablet':
      default:
        return 'disc' as const;
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => {
        if (onPressCard) {
          onPressCard(medicine);
        } else if (onPressStatus) {
          onPressStatus(medicine.id);
        }
      }}
      style={[
        styles.card,
        isSeniorMode && styles.cardSenior,
        { borderLeftColor: statusVisual.borderColor, borderLeftWidth: 4 },
      ]}
    >
      <View style={styles.contentRow}>
        {/* Icon Bentuk Obat */}
        <View
          style={[
            styles.iconWrapper,
            medicine.status === 'taken' && { backgroundColor: colors.primaryLight },
          ]}
        >
          <Ionicons
            name={getFormIcon()}
            size={isSeniorMode ? 26 : 22}
            color={medicine.status === 'taken' ? colors.primary : colors.textSecondary}
          />
        </View>

        {/* Informasi Utama Obat */}
        <View style={styles.mainInfo}>
          <Text style={[styles.medicineName, isSeniorMode && { fontSize: 20 }]}>
            {medicine.name}
          </Text>
          <Text style={[styles.detailText, isSeniorMode && { fontSize: 15 }]}>
            {doseDisplay} • {medicine.form}
          </Text>
          <Text style={[styles.instructionText, isSeniorMode && { fontSize: 13 }]}>
            ℹ️ {instructionDisplay}
          </Text>
        </View>

        {/* Waktu & Stok */}
        <View style={styles.timeAndStatus}>
          <View style={styles.timeRow}>
            <Ionicons name="time-outline" size={14} color={colors.primary} />
            <Text style={[styles.timeText, isSeniorMode && { fontSize: 16 }]}>
              {medicine.time}
            </Text>
          </View>
          {medicine.stock !== undefined && (
            <Text
              style={[
                styles.stockBadge,
                isLowStock && styles.stockLow,
              ]}
            >
              Stok: {medicine.stock} {isLowStock ? '⚠️' : ''}
            </Text>
          )}
        </View>
      </View>

      {/* Bagian Bawah: Badge Status & Tombol Aksi Cepat */}
      <View style={styles.bottomRow}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => onPressStatus && onPressStatus(medicine.id)}
          style={[styles.statusBadge, { backgroundColor: statusVisual.bgColor }]}
        >
          <Ionicons name={statusVisual.icon} size={13} color={statusVisual.textColor} />
          <Text style={[styles.statusText, { color: statusVisual.textColor }]}>
            {statusVisual.label}
          </Text>
        </TouchableOpacity>

        <Text style={styles.tipText}>*Ketuk untuk ganti status</Text>
      </View>

      {medicine.missedReason && (
        <View style={styles.missedBox}>
          <Text style={styles.missedText}>
            Alasan: "{medicine.missedReason}"
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.subtle,
  },
  cardSenior: {
    padding: 20,
    borderWidth: 1.5,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  mainInfo: {
    flex: 1,
    paddingRight: 8,
  },
  medicineName: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  detailText: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
    fontWeight: '600',
  },
  instructionText: {
    fontSize: 12,
    color: colors.primaryDark,
    marginTop: 4,
    fontWeight: '500',
  },
  timeAndStatus: {
    alignItems: 'flex-end',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeText: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.primary,
  },
  stockBadge: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 4,
    fontWeight: '600',
  },
  stockLow: {
    color: colors.statusMissed,
    fontWeight: '800',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F8FAFC',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 12,
    gap: 4,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '800',
  },
  tipText: {
    fontSize: 11,
    color: colors.textMuted,
    fontStyle: 'italic',
  },
  missedBox: {
    backgroundColor: colors.statusMissedBg,
    borderRadius: 10,
    padding: 8,
    marginTop: 8,
  },
  missedText: {
    fontSize: 11,
    color: colors.statusMissed,
    fontWeight: '600',
  },
});
