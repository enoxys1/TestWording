import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  View,
  TouchableOpacityProps,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useThemeStore } from '../../stores/themeStore';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

interface ButtonProps extends TouchableOpacityProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  children,
  disabled,
  onPressIn,
  onPressOut,
  style,
  ...props
}: ButtonProps) {
  const theme = useThemeStore((s) => s.getTheme());
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = (e: any) => {
    scale.value = withSpring(0.95, { damping: 15, stiffness: 400 });
    onPressIn?.(e);
  };

  const handlePressOut = (e: any) => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
    onPressOut?.(e);
  };

  const sizeClasses = {
    sm: 'px-3 py-2',
    md: 'px-5 py-3',
    lg: 'px-6 py-4',
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          bg: theme.colors.primary,
          text: '#ffffff',
          border: 'transparent',
        };
      case 'secondary':
        return {
          bg: theme.colors.surfaceLight,
          text: theme.colors.text,
          border: 'transparent',
        };
      case 'outline':
        return {
          bg: 'transparent',
          text: theme.colors.primary,
          border: theme.colors.primary,
        };
      case 'ghost':
        return {
          bg: 'transparent',
          text: theme.colors.text,
          border: 'transparent',
        };
    }
  };

  const variantStyles = getVariantStyles();

  return (
    <AnimatedTouchable
      style={[
        animatedStyle,
        {
          backgroundColor: disabled ? theme.colors.surfaceLight : variantStyles.bg,
          borderColor: variantStyles.border,
          borderWidth: variant === 'outline' ? 2 : 0,
          borderRadius: 12,
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}
      className={`flex-row items-center justify-center ${sizeClasses[size]}`}
      disabled={disabled || loading}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.8}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={variantStyles.text} size="small" />
      ) : (
        <View className="flex-row items-center gap-2">
          {icon}
          <Text
            style={{ color: disabled ? theme.colors.textSecondary : variantStyles.text }}
            className={`font-semibold ${textSizes[size]}`}
          >
            {children}
          </Text>
        </View>
      )}
    </AnimatedTouchable>
  );
}
