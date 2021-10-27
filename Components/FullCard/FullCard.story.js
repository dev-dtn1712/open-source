import React from 'react';
import { Text } from 'react-native';
import { storiesOf } from '@storybook/react-native';

import { FullCard } from './FullCard';
import { Images } from '../../Themes';

const DEFAULTS = {
  image: Images.girlLongBrown,
  title: 'My Title'
};

storiesOf('FullCard', module)
  .add('default', () => <FullCard {...DEFAULTS}> My Description...</FullCard>)
  .add('footer', () => (
    <FullCard {...DEFAULTS} footer={<Text>My Footer</Text>}>
      My Description...
    </FullCard>
  ))
  .add('centered footer', () => (
    <FullCard
      {...DEFAULTS}
      footer={<Text>My Footer</Text>}
      footerStyle={{ alignItems: 'center' }}>
      My Description...
    </FullCard>
  ))
  .add('circle image', () => (
    <FullCard {...DEFAULTS} imageStyle={{ borderRadius: 100 }}>
      My Description...
    </FullCard>
  ))
  .add('padded image', () => (
    <FullCard {...DEFAULTS} imageWrapperStyle={{ paddingVertical: 100 }}>
      My Description...
    </FullCard>
  ))
  .add('red title', () => (
    <FullCard {...DEFAULTS} titleStyle={{ color: 'red' }}>
      My Description...
    </FullCard>
  ))
  .add('red text', () => (
    <FullCard {...DEFAULTS} textStyle={{ color: 'red' }}>
      My Description...
    </FullCard>
  ))
  .add('padded text', () => (
    <FullCard {...DEFAULTS} bodyStyle={{ paddingVertical: 100 }}>
      My Description...
    </FullCard>
  ))
  .add('red background', () => (
    <FullCard {...DEFAULTS} style={{ backgroundColor: 'red' }}>
      My Description...
    </FullCard>
  ));
