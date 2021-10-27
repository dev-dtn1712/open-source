import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { get, head } from 'lodash';
import { Slider } from '../Slider';
import { APP_WHITE, Fonts } from '../../Themes';
import { pickTestIds, omitTestIds } from '../../Utils';

const DEFAULT_STYLES = StyleSheet.create({
  slider: {
    margin: 0
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  text: {
    color: APP_WHITE,
    ...Fonts.style.normal
  },
  form: {}
});

const toPosition = responseData => get(head(responseData), 'bias', 0.5);
const responseDataBuilder = uuid => bias => [{ uuid, bias }];

export const ContinuumForm = ({
  steps,
  onChange = () => {},
  responses,
  responseData = [],
  style,
  textStyle,
  answersOnly = false,
  ...props
}) => {
  const [position, setPosition] = useState(toPosition(responseData));
  const [leftRT, rightRT] = responses;

  const toResponseData = responseDataBuilder(get(leftRT, 'uuid'));
  const leftLabel = get(leftRT, 'statement');
  const rightLabel = get(rightRT, 'statement');

  // Since we may effectively "set" the bias to 0.5 as a starting position,
  // we should pass that value up on render
  useEffect(() => {
    onChange(toResponseData(position));
  }, []);

  const onSliderValue = bias => {
    setPosition(bias);
    onChange(toResponseData(bias));
  };

  return (
    <View style={[DEFAULT_STYLES.form, style]} {...omitTestIds(props)}>
      <View style={DEFAULT_STYLES.labelContainer}>
        <Text style={[DEFAULT_STYLES.text, textStyle]}>{leftLabel}</Text>
        <Text style={[DEFAULT_STYLES.text, textStyle]}>{rightLabel}</Text>
      </View>
      <Slider
        {...pickTestIds(props)}
        min={0}
        max={1}
        steps={steps}
        value={position}
        style={DEFAULT_STYLES.slider}
        answersOnly={answersOnly}
        onChange={onSliderValue}
      />
    </View>
  );
};
