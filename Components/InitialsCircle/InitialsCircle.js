import React from 'react';
import { StyleSheet, Text } from 'react-native';

import { Circle } from '../Circle';
import { APP_PARALLEL_ORANGE, APP_WHITE, Fonts } from '../../Themes';

const DEFAULT_STYLES = StyleSheet.create({
  circle: {
    backgroundColor: APP_PARALLEL_ORANGE,
    justifyContent: 'center'
  },
  text: {
    color: APP_WHITE,
    fontFamily: Fonts.type.base,
    fontSize: 30,
    fontWeight: 'bold',
    letterSpacing: 0.39,
    textAlign: 'center'
  }
});

const getTextSize = circleSize => Math.floor(circleSize * 0.43);

const first = str => (str.length > 0 ? str[0] : '');
const last = str => (str.length > 1 ? str[str.length - 1] : '');
const toInitials = text => {
  const upper = text.toUpperCase();
  return first(upper) + last(upper);
};

export const InitialsCircle = ({
  size = 70,
  style,
  text,
  textStyle,
  ...props
}) => (
  <Circle size={size} style={[DEFAULT_STYLES.circle, style]} {...props}>
    <Text
      style={[DEFAULT_STYLES.text, { fontSize: getTextSize(size) }, textStyle]}>
      {toInitials(text)}
    </Text>
  </Circle>
);
