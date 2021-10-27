import React from 'react';
import { storiesOf } from '@storybook/react-native';
import { View } from 'react-native';

import { IntentConnectingCard } from './IntentConnectingCard';
import { APP_DARK_GRAY } from '../../Themes';

const DEFAULTS = {
  onPress: () => {},
  onToggle: () => {}
};

const Container = ({ children }) => {
  return <View style={{ backgroundColor: APP_DARK_GRAY }}>{children}</View>;
};

storiesOf('IntentConnectingCard', module)
  .addDecorator(storyFn => <Container>{storyFn()}</Container>)
  .add('default', () => (
    <IntentConnectingCard {...DEFAULTS} glyph="😘" title="Short Term Dating" />
  ))
  .add('Long title', () => (
    <IntentConnectingCard
      {...DEFAULTS}
      glyph="🍆"
      title="Social distancing hookup wfwfwfwelfw long blablbalbal wfwfw"
    />
  ));
