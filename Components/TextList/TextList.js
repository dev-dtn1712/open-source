import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Fonts } from '../../Themes';

const DEFAULT_STYLES = StyleSheet.create({
  bullet: {
    ...Fonts.style.normal
  },
  item: {
    ...Fonts.style.normal,
    flex: 1,
    paddingLeft: Fonts.style.normal.fontSize / 2
  },
  row: {
    flexDirection: 'row',
    paddingLeft: Fonts.style.normal.fontSize
  },
  wrapper: {}
});

export const TextList = ({
  bullet = '\u2022',
  bulletStyle,
  children,
  itemStyle,
  ordered = false,
  style,
  rowStyle,
  textStyle,
  ...props
}) => (
  <View style={[DEFAULT_STYLES.wrapper, style]} {...props}>
    {React.Children.map(children, (child, index) => (
      <View testID="row" style={[DEFAULT_STYLES.row, rowStyle]}>
        <Text
          testID="bullet"
          style={[DEFAULT_STYLES.bullet, textStyle, bulletStyle]}>
          {ordered ? `${index + 1}.` : bullet}
        </Text>
        <Text testID="item" style={[DEFAULT_STYLES.item, textStyle, itemStyle]}>
          {child}
        </Text>
      </View>
    ))}
  </View>
);
