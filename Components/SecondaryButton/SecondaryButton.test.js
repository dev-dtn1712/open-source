import { SecondaryButton } from './SecondaryButton';
import { getRenderer, getStyle } from '../../../TestUtils';

const renderSecondaryButton = getRenderer(SecondaryButton, {
  children: 'Hello, Test!',
  onPress: () => {}
});

describe('SecondaryButton', () => {
  it('renders', () => {
    expect(renderSecondaryButton()).toBeTruthy();
  });

  it('overrides default styles with passed styles', () => {
    const button = renderSecondaryButton({
      style: {
        backgroundColor: '#F00BA4'
      }
    });

    expect(getStyle(button).backgroundColor).toEqual('#F00BA4');
  });

  it('overrides default text styles with passed text styles', () => {
    const button = renderSecondaryButton({
      textStyle: {
        color: '#F00BA4'
      }
    });
    const child = button.children[0];

    expect(child.type).toEqual('Text');
    expect(getStyle(child).color).toEqual('#F00BA4');
  });

  it('passes on any additional props', () => {
    const button = renderSecondaryButton({ accessibilityHint: 'foo' });
    expect(button.props.accessibilityHint).toEqual('foo');
  });
});
