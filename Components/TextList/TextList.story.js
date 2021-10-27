import React from 'react';
import { storiesOf } from '@storybook/react-native';

import { TextList } from './TextList';

storiesOf('TextList', module)
  .add('default', () => <TextList>Foo</TextList>)
  .add('ordered', () => <TextList ordered>Foo</TextList>)
  .add('custom bullet', () => <TextList bullet={'\u2023'}>Foo</TextList>)
  .add('multiple items', () => <TextList>{['Foo', 'Bar', 'Baz']}</TextList>)
  .add('wrapped line', () => (
    <TextList>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
      tempor incididunt ut labore et dolore magna aliqua
    </TextList>
  ));
