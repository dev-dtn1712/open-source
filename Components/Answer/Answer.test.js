import { Answer } from './Answer';
import {
  getRenderer,
  getStyle,
  getText,
  findChild,
  pressTouchable
} from '../../../TestUtils';
import { toTestIds } from '../../Utils';

const renderAnswer = getRenderer(Answer, {
  children: 'Hello, Test!',
  onChange: () => {}
});

describe('Answer', () => {
  it('renders', () => {
    expect(renderAnswer()).toBeTruthy();
  });

  it('displays passed children as text', () => {
    const answer = renderAnswer({ children: 'foo' });
    expect(getText(answer)).toEqual('foo');
  });

  it('calls passed onChange function when pressed', () => {
    const onChange = jest.fn();
    const answer = renderAnswer({ onChange, ...toTestIds('touchable') });

    const button = findChild(answer, { testID: 'touchable' });

    pressTouchable(button);

    expect(onChange).toHaveBeenCalled();
  });

  it('overrides default styles with passed styles', () => {
    const answer = renderAnswer({
      style: {
        backgroundColor: '#F00BA4'
      }
    });

    expect(getStyle(answer).backgroundColor).toEqual('#F00BA4');
  });

  it('overrides default text styles with passed text styles', () => {
    const answer = renderAnswer({
      textStyle: {
        color: '#F00BA4'
      }
    });
    const child = answer.children[0];

    expect(child.type).toEqual('Text');
    expect(getStyle(child).color).toEqual('#F00BA4');
  });

  it('passes on any additional props', () => {
    const answer = renderAnswer({ accessibilityHint: 'foo' });
    expect(answer.props.accessibilityHint).toEqual('foo');
  });
});
