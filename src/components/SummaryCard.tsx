import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../styles/theme';

interface SummaryCardProps {
  total: number;
  taken: number;
  percentage: number;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({ total, taken, percentage }) => {
  return (
    <View style={styles.cardContainer}>
      <View style={styles.infoCol}>
        <Text style={styles.title}>Kepatuhan Hari Ini</Text>
        <Text style={styles.subtitle}>
          {taken} dari {total} obat sudah diminum
        </Text>
        {/* Progress bar visual */}
        <View style={styles.progressBarBackground}>
          <View
            style={[
              styles.progressBarFill,
              // INLINE STYLE: Mengatur lebar progress bar secara dinamis sesuai percentage
              { width: `${Math.min(Math.max(percentage, 0), 100)}%` },
            ]}
          />
        </View>
      </View>
      <View style={styles.percentBadge}>
        <Text style={styles.percentText}>{Math.round(percentage)}%</Text>
      </View>
    </View>
  );
};

// ==========================================
// EXTERNAL STYLES: Card Ringkasan Kepatuhan
// ==========================================
const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 12,
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  infoCol: {
    flex: 1,
    marginRight: 16,
  },
  title: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  subtitle: {
    color: '#DCEBFA',
    fontSize: 13,
    marginTop: 4,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    marginTop: 12,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
  },
  percentBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
  },
  percentText: {
    color: colors.white,
    fontSize: 20,
    fontWeight: '800',
  },
});
