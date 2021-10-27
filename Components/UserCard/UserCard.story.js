import React from 'react';
import { storiesOf } from '@storybook/react-native';

import { UserCard } from './UserCard';

storiesOf('UserCard', module).add('default', () => (
  <UserCard username="Alice" memberSince={2018} />
));
