import React from 'react';
import { View } from 'react-native';
import { storiesOf } from '@storybook/react-native';

import { Pulsar } from './Pulsar';
import { APP_DARK_GRAY } from '../../Themes';

const Container = ({ children }) => (
  <View
    style={{
      alignItems: 'center',
      backgroundColor: APP_DARK_GRAY,
      flex: 1,
      justifyContent: 'center'
    }}>
    {children}
  </View>
);

storiesOf('Pulsar', module)
  .add('default', () => (
    <Container>
      <Pulsar />
    </Container>
  ))
  .add('one', () => (
    <Container>
      <Pulsar count={1} />
    </Container>
  ))
  .add('fast', () => (
    <Container>
      <Pulsar delay={500} duration={1000} interval={100} />
    </Container>
  ))
  .add('small', () => (
    <Container>
      <Pulsar startSize={10} endSize={100} />
    </Container>
  ))
  .add('fade in', () => (
    <Container>
      <Pulsar count={1} startOpacity={0} endOpacity={1} />
    </Container>
  ))
  .add('red', () => (
    <Container>
      <Pulsar style={{ backgroundColor: 'red' }} />
    </Container>
  ));
