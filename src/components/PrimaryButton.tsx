import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';
import { colors, shadows } from '../styles/theme';

interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  icon?: keyof typeof Ionicons.glyphMap;
  style?: ViewStyle;
  textStyle?: TextStyle;
  isSeniorMode?: boolean;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  icon,
  style,
  textStyle,
  isSeniorMode = false,
}) => {
  const getVariantStyle = () => {
    switch (variant) {
      case 'secondary':
        return {
          backgroundColor: colors.primaryLightest,
          textColor: colors.primaryDark,
          borderColor: colors.borderTeal,
          borderWidth: 1.5,
        };
      case 'danger':
        return {
          backgroundColor: colors.statusMissedBg,
          textColor: colors.statusMissed,
          borderColor: colors.statusMissedBorder,
          borderWidth: 1,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          textColor: colors.primary,
          borderColor: colors.primary,
          borderWidth: 1.5,
        };
      case 'primary':
      default:
        return {
          backgroundColor: colors.primary,
          textColor: colors.white,
          borderColor: 'transparent',
          borderWidth: 0,
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
        isSeniorMode && styles.buttonSenior,
        {
          backgroundColor: currentVariant.backgroundColor,
          borderColor: currentVariant.borderColor,
          borderWidth: currentVariant.borderWidth,
        },
        variant === 'primary' && shadows.glow,
        style,
      ]}
    >
      {icon && (
        <Ionicons
          name={icon}
          size={isSeniorMode ? 22 : 18}
          color={currentVariant.textColor}
          style={{ marginRight: 8 }}
        />
      )}
      <Text
        style={[
          styles.buttonText,
          isSeniorMode && { fontSize: 18 },
          { color: currentVariant.textColor },
          textStyle,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonSenior: {
    paddingVertical: 18,
    borderRadius: 18,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
});
