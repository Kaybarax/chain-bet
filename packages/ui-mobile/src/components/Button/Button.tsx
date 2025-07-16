import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import theme from '../../theme';

export type ButtonProps = {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
};

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
}) => {
  const buttonStyles = [
    styles.button,
    styles[`${variant}Button`],
    styles[`${size}Button`],
    disabled && styles.disabledButton,
    style,
  ];

  const textStyles = [
    styles.text,
    styles[`${variant}Text`],
    styles[`${size}Text`],
    disabled && styles.disabledText,
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'outline' ? theme.colors.primary : theme.colors.white}
        />
      ) : (
        <Text style={textStyles}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  text: {
    fontWeight: theme.fontWeights.medium,
    textAlign: 'center',
  },
  // Variant styles
  primaryButton: {
    backgroundColor: theme.colors.primary,
  },
  primaryText: {
    color: theme.colors.white,
  },
  secondaryButton: {
    backgroundColor: theme.colors.secondary,
  },
  secondaryText: {
    color: theme.colors.white,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  outlineText: {
    color: theme.colors.primary,
  },
  dangerButton: {
    backgroundColor: theme.colors.danger,
  },
  dangerText: {
    color: theme.colors.white,
  },
  // Size styles
  smallButton: {
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
    minWidth: 80,
  },
  smallText: {
    fontSize: theme.fontSizes.sm,
  },
  mediumButton: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    minWidth: 120,
  },
  mediumText: {
    fontSize: theme.fontSizes.md,
  },
  largeButton: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    minWidth: 160,
  },
  largeText: {
    fontSize: theme.fontSizes.lg,
  },
  // State styles
  disabledButton: {
    backgroundColor: theme.colors.medium,
    opacity: 0.5,
  },
  disabledText: {
    color: theme.colors.light,
  },
});

export default Button;
