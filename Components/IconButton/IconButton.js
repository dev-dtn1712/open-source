import React from 'react';
import { StyleSheet, Text, TouchableOpacity, Platform } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { APP_ACCENT_BLUE, Fonts } from '../../Themes';

const DEFAULT_COLLECTION = 'MaterialIcons';

const DEFAULT_STYLES = StyleSheet.create({
  button: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    flexDirection: 'row'
  },
  disabled: {
    opacity: 0.5
  },
  label: {
    ...Fonts.style.normal
  }
});

const IconWrapper = ({ collection, name, ...props }) => {
  if (collection === 'MaterialCommunityIcons') {
    return <MaterialCommunityIcons name={name} {...props} />;
  }

  if (Platform.OS === 'ios') {
    if (name === 'arrow-back') {
      return <Ionicons name="ios-arrow-back" {...props} />;
    }
    if (name === 'more-vert') {
      return <Ionicons name="ios-more" {...props} />;
    }
  }

  return <MaterialIcons name={name} {...props} />;
};

export const IconButton = ({
  color = APP_ACCENT_BLUE,
  disabled = false,
  // Valid icon names can be found at: https://material.io/resources/icons
  // Note that they must be kebab-cased, not snake_cased
  icon,
  iconStyle,
  label,
  labelStyle,
  onPress,
  size = 24,
  style,
  collection = DEFAULT_COLLECTION,
  ...props
}) => (
  <TouchableOpacity
    disabled={disabled}
    onPress={onPress}
    style={[DEFAULT_STYLES.button, disabled && DEFAULT_STYLES.disabled, style]}
    {...props}>
    <IconWrapper
      color={color}
      name={icon}
      size={size}
      style={iconStyle}
      collection={collection}
      testID="icon"
    />
    {!!label && (
      <Text
        style={[DEFAULT_STYLES.label, { color }, labelStyle]}
        testID="label">
        {label}
      </Text>
    )}
  </TouchableOpacity>
);
