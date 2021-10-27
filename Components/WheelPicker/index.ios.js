/* eslint-disable no-unused-vars */

import React from 'react';
import { View } from 'react-native';
import { Picker as RCTWheelPicker } from '@react-native-community/picker';

import { APP_BRIGHT_GRAY, APP_DIVIDER_GRAY, APP_DARK_GRAY } from '../../Themes';
import { omitTestIds, pickTestIds } from '../../Utils';

export const WheelPicker = ({
  isCyclic = false,
  data = [],
  selectedItemTextColor = APP_BRIGHT_GRAY,
  selectedItemTextSize = 20,
  indicatorWidth = 1,
  indicatorColor = APP_DIVIDER_GRAY,
  hideIndicator = false,
  itemTextColor = APP_BRIGHT_GRAY,
  itemTextSize = 18,
  selectedItem = 0,
  backgroundColor = APP_DARK_GRAY,
  height = 200,
  containerStyle,
  onSelect,
  ...props
}) => {
  const selectedValue = data[selectedItem];

  const onItemSelected = itemVal => {
    const selectedIndex = data.findIndex(item => item === itemVal);

    if (onSelect) {
      onSelect(selectedIndex);
    }
  };

  return (
    <View style={containerStyle} {...omitTestIds(props)}>
      <RCTWheelPicker
        {...pickTestIds(props)}
        isCyclic={isCyclic}
        style={{ width: '100%', height, backgroundColor }}
        selectedItemTextColor={selectedItemTextColor}
        selectedItemTextSize={selectedItemTextSize}
        itemStyle={{
          color: itemTextColor,
          fontSize: itemTextSize
        }}
        selectedValue={selectedValue}
        onValueChange={onItemSelected}>
        {data.map(item => {
          return <RCTWheelPicker.Item key={item} label={item} value={item} />;
        })}
      </RCTWheelPicker>
    </View>
  );
};
