import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Animated } from 'react-native';

import { LinearGradient } from '../LinearGradient';
import { Metrics, APP_NEAR_BLACK } from '../../Themes';

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);
const DEFAULT_BAR_WIDTH = Metrics.screenWidth;
const ANIM_DURATION = 150;

const DEFAULT_STYLES = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 4,
    width: '100%',
    overflow: 'hidden'
  },
  background: {
    backgroundColor: APP_NEAR_BLACK,
    width: '100%',
    height: '100%'
  },
  bar: {
    width: '100%',
    height: '100%'
  }
});

const addBuffer = (progress, buffer) => (1 - buffer) * progress + buffer;

const usePrevious = value => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

export const ProgressBar = ({
  barProps,
  barStyle,
  backgroundStyle,
  buffer = 0,
  progress,
  style,
  ...props
}) => {
  const [barWidth, setBarWidth] = useState(DEFAULT_BAR_WIDTH);

  const prevProgress = usePrevious(progress) || 0;
  const animated = new Animated.Value(0);

  const startAnimation = () => {
    Animated.timing(animated, {
      toValue: 1,
      duration: ANIM_DURATION,
      useNativeDriver: true
    }).start();
  };

  const xPos = animated.interpolate({
    inputRange: [0, 1],
    outputRange: [
      Math.min((addBuffer(prevProgress, buffer) - 1) * barWidth, 0),
      Math.min((addBuffer(progress, buffer) - 1) * barWidth, 0)
    ],
    extrapolate: 'clamp'
  });

  const animatedStyle = {
    position: 'absolute',
    zIndex: 99,
    transform: [{ translateX: xPos }]
  };

  useEffect(() => {
    startAnimation();
  }, [progress]);

  return (
    <View
      style={[DEFAULT_STYLES.container, style]}
      onLayout={event => {
        const { width } = event.nativeEvent.layout;
        setBarWidth(width);
      }}
      {...props}>
      <AnimatedLinearGradient
        style={[DEFAULT_STYLES.bar, animatedStyle, barStyle]}
        testID="bar"
        {...barProps}
      />
      <View
        style={[DEFAULT_STYLES.background, backgroundStyle]}
        testID="background"
      />
    </View>
  );
};
