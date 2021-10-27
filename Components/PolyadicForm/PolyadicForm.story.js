import React from 'react';
import { storiesOf } from '@storybook/react-native';

import { PolyadicForm } from './PolyadicForm';

const RESPONSES = [
  { uuid: '1', statement: 'Yesterday' },
  { uuid: '2', statement: 'Today' },
  { uuid: '3', statement: 'Tomorrow' },
  { uuid: '4', statement: 'Never' }
];

const onChange = responseData => {
  // eslint-disable-next-line no-alert
  window.alert(`New response data:\n${JSON.stringify(responseData, null, 2)}`);
};

storiesOf('PolyadicForm', module)
  .add('default', () => (
    <PolyadicForm max={2} onChange={onChange} responses={RESPONSES} />
  ))
  .add('with existing data', () => (
    <PolyadicForm
      max={2}
      onChange={onChange}
      responseData={[{ uuid: '3' }]}
      responses={RESPONSES}
    />
  ));
