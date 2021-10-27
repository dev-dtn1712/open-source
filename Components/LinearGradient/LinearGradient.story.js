import React from 'react';
import { Text } from 'react-native';
import { storiesOf } from '@storybook/react-native';

import { LinearGradient } from './LinearGradient';

const DEFAULT_STYLES = {
  height: 150,
  width: '100%'
};

storiesOf('LinearGradient', module)
  .add('default', () => <LinearGradient style={DEFAULT_STYLES} />)
  .add('black to white', () => (
    <LinearGradient colors={['#000000', '#FFFFFF']} style={DEFAULT_STYLES} />
  ))
  .add('vertical', () => (
    <LinearGradient
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={DEFAULT_STYLES}
    />
  ))
  .add('scrunched', () => (
    <LinearGradient locations={[0.4, 0.6]} style={DEFAULT_STYLES} />
  ))
  .add('single color', () => (
    <LinearGradient colors={['red']} style={DEFAULT_STYLES} />
  ))
  .add('with text', () => (
    <LinearGradient
      style={{
        ...DEFAULT_STYLES,
        alignItems: 'center',
        justifyContent: 'center'
      }}>
      <Text style={{ color: 'white', fontWeight: 'bold' }}>
        Hello, Gradient!
      </Text>
    </LinearGradient>
  ));
