import React from 'react';
import { storiesOf } from '@storybook/react-native';

import { Button } from './Button';

const DEFAULTS = {
  // eslint-disable-next-line no-alert
  onPress: () => window.alert('Pressed!')
};

storiesOf('Button', module)
  .add('default', () => <Button {...DEFAULTS}>Click Me</Button>)
  .add('disabled', () => (
    <Button {...DEFAULTS} disabled>
      Click Me
    </Button>
  ))
  .add('red', () => (
    <Button {...DEFAULTS} style={{ backgroundColor: 'red' }}>
      Click Me
    </Button>
  ))
  .add('orange text', () => (
    <Button {...DEFAULTS} textStyle={{ color: 'orange' }}>
      Click Me
    </Button>
  ));
