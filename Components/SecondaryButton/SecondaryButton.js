import React from 'react';
import { StyleSheet } from 'react-native';

import { Button } from '../Button';
import { APP_ACCENT_BLUE } from '../../Themes';

const DEFAULT_STYLES = StyleSheet.create({
  button: {
    backgroundColor: 'rgba(0,0,0,0)'
  },
  text: {
    color: APP_ACCENT_BLUE,
    fontSize: 16,
    fontWeight: 'normal',
    letterSpacing: -0.38
  }
});

export const SecondaryButton = ({ style, textStyle, ...props }) => (
  <Button
    style={[DEFAULT_STYLES.button, style]}
    textStyle={[DEFAULT_STYLES.text, textStyle]}
    {...props}
  />
);
