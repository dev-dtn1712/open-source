import React, { useState } from 'react';
import { StyleSheet, Text, TouchableWithoutFeedback } from 'react-native';

import { LinearGradient } from '../LinearGradient';
import { pickTestIds, omitTestIds } from '../../Utils';

import {
  APP_BLACK,
  APP_BRIGHT_GRAY,
  APP_DISABLED_CARD,
  APP_HEADER_GRAY,
  APP_WHITE,
  Fonts
} from '../../Themes';

const DEFAULT_STYLES = StyleSheet.create({
  button: {
    borderRadius: 4,
    margin: 16,
    opacity: 0.95,
    padding: 14
  },
  text: {
    ...Fonts.style.normal,
    textAlign: 'center'
  }
});

const getBackgroundColor = (disabled, selected) => {
  if (disabled) {
    return APP_BLACK;
  }
  if (selected) {
    // No color prop, use default gradient colors
    return undefined;
  }
  return APP_WHITE;
};

const getTextColor = (disabled, selected) => {
  if (disabled) {
    return APP_DISABLED_CARD;
  }
  if (selected) {
    return APP_BRIGHT_GRAY;
  }
  return APP_HEADER_GRAY;
};

export const Answer = ({
  children,
  disabled = false,
  isSelected = false,
  onChange,
  style,
  textStyle,
  ...props
}) => {
  const [selected, setSelected] = useState(isSelected);
  const onPressAnswer = () => {
    if (!disabled) {
      const newValue = !selected;
      setSelected(newValue);
      if (onChange) {
        onChange(newValue);
      }
    }
  };

  return (
    <TouchableWithoutFeedback
      {...pickTestIds(props)}
      disabled={disabled}
      onPress={onPressAnswer}>
      <LinearGradient
        color={getBackgroundColor(disabled, selected)}
        style={[DEFAULT_STYLES.button, style]}
        {...omitTestIds(props)}>
        <Text
          style={[
            DEFAULT_STYLES.text,
            { color: getTextColor(disabled, selected) },
            textStyle
          ]}>
          {children}
        </Text>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
};
