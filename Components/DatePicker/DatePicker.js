import React from 'react';
import RNDatePicker from 'react-native-date-picker';
import { StyleSheet } from 'react-native';

import { APP_DARK_GRAY, APP_DARK_GRAY_HIGHLIGHT } from '../../Themes';

const MINIMUM_DATE = new Date(1900, 0);

const DEFAULT_STYLES = StyleSheet.create({
  datePicker: {
    backgroundColor: APP_DARK_GRAY_HIGHLIGHT
  }
});

export const DatePicker = ({ onDate, style, ...props }) => {
  const today = new Date();

  return (
    <RNDatePicker
      date={today}
      fadeToColor={APP_DARK_GRAY}
      onDateChange={onDate}
      maximumDate={today}
      minimumDate={MINIMUM_DATE}
      mode="date"
      style={[DEFAULT_STYLES.datePicker, style]}
      textColor="#FFFFFF"
      {...props}
    />
  );
};
