import React from 'react';
import { Text } from 'react-native';
import { storiesOf } from '@storybook/react-native';

import { Header } from './Header';
import { APP_WHITE, Images } from '../../Themes';

const DEFAULTS = {
  title: 'My Title'
};

storiesOf('Header', module)
  .add('default', () => <Header {...DEFAULTS} />)
  .add('with background', () => (
    <Header
      {...DEFAULTS}
      headerHeight={200}
      backgroundImage={Images.onboardFind}
    />
  ))
  .add('with child', () => (
    <Header
      headerHeight={200}
      bodyStyle={{
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center'
      }}
      backgroundImage={Images.onboardFind}>
      <Text style={{ color: APP_WHITE }}>Top texts</Text>
      <Text style={{ color: APP_WHITE }}>Bottom texts</Text>
    </Header>
  ));
