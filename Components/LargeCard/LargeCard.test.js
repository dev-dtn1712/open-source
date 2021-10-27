import { LargeCard } from './LargeCard';
import {
  findChild,
  findText,
  getRenderer,
  getStyle,
  hasText,
  pressTouchable
} from '../../../TestUtils';
import { Images } from '../../Themes';

const renderLargeCard = getRenderer(LargeCard, {
  text: 'Hello, Test!',
  title: 'My Title'
});

describe('LargeCard', () => {
  it('renders', () => {
    expect(renderLargeCard()).toBeTruthy();
  });

  it('calls passed onPress function when pressed', () => {
    const onPress = jest.fn();
    const button = renderLargeCard({ onPress });

    pressTouchable(button);
    expect(onPress).toHaveBeenCalled();
  });

  it('displays text', () => {
    const card = renderLargeCard({ text: 'foo' });
    expect(hasText(card, 'foo')).toEqual(true);
  });

  it('displays title text', () => {
    const card = renderLargeCard({ title: 'fooTitle' });
    expect(hasText(card, 'fooTitle')).toEqual(true);
  });

  it('styles title text', () => {
    const card = renderLargeCard({
      title: 'foo',
      titleStyle: {
        color: '#F00BA4'
      }
    });

    const title = findText(card, 'foo');
    expect(getStyle(title).color).toEqual('#F00BA4');
  });

  it('displays with tag', () => {
    const card = renderLargeCard({ tag: 'Active' });

    const tag = findChild(card, { testID: 'tag' });
    expect(tag).toBeTruthy();
  });

  it('displays with background image', () => {
    const card = renderLargeCard({
      backgroundImage: Images.discoveryBackground
    });

    const backgroundImage = findChild(card, { testID: 'backgroundImage' });
    expect(backgroundImage).toBeTruthy();
  });

  it('overrides default styles with passed styles', () => {
    const card = renderLargeCard({
      style: {
        margin: 10
      }
    });
    const mainWrapper = findChild(card, { testID: 'main' });
    expect(getStyle(mainWrapper).margin).toEqual(10);
  });

  it('passes on any additional props', () => {
    const card = renderLargeCard({ accessibilityHint: 'foo' });
    expect(card.props.accessibilityHint).toEqual('foo');
  });
});
