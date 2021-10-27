import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

import { APP_BLUE, APP_WHITE, Fonts } from '../../Themes';

const DEFAULT_STYLES = StyleSheet.create({
  button: {
    backgroundColor: APP_BLUE,
    borderRadius: 8,
    margin: 16,
    opacity: 0.95,
    padding: 14
  },
  disabled: {
    opacity: 0.5
  },
  text: {
    ...Fonts.style.normal,
    color: APP_WHITE,
    fontWeight: 'bold',
    textAlign: 'center'
  }
});

export const Button = ({
  children,
  disabled = false,
  onPress,
  style,
  textStyle,
  ...props
}) => (
  <TouchableOpacity
    disabled={disabled}
    onPress={onPress}
    style={[DEFAULT_STYLES.button, disabled && DEFAULT_STYLES.disabled, style]}
    {...props}>
    <Text style={[DEFAULT_STYLES.text, textStyle]}>{children}</Text>
  </TouchableOpacity>
);
