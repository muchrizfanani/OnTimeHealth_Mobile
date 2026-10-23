import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { colors, shadows } from '../styles/theme';

interface HeaderProps {
  userName: string;
  subtitle?: string;
  avatarLetter?: string;
  onPressAvatar?: () => void;
  rightAction?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({
  userName,
  subtitle = 'Jangan lupa minum obat tepat waktu',
  avatarLetter = 'S',
  onPressAvatar,
  rightAction,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.greeting}>Halo, selamat beraktivitas 👋</Text>
        <Text style={styles.name}>{userName}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
      {rightAction ? (
        rightAction
      ) : (
        <Pressable
          style={styles.avatar}
          onPress={onPressAvatar}
          android_ripple={{ color: 'rgba(13, 148, 136, 0.2)', borderless: true }}
        >
          <Text style={styles.avatarText}>{avatarLetter}</Text>
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
  },
  textContainer: {
    flex: 1,
    paddingRight: 12,
  },
  greeting: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  name: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.textPrimary,
    marginTop: 2,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 13,
    color: colors.primaryDark,
    marginTop: 2,
    fontWeight: '600',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.borderTeal,
    ...shadows.subtle,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.primaryDark,
  },
});
