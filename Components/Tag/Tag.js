import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View } from 'react-native';
import { APP_WHITE } from '../../Themes';

const BORDER_RADIUS = 4;

const DEFAULT_STYLES = StyleSheet.create({
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    position: 'absolute',
    top: 16
  },
  text: {
    color: APP_WHITE,
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: -0.06,
    lineHeight: 15,
    textTransform: 'uppercase'
  }
});

export const Tag = ({
  color,
  align = 'left',
  style,
  text,
  textStyle,
  ...props
}) => {
  const radiusOrientation = align === 'left' ? 'Right' : 'Left';
  const tagStyle = {
    [align]: 0,
    backgroundColor: color,
    [`borderTop${radiusOrientation}Radius`]: BORDER_RADIUS,
    [`borderBottom${radiusOrientation}Radius`]: BORDER_RADIUS
  };

  return (
    <View style={[DEFAULT_STYLES.tag, tagStyle, style]} {...props}>
      <Text style={[DEFAULT_STYLES.text, textStyle]}>{text}</Text>
    </View>
  );
};

Tag.propTypes = {
  // eslint-disable-next-line react/require-default-props
  align: PropTypes.oneOf(['left', 'right'])
};
