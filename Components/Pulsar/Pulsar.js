import { times } from 'lodash';
import React, { useState, useEffect } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

import { APP_LIGHT_GRAY, Metrics } from '../../Themes';

const DEFAULT_STYLES = StyleSheet.create({
  pulse: {
    backgroundColor: APP_LIGHT_GRAY,
    position: 'absolute'
  }
});

const Pulse = ({ opacity, size, startSize, style, ...props }) => {
  const scale = Animated.divide(size, startSize);
  const position = startSize / -2;

  return (
    <Animated.View
      style={[
        DEFAULT_STYLES.pulse,
        {
          borderRadius: size,
          height: startSize,
          left: position,
          opacity,
          scaleX: scale,
          scaleY: scale,
          top: position,
          width: startSize
        },
        style
      ]}
      {...props}
    />
  );
};

const arrayBuilder = size => iteratee => times(size, iteratee);

const expandAnimator = (duration, endSize, endOpacity) => (size, opacity) => {
  const useNativeDriver = true;

  return Animated.parallel([
    Animated.timing(size, {
      toValue: endSize,
      duration,
      easing: Easing.bezier(0.2, 0.3, 0.4, 1.0),
      useNativeDriver
    }),
    Animated.timing(opacity, {
      toValue: endOpacity,
      duration,
      easing: Easing.bezier(0.1, 0.7, 0.4, 1.0),
      useNativeDriver
    })
  ]);
};

export const Pulsar = ({
  count = 4,
  startSize = 86,
  endSize = Metrics.screenWidth,
  startOpacity = 1,
  endOpacity = 0,
  duration = 2750,
  interval = 600,
  delay = 600,
  ...props
}) => {
  const countOf = arrayBuilder(count);
  const [sizes] = useState(countOf(() => new Animated.Value(0)));
  const [opacities] = useState(countOf(() => new Animated.Value(startOpacity)));

  const animateExpand = expandAnimator(duration, endSize, endOpacity);
  const expansions = countOf(i => animateExpand(sizes[i], opacities[i]));

  let timer = null;

  const runAnimations = () => {
    countOf(i => {
      sizes[i].setValue(startSize);
      opacities[i].setValue(startOpacity);
    });

    Animated.sequence([
      Animated.stagger(interval, expansions),
      Animated.delay(delay)
    ]).start();
  };

  useEffect(() => {
    setTimeout(() => {
      runAnimations();

      timer = setInterval(() => {
        runAnimations();
      }, interval * (count - 1) + duration + delay);
    }, delay);

    return () => {
      clearInterval(timer);
      timer = null;
    };
  }, []);

  return (
    <View>
      {countOf(i => (
        <Pulse
          key={i}
          opacity={opacities[i]}
          size={sizes[i]}
          startSize={startSize}
          {...props}
        />
      ))}
    </View>
  );
};
