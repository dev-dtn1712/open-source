import React from 'react';
import { Text } from 'react-native';
import { storiesOf } from '@storybook/react-native';

import { HorizontalStack } from './HorizontalStack';

storiesOf('HorizontalStack', module)
  .add('default', () => (
    <HorizontalStack>
      <Text>Page 1</Text>
      <Text>Page 2</Text>
      <Text>Page 3</Text>
    </HorizontalStack>
  ))
  .add('five pages', () => (
    <HorizontalStack>
      <Text>Page 1</Text>
      <Text>Page 2</Text>
      <Text>Page 3</Text>
      <Text>Page 4</Text>
      <Text>Page 5</Text>
    </HorizontalStack>
  ))
  .add('no breadcrumbs', () => (
    <HorizontalStack showBreadcrumbs={false}>
      <Text>Page 1</Text>
      <Text>Page 2</Text>
      <Text>Page 3</Text>
    </HorizontalStack>
  ))
  .add('red highlight', () => (
    <HorizontalStack highlight="red">
      <Text>Page 1</Text>
      <Text>Page 2</Text>
      <Text>Page 3</Text>
    </HorizontalStack>
  ))
  .add('blue and red highlights', () => (
    <HorizontalStack highlight={['blue', 'red']}>
      <Text>Page 1</Text>
      <Text>Page 2</Text>
      <Text>Page 3</Text>
      <Text>Page 4</Text>
    </HorizontalStack>
  ))
  .add('onPage handler', () => (
    // eslint-disable-next-line no-alert
    <HorizontalStack onPage={page => window.alert(`Page: ${page}`)}>
      <Text>Page 1</Text>
      <Text>Page 2</Text>
      <Text>Page 3</Text>
    </HorizontalStack>
  ))
  .add('orange wrapper', () => (
    <HorizontalStack wrapperStyle={{ backgroundColor: 'orange' }}>
      <Text>Page 1</Text>
      <Text>Page 2</Text>
      <Text>Page 3</Text>
    </HorizontalStack>
  ))
  .add('top aligned pages', () => (
    <HorizontalStack pageStyle={{ justifyContent: 'flex-start' }}>
      <Text>Page 1</Text>
      <Text>Page 2</Text>
      <Text>Page 3</Text>
    </HorizontalStack>
  ));
