import React, { useEffect } from 'react';
import Animated, { Easing } from 'react-native-reanimated';

export const Fade = ({
  visible,
  style,
  children,
  direction = 'up',
  duration
}) => {
  const opacityValue = new Animated.Value(visible ? 1 : 0);
  const translationValue = new Animated.Value(0);

  useEffect(() => {
    const animationConfig = {
      duration: duration || 200,
      easing: Easing.linear,
      useNativeDriver: true
    };
    const opacityConfig = {
      ...animationConfig,
      toValue: visible ? 1 : 0
    };
    const directionConfig = direction === 'up' ? [0, 5] : [5, 0];
    const translationConfig = {
      ...animationConfig,
      toValue: visible ? directionConfig[0] : directionConfig[1]
    };

    Animated.timing(opacityValue, opacityConfig).start();
    if (direction) Animated.timing(translationValue, translationConfig).start();
  }, [visible]);

  return (
    <Animated.View
      style={{
        opacity: opacityValue,
        transform: [{ translateY: translationValue }],
        ...style
      }}>
      {children}
    </Animated.View>
  );
};
