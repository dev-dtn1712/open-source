import { ButtonCarousel } from './ButtonCarousel';
import { getRenderer } from '../../../TestUtils';

const renderButtonCarousel = getRenderer(ButtonCarousel, {
  data: ['Carousel 1', 'Carousel 2', 'Carousel 3', 'Carousel 4'],
  onSelected: () => {}
});

describe('ButtonCarousel', () => {
  it('renders', () => {
    expect(renderButtonCarousel()).toBeTruthy();
  });
});
