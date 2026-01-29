import React from 'react';
import { View, Platform, ViewProps } from 'react-native';
import Animated, { AnimatedProps } from 'react-native-reanimated';

type AnimatedViewProps = AnimatedProps<ViewProps>;

/**
 * A wrapper component that uses Animated.View on native platforms
 * and regular View on web to avoid visibility:hidden issues with
 * entering animations during static rendering.
 */
export function AnimatedView({ children, entering, exiting, layout, ...props }: AnimatedViewProps) {
  if (Platform.OS === 'web') {
    return <View {...props}>{children}</View>;
  }

  return (
    <Animated.View entering={entering} exiting={exiting} layout={layout} {...props}>
      {children}
    </Animated.View>
  );
}
