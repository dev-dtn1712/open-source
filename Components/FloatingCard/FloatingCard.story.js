import React from 'react';
import { Text } from 'react-native';
import { storiesOf } from '@storybook/react-native';

import { FloatingCard } from './FloatingCard';

storiesOf('FloatingCard', module)
  .add('default', () => (
    <FloatingCard>
      <Text>Hello, Floating Card!</Text>
    </FloatingCard>
  ))
  .add('tall', () => (
    <FloatingCard style={{ height: 144 }}>
      <Text>Hello, Floating Card!</Text>
    </FloatingCard>
  ));
