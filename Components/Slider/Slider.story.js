import React from 'react';
import { storiesOf } from '@storybook/react-native';
import { View } from 'react-native';

import { Slider, SLIDER_GRAVITY } from './Slider';
import { APP_DARK_GRAY } from '../../Themes';

const DEFAULTS = {
  onChange: () => {},
  steps: 10,
  min: 0,
  max: 10,
  value: 5
};

const Container = ({ children }) => {
  return (
    <View style={{ backgroundColor: APP_DARK_GRAY, padding: 30 }}>
      {children}
    </View>
  );
};

storiesOf('Slider', module)
  .addDecorator(storyFn => <Container>{storyFn()}</Container>)
  .add('Middle', () => <Slider {...DEFAULTS} gravity={SLIDER_GRAVITY.MIDDLE} />)
  .add('Left', () => <Slider {...DEFAULTS} gravity={SLIDER_GRAVITY.LOW} />)
  .add('Right', () => <Slider {...DEFAULTS} gravity={SLIDER_GRAVITY.HIGH} />);
