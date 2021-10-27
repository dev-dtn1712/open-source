import React from 'react';
import { View } from 'react-native';
import { storiesOf } from '@storybook/react-native';
import { action } from '@storybook/addon-actions';
import { withKnobs, boolean, color } from '@storybook/addon-knobs';
import { APP_DARK_GRAY, APP_BREADCRUMB_GRAY } from '../../Themes';

import { Input } from './Input';

const Container = ({ children }) => {
  return <View style={{ backgroundColor: APP_DARK_GRAY }}>{children}</View>;
};

storiesOf('Input', module)
  .addDecorator(storyFn => <Container>{storyFn()}</Container>)
  .addDecorator(withKnobs)
  .add('default', () => (
    <Input placeholder="Lovable" onChangeText={action('onChangeText')} />
  ))
  .add('dynamicProps', () => {
    const readOnly = boolean('Read Only', false);
    const placeholderColor = color('PlaceholderColor', APP_BREADCRUMB_GRAY);
    return (
      <Input readOnly={readOnly} placeholderTextColor={placeholderColor} />
    );
  });
