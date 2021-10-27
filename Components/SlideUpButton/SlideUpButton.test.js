import { SlideUpButton } from './SlideUpButton';
import { getRenderer, getStyle, findChild, hasText } from '../../../TestUtils';

const renderSlideUpButton = getRenderer(SlideUpButton, {
  title: 'My Title'
});

describe('SlideUpButton', () => {
  it('renders', () => {
    expect(renderSlideUpButton()).toBeTruthy();
  });

  it('it renders witha button with title', () => {
    const modal = renderSlideUpButton({
      title: 'foo',
      actionTestId: 'Foo Button'
    });

    const actionButton = findChild(modal, { testID: 'Foo Button' });
    expect(hasText(actionButton, 'foo')).toEqual(true);
  });

  it('overrides default styles with passed styles', () => {
    const modal = renderSlideUpButton({
      containerStyle: {
        backgroundColor: '#F00BA4'
      }
    });

    const container = findChild(modal, { testID: 'modalContainer' });
    expect(getStyle(container).backgroundColor).toEqual('#F00BA4');
  });

  it('passes on any additional props', () => {
    const button = renderSlideUpButton({ accessibilityHint: 'foo' });
    expect(button.props.accessibilityHint).toEqual('foo');
  });
});
