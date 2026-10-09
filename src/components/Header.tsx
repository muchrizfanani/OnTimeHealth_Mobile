import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../styles/theme';

interface HeaderProps {
  userName: string;
  subtitle?: string;
}

export const Header: React.FC<HeaderProps> = ({ userName, subtitle }) => {
  return (
    <View style={styles.headerContainer}>
      <View>
        <Text style={styles.greetingText}>Halo, {userName} 👋</Text>
        <Text style={styles.subtitleText}>
          {subtitle || 'Jangan lupa minum obat tepat waktu ya!'}
        </Text>
      </View>
      <View style={styles.avatarCircle}>
        <Text style={styles.avatarText}>{userName.charAt(0).toUpperCase()}</Text>
      </View>
    </View>
  );
};

// ==========================================
// EXTERNAL STYLES: Menggunakan StyleSheet.create terpisah
// ==========================================
const styles = StyleSheet.create({
  headerContainer: {
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginBottom: 8,
  },
  greetingText: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  subtitleText: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
});
