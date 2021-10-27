import React from 'react';
import { storiesOf } from '@storybook/react-native';
import { APP_BLUE } from '../../Themes';

import { ProgressHUD } from './ProgressHUD';

const DEFAULTS = {
  isVisible: true,
  text: 'Loading'
};

storiesOf('ProgressHUD', module)
  .add('default', () => <ProgressHUD {...DEFAULTS} coverScreen={false} />)
  .add('backdrop', () => (
    <ProgressHUD {...DEFAULTS} hasBackdrop coverScreen={false} />
  ))
  .add('blue activity color', () => (
    <ProgressHUD
      {...DEFAULTS}
      activityColor={APP_BLUE}
      titleStyle={{ color: APP_BLUE }}
      coverScreen={false}
    />
  ))
  .add('activity text', () => (
    <ProgressHUD {...DEFAULTS} title="Please Wait..." coverScreen={false} />
  ));
