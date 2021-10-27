import React from 'react';
import { storiesOf } from '@storybook/react-native';

import { Circle } from './Circle';

const DEFAULTS = {
  color: 'gray',
  size: 25
};

storiesOf('Circle', module)
  .add('default', () => <Circle {...DEFAULTS} />)
  .add('red', () => <Circle {...DEFAULTS} color="red" />)
  .add('small', () => <Circle {...DEFAULTS} size={10} />)
  .add('margin', () => <Circle {...DEFAULTS} style={{ margin: 32 }} />);
