import { TopBar } from './TopBar';
import { findText, getRenderer, getStyle, hasText } from '../../../TestUtils';

const renderTopBar = getRenderer(TopBar, {
  title: 'My Title',
  leftItemLabel: 'Back'
});

describe('TopBar', () => {
  it('renders', () => {
    expect(renderTopBar()).toBeTruthy();
  });

  it('displays title text', () => {
    const topBar = renderTopBar({ title: 'foo' });
    expect(hasText(topBar, 'foo')).toEqual(true);
  });

  it('styles title text', () => {
    const topBar = renderTopBar({
      title: 'foo',
      titleStyle: {
        color: '#F00BA4'
      }
    });

    const title = findText(topBar, 'foo');
    expect(getStyle(title).color).toEqual('#F00BA4');
  });

  it('overrides default styles with passed styles', () => {
    const topBar = renderTopBar({
      style: {
        margin: 10
      }
    });

    expect(getStyle(topBar).margin).toEqual(10);
  });
});
