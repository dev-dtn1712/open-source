import React from 'react';
import { storiesOf } from '@storybook/react-native';

import { SecondaryButton } from './SecondaryButton';

const DEFAULTS = {
  // eslint-disable-next-line no-alert
  onPress: () => window.alert('Pressed!')
};

storiesOf('SecondaryButton', module)
  .add('default', () => (
    <SecondaryButton {...DEFAULTS}>Click Me</SecondaryButton>
  ))
  .add('disabled', () => (
    <SecondaryButton {...DEFAULTS} disabled>
      Click Me
    </SecondaryButton>
  ))
  .add('red text', () => (
    <SecondaryButton {...DEFAULTS} textStyle={{ color: 'red' }}>
      Click Me
    </SecondaryButton>
  ));
