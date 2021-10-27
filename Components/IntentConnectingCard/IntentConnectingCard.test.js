import { IntentConnectingCard } from './IntentConnectingCard';
import { getRenderer, getStyle, getText, findChild } from '../../../TestUtils';

const renderIntentConnectingCard = getRenderer(IntentConnectingCard, {
  title: 'Hello, Test!',
  onPress: () => {}
});

describe('IntentConnectingCard', () => {
  it('renders', () => {
    expect(renderIntentConnectingCard()).toBeTruthy();
  });

  it('displays passed children as text', () => {
    const intentConnectingCard = renderIntentConnectingCard({ title: 'foo' });
    expect(getText(intentConnectingCard)).toEqual('foo');
  });

  it('overrides default styles with passed styles', () => {
    const intentConnectingCard = renderIntentConnectingCard({
      style: {
        backgroundColor: '#F00BA4'
      }
    });

    expect(getStyle(intentConnectingCard).backgroundColor).toEqual('#F00BA4');
  });

  it('overrides default text styles with passed text styles', () => {
    const intentConnectingCard = renderIntentConnectingCard({
      textStyle: {
        color: '#F00BA4'
      }
    });
    const child = findChild(intentConnectingCard, 'Text');

    expect(child.type).toEqual('Text');
    expect(getStyle(child).color).toEqual('#F00BA4');
  });

  it('passes on any additional props', () => {
    const intentConnectingCard = renderIntentConnectingCard({
      accessibilityHint: 'foo'
    });
    expect(intentConnectingCard.props.accessibilityHint).toEqual('foo');
  });
});
