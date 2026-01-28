import React from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useThemeStore } from '../../stores/themeStore';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export type TileStatus = 'empty' | 'filled' | 'correct' | 'present' | 'absent';

interface GameTileProps {
  letter?: string;
  number?: number;
  status?: TileStatus;
  size?: 'sm' | 'md' | 'lg';
  selected?: boolean;
  onPress?: () => void;
  animated?: boolean;
  delay?: number;
}

export function GameTile({
  letter,
  number,
  status = 'empty',
  size = 'md',
  selected = false,
  onPress,
  animated = false,
  delay = 0,
}: GameTileProps) {
  const theme = useThemeStore((s) => s.getTheme());
  const scale = useSharedValue(1);
  const rotateX = useSharedValue(0);

  React.useEffect(() => {
    if (animated && status !== 'empty' && status !== 'filled') {
      const timeout = setTimeout(() => {
        rotateX.value = withSequence(
          withTiming(90, { duration: 150 }),
          withTiming(0, { duration: 150 })
        );
      }, delay);
      return () => clearTimeout(timeout);
    }
  }, [status, animated, delay]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotateX: `${rotateX.value}deg` },
    ],
  }));

  const handlePressIn = () => {
    if (onPress) {
      scale.value = withSpring(0.9, { damping: 15, stiffness: 400 });
    }
  };

  const handlePressOut = () => {
    if (onPress) {
      scale.value = withSpring(1, { damping: 15, stiffness: 400 });
    }
  };

  const sizeStyles = {
    sm: { width: 40, height: 40, fontSize: 18 },
    md: { width: 52, height: 52, fontSize: 24 },
    lg: { width: 64, height: 64, fontSize: 32 },
  };

  const getStatusColor = () => {
    switch (status) {
      case 'correct':
        return theme.colors.correct;
      case 'present':
        return theme.colors.present;
      case 'absent':
        return theme.colors.absent;
      case 'filled':
        return theme.colors.surfaceLight;
      default:
        return 'transparent';
    }
  };

  const getBorderColor = () => {
    if (selected) return theme.colors.primary;
    if (status === 'empty') return theme.colors.border;
    return 'transparent';
  };

  const content = letter || (number !== undefined ? String(number) : '');
  const { width, height, fontSize } = sizeStyles[size];

  const tileContent = (
    <Animated.View
      style={[
        animatedStyle,
        {
          width,
          height,
          backgroundColor: getStatusColor(),
          borderColor: getBorderColor(),
          borderWidth: status === 'empty' || selected ? 2 : 0,
          borderRadius: 8,
          justifyContent: 'center',
          alignItems: 'center',
        },
      ]}
    >
      <Text
        style={{
          color: status === 'empty' || status === 'filled' ? theme.colors.text : '#ffffff',
          fontSize,
          fontWeight: '700',
        }}
      >
        {content}
      </Text>
    </Animated.View>
  );

  if (onPress) {
    return (
      <AnimatedPressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        {tileContent}
      </AnimatedPressable>
    );
  }

  return tileContent;
}
