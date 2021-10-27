import React from 'react';
import { storiesOf } from '@storybook/react-native';

import { SmallCard } from './SmallCard';
import { Images } from '../../Themes';

const DEFAULTS = {
  title: 'Deal Makers',
  text: 'Define which values, beliefs, or expectations are negotiable.',
  tag: 'STEP ONE',
  tagColor: 'mediumpurple'
};

storiesOf('SmallCard', module)
  .add('default', () => <SmallCard {...DEFAULTS} />)
  .add('locked status', () => <SmallCard {...DEFAULTS} isLocked />)
  .add('complete status', () => (
    <SmallCard {...DEFAULTS} statusImage={Images.iconComplete} />
  ))
  .add('in-progress status', () => (
    <SmallCard {...DEFAULTS} statusImage={Images.iconInProgress} />
  ))
  .add('pink tag', () => <SmallCard {...DEFAULTS} tagColor="pink" />);
