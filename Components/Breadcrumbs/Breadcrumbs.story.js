import React from 'react';
import { storiesOf } from '@storybook/react-native';

import { Breadcrumbs } from './Breadcrumbs';

const DEFAULTS = {
  count: 3,
  selected: 0,
  size: 9,
  spacing: 7
};

storiesOf('Breadcrumbs', module)
  .add('default', () => <Breadcrumbs {...DEFAULTS} />)
  .add('select last', () => <Breadcrumbs {...DEFAULTS} selected={2} />)
  .add('five', () => <Breadcrumbs {...DEFAULTS} count={5} />)
  .add('big', () => <Breadcrumbs {...DEFAULTS} size={18} />)
  .add('spread out', () => <Breadcrumbs {...DEFAULTS} spacing={14} />)
  .add('red crumbs', () => <Breadcrumbs {...DEFAULTS} color="red" />)
  .add('red highlight', () => <Breadcrumbs {...DEFAULTS} highlight="red" />)
  .add('margin', () => <Breadcrumbs {...DEFAULTS} style={{ margin: 32 }} />);
