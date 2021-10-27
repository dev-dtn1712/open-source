import { Circle } from './Circle';
import { getRenderer, getStyle } from '../../../TestUtils';

const renderCircle = getRenderer(Circle, { color: 'red', size: 10 });

describe('Circle', () => {
  it('renders', () => {
    expect(renderCircle()).toBeTruthy();
  });

  it('creates a circular view of the correct size', () => {
    const circle = renderCircle({ size: 42 });
    const { width, height, borderRadius } = getStyle(circle);

    expect(width).toEqual(42);
    expect(height).toEqual(42);
    expect(borderRadius).toEqual(42);
  });

  it('accepts a custom color', () => {
    const circle = renderCircle({ color: '#F00BA4' });
    const { backgroundColor } = getStyle(circle);

    expect(backgroundColor).toEqual('#F00BA4');
  });

  it('overrides default styles with passed styles', () => {
    const circle = renderCircle({
      style: {
        margin: 10
      }
    });
    const { margin } = getStyle(circle);

    expect(margin).toEqual(10);
  });

  it('passes on any additional props', () => {
    const circle = renderCircle({ accessibilityHint: 'foo' });
    expect(circle.props.accessibilityHint).toEqual('foo');
  });
});
