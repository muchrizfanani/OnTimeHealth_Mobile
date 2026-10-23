import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../constants/styles';

interface HeaderProps {
  userName: string;
  subtitle?: string;
  avatarLetter?: string;
}

export const Header: React.FC<HeaderProps> = ({
  userName,
  subtitle = 'Jangan lupa minum obat tepat waktu',
  avatarLetter = 'S',
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.greeting}>Selamat pagi,</Text>
        <Text style={styles.name}>{userName}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{avatarLetter}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  textContainer: {
    flex: 1,
  },
  greeting: {
    fontSize: 13,
    color: colors.muted,
    fontWeight: '600',
  },
  name: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    marginTop: 2,
  },
  subtitle: {
    fontSize: 13,
    color: colors.muted,
    marginTop: 2,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.primary,
  },
});
