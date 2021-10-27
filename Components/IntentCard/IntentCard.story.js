import React from 'react';
import { storiesOf } from '@storybook/react-native';
import { View } from 'react-native';

import { IntentCard } from './IntentCard';
import { APP_DARK_GRAY, APP_GREEN, APP_RED, APP_PURPLE } from '../../Themes';

const DEFAULTS = {
  onPress: () => {},
  onToggle: () => {}
};

const Container = ({ children }) => {
  return <View style={{ backgroundColor: APP_DARK_GRAY }}>{children}</View>;
};

storiesOf('IntentCard', module)
  .addDecorator(storyFn => <Container>{storyFn()}</Container>)
  .add('Switch On', () => (
    <IntentCard
      {...DEFAULTS}
      glyph="😘"
      title="Short Term Dating"
      style={{ backgroundColor: APP_GREEN }}
      isShared
    />
  ))
  .add('Switch Off', () => (
    <IntentCard
      {...DEFAULTS}
      glyph="🍆"
      title="Hookups"
      style={{ backgroundColor: APP_PURPLE }}
    />
  ))
  .add('No Sharing Switch', () => (
    <IntentCard
      {...DEFAULTS}
      glyph="💍"
      title="Serious Dating"
      style={{ backgroundColor: APP_RED }}
      intentSharing={false}
    />
  ));
