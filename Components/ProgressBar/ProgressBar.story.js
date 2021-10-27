import React from 'react';
import { storiesOf } from '@storybook/react-native';

import { ProgressBar } from './ProgressBar';

storiesOf('ProgressBar', module)
  .add('50%', () => <ProgressBar progress={0.5} />)
  .add('0%', () => <ProgressBar progress={0} />)
  .add('100%', () => <ProgressBar progress={1} />)
  .add('buffer', () => <ProgressBar buffer={0.08} progress={0} />)
  .add('red', () => <ProgressBar barProps={{ color: 'red' }} progress={0.5} />)
  .add('gray background', () => (
    <ProgressBar backgroundStyle={{ backgroundColor: '#DDD' }} progress={0.5} />
  ))
  .add('tall', () => <ProgressBar progress={0.5} style={{ height: 20 }} />);
