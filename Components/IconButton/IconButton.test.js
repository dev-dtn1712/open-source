import { IconButton } from './IconButton';
import {
  findChild,
  getRenderer,
  getStyle,
  getText,
  hasText,
  pressTouchable
} from '../../../TestUtils';

const renderIconButton = getRenderer(IconButton, {
  icon: 'menu',
  onPress: () => {}
});

describe('IconButton', () => {
  it('renders', () => {
    expect(renderIconButton()).toBeTruthy();
  });

  it('displays a Material icon with the passed name', () => {
    const button = renderIconButton({ icon: 'add' });

    // U+E145 is the unicode char MaterialIcons uses to represent "add"
    expect(getText(button)).toEqual('\ue145');
  });

  it('applies size to the icon', () => {
    const button = renderIconButton({ size: 42 });
    const icon = findChild(button, { testID: 'icon' });

    expect(getStyle(icon).fontSize).toEqual(42);
  });

  it('displays a text label', () => {
    const button = renderIconButton({ label: 'foo' });
    expect(hasText(button, 'foo')).toEqual(true);
  });

  it('applies color to both icon and any label', () => {
    const button = renderIconButton({ color: '#F00BA4', label: 'foo' });
    const icon = findChild(button, { testID: 'icon' });
    const label = findChild(button, { testID: 'label' });

    expect(getStyle(icon).color).toEqual('#F00BA4');
    expect(getStyle(label).color).toEqual('#F00BA4');
  });

  it('calls passed onPress function when pressed', () => {
    const onPress = jest.fn();
    const button = renderIconButton({ onPress });

    pressTouchable(button);

    expect(onPress).toHaveBeenCalled();
  });

  it('overrides default styles with passed styles', () => {
    const button = renderIconButton({
      style: {
        backgroundColor: '#F00BA4'
      }
    });

    expect(getStyle(button).backgroundColor).toEqual('#F00BA4');
  });

  it('overrides default icon styles with passed icon styles', () => {
    const button = renderIconButton({
      iconStyle: {
        margin: 42
      }
    });

    const icon = findChild(button, { testID: 'icon' });
    expect(getStyle(icon).margin).toEqual(42);
  });

  it('overrides default label styles with passed label styles', () => {
    const button = renderIconButton({
      label: 'foo',
      labelStyle: {
        color: '#F00BA4'
      }
    });

    const label = findChild(button, { testID: 'label' });
    expect(getStyle(label).color).toEqual('#F00BA4');
  });

  it('passes on any additional props', () => {
    const button = renderIconButton({ accessibilityHint: 'foo' });
    expect(button.props.accessibilityHint).toEqual('foo');
  });
});
