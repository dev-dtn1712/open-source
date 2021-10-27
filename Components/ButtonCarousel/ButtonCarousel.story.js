import React from 'react';
import { storiesOf } from '@storybook/react-native';

import { ButtonCarousel } from './ButtonCarousel';

const DEFAULTS = {
  // eslint-disable-next-line no-alert
  onSelected: index => window.alert(`Pressed item at ${index}`)
};

storiesOf('ButtonCarousel', module)
  .add('One Item', () => (
    <ButtonCarousel
      {...DEFAULTS}
      data={[{ statement: 'Carousel 1', isCompleted: false }]}
    />
  ))
  .add('Four Items', () => (
    <ButtonCarousel
      {...DEFAULTS}
      data={[
        { statement: 'Carousel 1', isCompleted: false },
        { statement: 'Carousel 2', isCompleted: false },
        { statement: 'Carousel 3', isCompleted: false },
        { statement: 'Carousel 4', isCompleted: false }
      ]}
    />
  ))
  .add('Nine Items', () => (
    <ButtonCarousel
      {...DEFAULTS}
      data={[
        { statement: 'Carousel 1', isCompleted: false },
        { statement: 'Carousel 2', isCompleted: false },
        { statement: 'Carousel 3', isCompleted: false },
        { statement: 'Carousel 4', isCompleted: false },
        { statement: 'Carousel 5', isCompleted: false },
        { statement: 'Carousel 6', isCompleted: false },
        { statement: 'Carousel 7', isCompleted: false },
        { statement: 'Carousel 8', isCompleted: false },
        { statement: 'Carousel 9', isCompleted: false }
      ]}
    />
  ))
  .add('Complete Status', () => (
    <ButtonCarousel
      {...DEFAULTS}
      data={[
        { statement: 'Carousel 1', isCompleted: false },
        { statement: 'Carousel 2', isCompleted: true },
        { statement: 'Carousel 3', isCompleted: false },
        { statement: 'Carousel 4', isCompleted: true },
        { statement: 'Carousel 5', isCompleted: false },
        { statement: 'Carousel 6', isCompleted: false },
        { statement: 'Carousel 7', isCompleted: true },
        { statement: 'Carousel 8', isCompleted: false },
        { statement: 'Carousel 9', isCompleted: false }
      ]}
    />
  ));
