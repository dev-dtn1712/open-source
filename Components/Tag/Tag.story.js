import React from 'react';
import { storiesOf } from '@storybook/react-native';

import { Tag } from './Tag';

const DEFAULTS = {
  color: 'green',
  text: 'ACTIVE'
};

storiesOf('Tag', module)
  .add('default', () => <Tag {...DEFAULTS} />)
  .add('red', () => <Tag {...DEFAULTS} color="red" />)
  .add('right', () => (
    <Tag {...DEFAULTS} align="right" style={{ margin: 32 }} />
  ));
