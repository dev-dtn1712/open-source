import { SmallCard } from './SmallCard';
import {
  findChild,
  findText,
  getRenderer,
  getStyle,
  hasText,
  pressTouchable
} from '../../../TestUtils';
import { APP_DISABLED_CARD } from '../../Themes';

const renderSmallCard = getRenderer(SmallCard, {
  title: 'Deal Makers',
  text: 'Define which values, beliefs, or expectations are negotiable.'
});

describe('SmallCard', () => {
  it('renders', () => {
    expect(renderSmallCard()).toBeTruthy();
  });

  it('calls passed onPress function when pressed', () => {
    const onPress = jest.fn();
    const button = renderSmallCard({ onPress });

    pressTouchable(button);
    expect(onPress).toHaveBeenCalled();
  });

  it('displays locked status', () => {
    const card = renderSmallCard({ isLocked: true });

    const statusImage = findChild(card, { testID: 'statusImage' });
    expect(statusImage).toBeTruthy();

    const mainWrapper = findChild(card, { testID: 'main' });
    expect(getStyle(mainWrapper).backgroundColor).toEqual(APP_DISABLED_CARD);
  });

  it('displays text', () => {
    const card = renderSmallCard({ text: 'foo' });
    expect(hasText(card, 'foo')).toEqual(true);
  });

  it('displays title text', () => {
    const card = renderSmallCard({ title: 'fooTitle' });
    expect(hasText(card, 'fooTitle')).toEqual(true);
  });

  it('styles title text', () => {
    const card = renderSmallCard({
      title: 'foo',
      titleStyle: {
        color: '#F00BA4'
      }
    });

    const title = findText(card, 'foo');
    expect(getStyle(title).color).toEqual('#F00BA4');
  });

  it('displays with tag', () => {
    const card = renderSmallCard({ tag: 'Active' });

    const tag = findChild(card, { testID: 'tag' });
    expect(tag).toBeTruthy();
  });

  it('overrides default styles with passed styles', () => {
    const card = renderSmallCard({
      style: {
        margin: 10
      }
    });
    const mainWrapper = findChild(card, { testID: 'main' });
    expect(getStyle(mainWrapper).margin).toEqual(10);
  });

  it('passes on any additional props', () => {
    const card = renderSmallCard({ accessibilityHint: 'foo' });
    expect(card.props.accessibilityHint).toEqual('foo');
  });
});
