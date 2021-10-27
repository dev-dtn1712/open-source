import React from 'react';
import { View } from 'react-native';

export const Circle = ({ color, size, style, ...props }) => {
  const circleStyle = {
    backgroundColor: color,
    borderRadius: size,
    height: size,
    width: size
  };

  return <View style={[circleStyle, style]} {...props} />;
};
