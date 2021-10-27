import { InitialsCircle } from './InitialsCircle';
import { findChild, getRenderer, getStyle, getText } from '../../../TestUtils';

const renderInitialsCircle = getRenderer(InitialsCircle, {
  text: 'Hello, Initials!'
});

describe('InitialsCircle', () => {
  it('renders', () => {
    expect(renderInitialsCircle()).toBeTruthy();
  });

  it('displays the first and last letters of passed text as uppercase', () => {
    const initials = renderInitialsCircle({ text: 'Foo' });
    expect(getText(initials)).toEqual('FO');
  });

  it('overrides default text styles with passed text styles', () => {
    const initials = renderInitialsCircle({
      textStyle: {
        color: '#F00BA4'
      }
    });
    const text = findChild(initials, 'Text');
    expect(getStyle(text).color).toEqual('#F00BA4');
  });

  it('overrides default styles with passed styles', () => {
    const initials = renderInitialsCircle({
      style: {
        backgroundColor: '#F00BA4'
      }
    });

    expect(getStyle(initials).backgroundColor).toEqual('#F00BA4');
  });

  it('passes on any additional props', () => {
    const initials = renderInitialsCircle({ accessibilityHint: 'foo' });
    expect(initials.props.accessibilityHint).toEqual('foo');
  });
});
