import React from 'react';
import { View, ViewProps, Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useThemeStore } from '../../stores/themeStore';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface CardProps extends ViewProps {
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  onPress?: () => void;
  children: React.ReactNode;
}

export function Card({
  variant = 'default',
  padding = 'md',
  onPress,
  children,
  style,
  ...props
}: CardProps) {
  const theme = useThemeStore((s) => s.getTheme());
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (onPress) {
      scale.value = withSpring(0.98, { damping: 15, stiffness: 400 });
    }
  };

  const handlePressOut = () => {
    if (onPress) {
      scale.value = withSpring(1, { damping: 15, stiffness: 400 });
    }
  };

  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'elevated':
        return {
          backgroundColor: theme.colors.surface,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 8,
        };
      case 'outlined':
        return {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: theme.colors.border,
        };
      default:
        return {
          backgroundColor: theme.colors.surface,
        };
    }
  };

  const variantStyles = getVariantStyles();

  if (onPress) {
    return (
      <AnimatedPressable
        style={[
          animatedStyle,
          {
            ...variantStyles,
            borderRadius: 16,
          },
          style,
        ]}
        className={paddingClasses[padding]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        {...props}
      >
        {children}
      </AnimatedPressable>
    );
  }

  return (
    <View
      style={[
        {
          ...variantStyles,
          borderRadius: 16,
        },
        style,
      ]}
      className={paddingClasses[padding]}
      {...props}
    >
      {children}
    </View>
  );
}
