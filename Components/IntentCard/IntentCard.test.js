import { IntentCard } from './IntentCard';
import {
  getRenderer,
  getStyle,
  getText,
  findChild,
  pressTouchable
} from '../../../TestUtils';

const renderIntentCard = getRenderer(IntentCard, {
  title: 'Hello, Test!',
  onPress: () => {}
});

describe('IntentCard', () => {
  it('renders', () => {
    expect(renderIntentCard()).toBeTruthy();
  });

  it('displays passed children as text', () => {
    const intentCard = renderIntentCard({ title: 'foo' });
    expect(getText(intentCard)).toEqual('foo');
  });

  it('calls passed onPress function when pressed', () => {
    const onPress = jest.fn();
    const intentCard = renderIntentCard({ onPress });

    const button = findChild(intentCard, { testID: 'touchable' });

    pressTouchable(button);

    expect(onPress).toHaveBeenCalled();
  });

  it('overrides default styles with passed styles', () => {
    const intentCard = renderIntentCard({
      style: {
        backgroundColor: '#F00BA4'
      }
    });

    expect(getStyle(intentCard).backgroundColor).toEqual('#F00BA4');
  });

  it('passes on any additional props', () => {
    const intentCard = renderIntentCard({ accessibilityHint: 'foo' });
    expect(intentCard.props.accessibilityHint).toEqual('foo');
  });
});
