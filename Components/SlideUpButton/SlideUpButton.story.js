import React from 'react';
import { storiesOf } from '@storybook/react-native';
import { withKnobs, boolean } from '@storybook/addon-knobs';

import { SlideUpButton } from './SlideUpButton';

const DEFAULTS = {
  title: 'Save',
  coverScreen: false,
  isVisible: true
};

storiesOf('SlideUpButton', module)
  .addDecorator(withKnobs)
  .add('default', () => <SlideUpButton {...DEFAULTS} />)
  .add('animated', () => {
    const isVisible = boolean('Show', true);
    return (
      <SlideUpButton title="Next" isVisible={isVisible} coverScreen={false} />
    );
  });
