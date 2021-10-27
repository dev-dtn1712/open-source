import React from 'react';
import { storiesOf } from '@storybook/react-native';

import { LargeCard } from './LargeCard';
import { Images } from '../../Themes';

const DEFAULTS = {
  image: Images.iconLocked,
  title: 'Something Casual',
  text:
    'You could commit if you meet the right person. But in the meantime, you want to take things slow.'
};

storiesOf('LargeCard', module)
  .add('default', () => <LargeCard {...DEFAULTS} />)
  .add('with right tag', () => (
    <LargeCard {...DEFAULTS} tag="ACTIVE" tagAlign="right" tagColor="red" />
  ))
  .add('with left tag', () => (
    <LargeCard
      title={DEFAULTS.title}
      text={DEFAULTS.text}
      tagColor="red"
      tag="FIRST STEP"
    />
  ))
  .add('red background', () => (
    <LargeCard {...DEFAULTS} style={{ backgroundColor: 'red' }} />
  ))
  .add('with background image', () => (
    <LargeCard
      {...DEFAULTS}
      backgroundImage={Images.discoveryBackground}
      backgroundImageResizeMode="stretch"
    />
  ));
