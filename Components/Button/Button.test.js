import { Button } from './Button';
import {
  getRenderer,
  getStyle,
  getText,
  pressTouchable
} from '../../../TestUtils';

const renderButton = getRenderer(Button, {
  children: 'Hello, Test!',
  onPress: () => {}
});

describe('Button', () => {
  it('renders', () => {
    expect(renderButton()).toBeTruthy();
  });

  it('displays passed children as text', () => {
    const button = renderButton({ children: 'foo' });
    expect(getText(button)).toEqual('foo');
  });

  it('calls passed onPress function when pressed', () => {
    const onPress = jest.fn();
    const button = renderButton({ onPress });

    pressTouchable(button);

    expect(onPress).toHaveBeenCalled();
  });

  it('overrides default styles with passed styles', () => {
    const button = renderButton({
      style: {
        backgroundColor: '#F00BA4'
      }
    });

    expect(getStyle(button).backgroundColor).toEqual('#F00BA4');
  });

  it('overrides default text styles with passed text styles', () => {
    const button = renderButton({
      textStyle: {
        color: '#F00BA4'
      }
    });
    const child = button.children[0];

    expect(child.type).toEqual('Text');
    expect(getStyle(child).color).toEqual('#F00BA4');
  });

  it('passes on any additional props', () => {
    const button = renderButton({ accessibilityHint: 'foo' });
    expect(button.props.accessibilityHint).toEqual('foo');
  });
});
