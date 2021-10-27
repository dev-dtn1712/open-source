import React from 'react';
import { storiesOf } from '@storybook/react-native';

import { IconButton } from './IconButton';

const DEFAULTS = {
  icon: 'menu',
  // eslint-disable-next-line no-alert
  onPress: () => window.alert('Pressed!')
};

storiesOf('IconButton', module)
  .add('default', () => <IconButton {...DEFAULTS} />)
  .add('settings', () => <IconButton {...DEFAULTS} icon="settings" />)
  .add('back', () => (
    <IconButton {...DEFAULTS} icon="arrow-back" label="Back" />
  ))
  .add('disabled', () => <IconButton {...DEFAULTS} disabled />)
  .add('red', () => <IconButton {...DEFAULTS} color="red" />)
  .add('big', () => <IconButton {...DEFAULTS} size={60} />)
  .add('orange background', () => (
    <IconButton {...DEFAULTS} style={{ backgroundColor: 'orange' }} />
  ));
