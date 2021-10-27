import React from 'react';
import { View, requireNativeComponent } from 'react-native';

import { APP_BRIGHT_GRAY, APP_DIVIDER_GRAY, APP_DARK_GRAY } from '../../Themes';
import { omitTestIds, pickTestIds } from '../../Utils';

const RCTWheelPicker = requireNativeComponent('RCTWheelPicker');

const normalizeIndex = (rawIndex, nonInclusiveLimit) => {
  const index = Number(rawIndex);

  if (Number.isNaN(index)) {
    return 0;
  }
  if (index < 0) {
    return 0;
  }
  if (index >= nonInclusiveLimit) {
    return nonInclusiveLimit - 1;
  }
  return index;
};

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
  const normalizedIndex = normalizeIndex(selectedItem, data.length);

  const onItemSelected = event => {
    const selectedIndex = event.nativeEvent.position;
    if (onSelect) {
      onSelect(selectedIndex);
    }
  };

  return (
    <View style={containerStyle} {...omitTestIds(props)}>
      <RCTWheelPicker
        {...pickTestIds(props)}
        isCyclic={isCyclic}
        style={{ width: '100%', height }}
        data={data}
        selectedItemTextColor={selectedItemTextColor}
        selectedItemTextSize={selectedItemTextSize}
        indicatorWidth={indicatorWidth}
        indicatorColor={indicatorColor}
        hideIndicator={hideIndicator}
        itemTextColor={itemTextColor}
        itemTextSize={itemTextSize}
        selectedItem={normalizedIndex}
        backgroundColor={backgroundColor}
        onChange={onItemSelected}
      />
    </View>
  );
};
