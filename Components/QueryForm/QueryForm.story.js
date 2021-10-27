import React from 'react';
import { storiesOf } from '@storybook/react-native';

import { QueryForm } from './QueryForm';

const POLYADIC_QUERY = {
  uuid: '0',
  title: 'Hello, title of my query!',
  statement: 'Hello, statement about my query!',
  hint: '',
  prompt: '',
  queryRule: {
    type: 'polyadic',
    min: 1,
    max: 2
  },
  responses: [
    {
      uuid: '1',
      statement: 'Hello, first response to my query!'
    },
    {
      uuid: '2',
      statement: 'Hello, second response to my query!'
    },
    {
      uuid: '3',
      statement: 'Hello, third response to my query!'
    }
  ]
};

const BINARY_QUERY = {
  uuid: '0',
  title: 'Hello, title of my query!',
  statement: 'Hello, statement about my query!',
  hint: '',
  prompt: '',
  queryRule: {
    type: 'binary'
  },
  responses: [
    {
      uuid: '1',
      statement: 'Hello, first response to my query!'
    },
    {
      uuid: '2',
      statement: 'Hello, second response to my query!'
    }
  ]
};

const CONTINUUM_QUERY = {
  uuid: '0',
  title: 'Hello, title of my query!',
  statement: 'Hello, statement about my query!',
  hint: '',
  prompt: '',
  queryRule: {
    type: 'continuum',
    steps: 5,
    style: 'stepped',
    gravity: 'middle'
  },
  responses: [
    {
      uuid: '1',
      statement: 'Not important',
      vector: 0
    },
    {
      uuid: '2',
      statement: 'Really important',
      vector: 5
    }
  ]
};

const onChange = responseData => {
  // eslint-disable-next-line no-alert
  window.alert(`New response data:\n${JSON.stringify(responseData, null, 2)}`);
};

storiesOf('QueryForm', module)
  .add('polyadic', () => (
    <QueryForm onChange={onChange} query={POLYADIC_QUERY} />
  ))
  .add('binary', () => <QueryForm onChange={onChange} query={BINARY_QUERY} />)
  .add('continuum', () => (
    <QueryForm onChange={onChange} query={CONTINUUM_QUERY} />
  ))
  .add('with existing data', () => (
    <QueryForm
      onChange={onChange}
      query={BINARY_QUERY}
      responseData={[{ uuid: '2' }]}
    />
  ));
