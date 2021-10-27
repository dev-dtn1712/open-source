import { ProgressBar } from './ProgressBar';
import { findChild, getRenderer, getStyle } from '../../../TestUtils';

const renderProgressBar = getRenderer(ProgressBar, { progress: 0.5 });

describe('ProgressBar', () => {
  it('renders', () => {
    expect(renderProgressBar()).toBeTruthy();
  });

  it('overrides default styles with passed styles', () => {
    const progressBar = renderProgressBar({
      style: {
        height: 42
      }
    });

    expect(getStyle(progressBar).height).toEqual(42);
  });

  it('overrides default bar styles with passed bar styles', () => {
    const progressBar = renderProgressBar({
      barStyle: {
        backgroundColor: '#F00BA4'
      }
    });
    const bar = findChild(progressBar, { testID: 'bar' });

    expect(getStyle(bar).backgroundColor).toEqual('#F00BA4');
  });

  it('overrides default background styles with passed background styles', () => {
    const progressBar = renderProgressBar({
      backgroundStyle: {
        backgroundColor: '#F00BA4'
      }
    });
    const background = findChild(progressBar, { testID: 'background' });

    expect(getStyle(background).backgroundColor).toEqual('#F00BA4');
  });

  it('overrides bar props with passed bar props', () => {
    const progressBar = renderProgressBar({
      barProps: {
        locations: [0.42, 0.53]
      }
    });
    const bar = findChild(progressBar, { testID: 'bar' });

    expect(bar.props.locations).toEqual([0.42, 0.53]);
  });

  it('passes on any additional props', () => {
    const progressBar = renderProgressBar({ accessibilityHint: 'foo' });
    expect(progressBar.props.accessibilityHint).toEqual('foo');
  });
});
