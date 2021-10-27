import { Pulsar } from './Pulsar';
import { getRenderer, getStyle } from '../../../TestUtils';

const renderPulsar = getRenderer(Pulsar, {});
const getOpacity = elem => getStyle(elem).opacity;

describe('Pulsar', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  it('renders', () => {
    expect(renderPulsar()).toBeTruthy();
  });

  it('creates a specified number of identical pulses', () => {
    const { children } = renderPulsar({ count: 7 });

    expect(children.length).toEqual(7);
    for (const child of children) {
      expect(child).toEqual(children[0]);
    }
  });

  it('sets starting values for opacity and size', () => {
    const pulsar = renderPulsar({
      count: 1,
      startOpacity: 0.42,
      startSize: 42
    });
    const [pulse] = pulsar.children;
    const { height, width, opacity } = getStyle(pulse);

    expect(height).toEqual(42);
    expect(width).toEqual(42);
    expect(opacity).toEqual(0.42);
  });

  // Unable to get animation tests working, they will be skipped for now.
  it.skip('animates to specified end values after duration', () => {
    const pulsar = renderPulsar({
      count: 1,
      duration: 1000,
      endOpacity: 0.53,
      endSize: 53
    });
    const [pulse] = pulsar.children;

    const startStyle = getStyle(pulse);
    expect(startStyle.borderRadius).not.toEqual(53);
    expect(startStyle.height).not.toEqual(53);
    expect(startStyle.width).not.toEqual(53);
    expect(startStyle.opacity).not.toEqual(0.53);

    jest.advanceTimersByTime(1000);

    const endStyle = getStyle(pulse);
    expect(endStyle.borderRadius).toEqual(53);
    expect(endStyle.height).toEqual(53);
    expect(endStyle.width).toEqual(53);
    expect(endStyle.opacity).toEqual(0.53);
  });

  it.skip('staggers pulse animations by specified interval', () => {
    const pulsar = renderPulsar({
      count: 2,
      interval: 50,
      startOpacity: 0.42
    });
    const [firstPulse, secondPulse] = pulsar.children;

    expect(getOpacity(firstPulse)).toEqual(0.42);
    expect(getOpacity(secondPulse)).toEqual(0.42);

    jest.advanceTimersByTime(50);

    expect(getOpacity(firstPulse)).not.toEqual(0.42);
    expect(getOpacity(secondPulse)).toEqual(0.42);

    jest.advanceTimersByTime(50);

    expect(getOpacity(firstPulse)).not.toEqual(0.42);
    expect(getOpacity(secondPulse)).not.toEqual(0.42);
  });

  it.skip('loops the animation after specified delay', () => {
    const pulsar = renderPulsar({
      count: 1,
      delay: 1000,
      duration: 1000,
      startOpacity: 0.42
    });
    const [pulse] = pulsar.children;

    expect(getOpacity(pulse)).toEqual(0.42);

    jest.advanceTimersByTime(1000);

    expect(getOpacity(pulse)).not.toEqual(0.42);

    jest.advanceTimersByTime(1000);

    expect(getOpacity(pulse)).toEqual(0.42);
  });

  it('overrides default pulse styles with passed styles', () => {
    const pulsar = renderPulsar({
      style: {
        backgroundColor: '#F00BA4'
      }
    });
    const { backgroundColor } = getStyle(pulsar.children[0]);

    expect(backgroundColor).toEqual('#F00BA4');
  });

  it('passes on any additional props to pulses', () => {
    const pulsar = renderPulsar({ accessibilityHint: 'foo' });
    const [pulse] = pulsar.children;

    expect(pulse.props.accessibilityHint).toEqual('foo');
  });
});
