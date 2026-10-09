import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { colors } from '../styles/theme';

interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  style?: ViewStyle;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  style,
}) => {
  const getVariantStyle = () => {
    switch (variant) {
      case 'secondary':
        return {
          backgroundColor: colors.primaryLight,
          textColor: colors.primary,
        };
      case 'danger':
        return {
          backgroundColor: colors.statusMissedBg,
          textColor: colors.statusMissed,
        };
      case 'primary':
      default:
        return {
          backgroundColor: colors.primary,
          textColor: colors.white,
        };
    }
  };

  const currentVariant = getVariantStyle();

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[
        styles.button,
        // INLINE STYLE: Mengubah warna tombol sesuai varian dinamis
        { backgroundColor: currentVariant.backgroundColor },
        style,
      ]}
    >
      <Text
        style={[
          styles.buttonText,
          // INLINE STYLE: Mengubah warna teks tombol dinamis
          { color: currentVariant.textColor },
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

// ==========================================
// EXTERNAL STYLES: Dibuat terpisah
// ==========================================
const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '700',
  },
});
