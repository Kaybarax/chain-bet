import React from 'react';
import { Pressable, Text, PressableProps, StyleSheet } from 'react-native';

export interface UniversalButtonProps extends PressableProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
}

const UniversalButton = React.forwardRef<
  React.ElementRef<typeof Pressable>,
  UniversalButtonProps
>(({ 
  title, 
  variant = 'primary', 
  size = 'medium', 
  disabled = false, 
  style, 
  ...props 
}, ref) => {
  const buttonStyle = [
    styles.button,
    styles[`button_${variant}`],
    styles[`button_${size}`],
    disabled && styles.button_disabled,
    style,
  ];

  const textStyle = [
    styles.text,
    styles[`text_${variant}`],
    styles[`text_${size}`],
    disabled && styles.text_disabled,
  ];

  return (
    <Pressable
      ref={ref}
      style={({ pressed }) => [
        buttonStyle,
        pressed && styles.button_pressed,
      ]}
      disabled={disabled}
      {...props}
    >
      <Text style={textStyle}>{title}</Text>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  button_primary: {
    backgroundColor: '#2563eb',
  },
  button_secondary: {
    backgroundColor: '#6b7280',
  },
  button_outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#2563eb',
  },
  button_small: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  button_medium: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  button_large: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  button_disabled: {
    opacity: 0.5,
  },
  button_pressed: {
    opacity: 0.8,
  },
  text: {
    fontWeight: '600',
    fontSize: 14,
  },
  text_primary: {
    color: '#ffffff',
  },
  text_secondary: {
    color: '#ffffff',
  },
  text_outline: {
    color: '#2563eb',
  },
  text_small: {
    fontSize: 12,
  },
  text_medium: {
    fontSize: 14,
  },
  text_large: {
    fontSize: 16,
  },
  text_disabled: {
    opacity: 0.7,
  },
});

UniversalButton.displayName = 'UniversalButton';

export { UniversalButton };
