import React from 'react';
import { StyleSheet, View } from 'react-native';

import { APP_WHITE } from '../../Themes';

const DEFAULT_STYLES = StyleSheet.create({
  card: {
    backgroundColor: APP_WHITE,
    borderRadius: 4,
    elevation: 4,
    padding: 16,
    shadowColor: 'rgba(0,0,0,0.15)',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    width: 328
  }
});

export const FloatingCard = ({ style, ...props }) => (
  <View style={[DEFAULT_STYLES.card, style]} {...props} />
);
