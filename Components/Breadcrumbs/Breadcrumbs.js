import React from 'react';
import { StyleSheet, View } from 'react-native';
import range from 'lodash/range';

import { Circle } from '../Circle';
import { APP_BREADCRUMB_GRAY, APP_DIVIDER_GRAY } from '../../Themes';

const DEFAULT_STYLE = StyleSheet.create({
  view: {
    borderRadius: 6,
    alignContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around'
  }
});

export const Breadcrumbs = ({
  color = APP_BREADCRUMB_GRAY,
  count,
  highlight = APP_DIVIDER_GRAY,
  selected,
  size,
  spacing,
  style,
  ...props
}) => {
  const crumbSpace = 2 * spacing + size;
  const sizeStyle = {
    height: crumbSpace,
    width: count * crumbSpace
  };

  return (
    <View {...props} style={[DEFAULT_STYLE.view, sizeStyle, style]}>
      {range(count).map(index => (
        <Circle
          color={index === selected ? highlight : color}
          key={index}
          size={size}
        />
      ))}
    </View>
  );
};
