import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, shadows } from '../styles/theme';

interface SummaryCardProps {
  total: number;
  taken: number;
  percentage: number;
  isSeniorMode?: boolean;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({
  total,
  taken,
  percentage,
  isSeniorMode = false,
}) => {
  const roundedPercent = Math.round(percentage);
  const remaining = Math.max(0, total - taken);

  return (
    <View style={[styles.cardContainer, isSeniorMode && styles.cardSenior]}>
      {/* Header Baris Ringkasan */}
      <View style={styles.headerRow}>
        <View style={styles.badgeRow}>
          <View style={styles.iconTag}>
            <Ionicons name="shield-checkmark" size={14} color="#FFF" />
          </View>
          <Text style={styles.tagText}>KEPATUHAN HARI INI</Text>
        </View>
        <View style={styles.percentBadge}>
          <Text style={styles.percentText}>{roundedPercent}%</Text>
        </View>
      </View>

      <Text style={[styles.title, isSeniorMode && { fontSize: 20 }]}>
        {roundedPercent >= 80
          ? 'Kepatuhan Sangat Baik! 🌟'
          : roundedPercent >= 50
          ? 'Jaga Terus Disiplin Obatmu 💊'
          : 'Ada Jadwal yang Belum Selesai ⏰'}
      </Text>

      <Text style={[styles.subtitle, isSeniorMode && { fontSize: 15 }]}>
        {taken} dari {total} obat sudah berhasil diminum tepat waktu.
      </Text>

      {/* Progress Bar Visual */}
      <View style={styles.progressBarBackground}>
        <View
          style={[
            styles.progressBarFill,
            { width: `${Math.min(Math.max(roundedPercent, 0), 100)}%` },
          ]}
        />
      </View>

      {/* 3 Metric Pills */}
      <View style={styles.metricsRow}>
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Total Jadwal</Text>
          <Text style={styles.metricValue}>{total}</Text>
        </View>
        <View style={styles.metricDivider} />
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Sudah Diminum</Text>
          <Text style={[styles.metricValue, { color: '#A7F3D0' }]}>{taken}</Text>
        </View>
        <View style={styles.metricDivider} />
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Sisa Belum</Text>
          <Text style={[styles.metricValue, { color: '#FDE68A' }]}>{remaining}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: colors.primary,
    borderRadius: 22,
    padding: 20,
    marginVertical: 12,
    ...shadows.glow,
  },
  cardSenior: {
    padding: 24,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  iconTag: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  percentBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  percentText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '900',
  },
  title: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '800',
    marginTop: 2,
  },
  subtitle: {
    color: colors.primaryLight,
    fontSize: 13,
    marginTop: 4,
    fontWeight: '500',
  },
  progressBarBackground: {
    height: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 5,
    marginTop: 14,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.12)',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginTop: 16,
  },
  metricItem: {
    flex: 1,
    alignItems: 'center',
  },
  metricLabel: {
    color: colors.primaryLight,
    fontSize: 11,
    fontWeight: '600',
  },
  metricValue: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '800',
    marginTop: 2,
  },
  metricDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
});
