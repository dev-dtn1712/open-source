import React from 'react';
import { storiesOf } from '@storybook/react-native';
import { View } from 'react-native';

import { Answer } from './Answer';
import { APP_DARK_GRAY } from '../../Themes';

const DEFAULTS = {
  onChange: () => {}
};

const Container = ({ children }) => {
  return <View style={{ backgroundColor: APP_DARK_GRAY }}>{children}</View>;
};

storiesOf('Answer', module)
  .addDecorator(storyFn => <Container>{storyFn()}</Container>)
  .add('default', () => <Answer {...DEFAULTS}>Click Me</Answer>)
  .add('disabled', () => (
    <Answer {...DEFAULTS} disabled>
      Click Me
    </Answer>
  ))
  .add('selected', () => (
    <Answer {...DEFAULTS} isSelected>
      Click Me
    </Answer>
  ));
