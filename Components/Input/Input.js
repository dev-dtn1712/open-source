import React from 'react';
import { StyleSheet, TextInput, Text, View } from 'react-native';
import { APP_FIELD_TEXT, APP_WHITE, Fonts } from '../../Themes';

const DEFAULT_STYLES = StyleSheet.create({
  inputWrapper: {
    margin: 16
  },
  text: {
    color: APP_FIELD_TEXT,
    ...Fonts.style.normal,
    marginBottom: 8
  },
  inputField: {
    margin: 0
  },
  input: {
    backgroundColor: APP_WHITE,
    borderRadius: 8,
    margin: 16,
    opacity: 0.95,
    padding: 14,
    ...Fonts.style.normal
  },
  disabled: {
    opacity: 0.5
  }
});

export const Input = ({
  readOnly = false,
  multiline = false,
  underlineColorAndroid = 'transparent',
  style,
  ...props
}) => (
  <TextInput
    style={[DEFAULT_STYLES.input, readOnly && DEFAULT_STYLES.disabled, style]}
    editable={!readOnly}
    multiline={multiline}
    underlineColorAndroid={underlineColorAndroid}
    {...props}
  />
);

export const InputField = ({
  containerStyle,
  label,
  labelStyle,
  style,
  inputStyle,
  ...props
}) => (
  <View style={[DEFAULT_STYLES.inputWrapper, containerStyle]}>
    <Text style={[DEFAULT_STYLES.text, labelStyle]}>{label}</Text>
    <Input
      style={StyleSheet.flatten(DEFAULT_STYLES.inputField, inputStyle)}
      {...props}
    />
  </View>
);
