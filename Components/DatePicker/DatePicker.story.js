import React from 'react';
import { storiesOf } from '@storybook/react-native';

import { DatePicker } from './DatePicker';

const DEFAULTS = {
  // eslint-disable-next-line no-alert
  onDate: date => window.alert(`New date: ${JSON.stringify(date)}`)
};

storiesOf('DatePicker', module)
  .add('default', () => <DatePicker {...DEFAULTS} />)
  .add('start at 1900', () => (
    <DatePicker {...DEFAULTS} date={new Date().setYear(1900)} />
  ))
  .add('2018 and later', () => (
    <DatePicker {...DEFAULTS} minimumDate={new Date(2018, 0)} />
  ))
  .add('fade to white', () => (
    <DatePicker
      {...DEFAULTS}
      fadeToColor="#EEEEEE"
      style={{ backgroundColor: '#FFFFFF' }}
      textColor="#000000"
    />
  ));
