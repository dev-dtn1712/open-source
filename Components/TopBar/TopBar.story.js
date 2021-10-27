import React from 'react';
import { storiesOf } from '@storybook/react-native';
import { action } from '@storybook/addon-actions';

import { TopBar } from './TopBar';

const DEFAULTS = {
  title: 'My Title',
  leftItemLabel: 'Back'
};

storiesOf('TopBar', module)
  .add('default', () => <TopBar {...DEFAULTS} />)
  .add('with Right item', () => (
    <TopBar
      {...DEFAULTS}
      rightItemLabel="Skip"
      onPressRightItem={action('onPressSkip')}
    />
  ))
  .add('with Dots', () => (
    <TopBar
      {...DEFAULTS}
      rightItemIcon="more-vert"
      onPressRightItem={action('onPressMore')}
    />
  ))
  .add('with Long Title', () => (
    <TopBar
      title="Social distance checkoup valid blablabla blablabal"
      leftItemLabel="Intents"
      rightItemIcon="more-vert"
      onPressLeftItem={action('onPressLeft')}
      onPressRightItem={action('onPressSkip')}
    />
  ));
