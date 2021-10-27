import React from 'react';
import { storiesOf } from '@storybook/react-native';
import { View } from 'react-native';

import { ContinuumForm } from './ContinuumForm';
import { APP_DARK_GRAY } from '../../Themes';

const RESPONSES = [
  {
    uuid: '1',
    statement: 'Not important',
    vector: [0]
  },
  {
    uuid: '2',
    statement: 'Really important',
    vector: [4]
  }
];

const Container = ({ children }) => {
  return (
    <View style={{ backgroundColor: APP_DARK_GRAY, padding: 30 }}>
      {children}
    </View>
  );
};

const onChange = () => {};

storiesOf('ContinuumForm', module)
  .addDecorator(storyFn => <Container>{storyFn()}</Container>)
  .add('default', () => (
    <ContinuumForm onChange={onChange} steps={5} responses={RESPONSES} />
  ))
  .add('with existing data', () => (
    <ContinuumForm
      onChange={onChange}
      responseData={[{ uuid: '1', bias: 0.25 }]}
      steps={5}
      responses={RESPONSES}
    />
  ));
