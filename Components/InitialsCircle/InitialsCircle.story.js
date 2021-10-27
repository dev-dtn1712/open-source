import React from 'react';
import { storiesOf } from '@storybook/react-native';

import { InitialsCircle } from './InitialsCircle';

const DEFAULTS = {
  text: 'Foo'
};

storiesOf('InitialsCircle', module)
  .add('default', () => <InitialsCircle {...DEFAULTS} />)
  .add('big', () => <InitialsCircle {...DEFAULTS} size={140} />)
  .add('green', () => (
    <InitialsCircle {...DEFAULTS} style={{ backgroundColor: 'green' }} />
  ))
  .add('small text', () => (
    <InitialsCircle {...DEFAULTS} textStyle={{ fontSize: 14 }} />
  ));
