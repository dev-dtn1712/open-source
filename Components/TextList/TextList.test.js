import { TextList } from './TextList';
import { getRenderer, findChild, getStyle, hasText } from '../../../TestUtils';

const renderTextList = getRenderer(TextList, { children: 'Hello, Test!' });

describe('TextList', () => {
  it('renders', () => {
    expect(renderTextList()).toBeTruthy();
  });

  it('displays passed text passed as children', () => {
    const textList = renderTextList({ children: 'foo' });
    expect(hasText(textList, 'foo')).toEqual(true);
  });

  it('displays multiple children', () => {
    const textList = renderTextList({ children: ['foo', 'bar', 'baz'] });

    expect(hasText(textList, 'foo')).toEqual(true);
    expect(hasText(textList, 'bar')).toEqual(true);
    expect(hasText(textList, 'baz')).toEqual(true);
  });

  it('displays custom bullets', () => {
    const textList = renderTextList({ bullet: '\u2023' });
    expect(hasText(textList, '\u2023')).toEqual(true);
  });

  it('uses numbers instead of bullets when ordered', () => {
    const textList = renderTextList({ ordered: true });
    expect(hasText(textList, '1.')).toEqual(true);
  });

  it('overrides default styles with passed styles', () => {
    const textList = renderTextList({
      style: {
        backgroundColor: '#F00BA4'
      }
    });

    expect(getStyle(textList).backgroundColor).toEqual('#F00BA4');
  });

  it('styles the bullet', () => {
    const textList = renderTextList({
      bulletStyle: {
        color: '#F00BA4'
      }
    });

    const child = textList.children[0];
    const bullet = findChild(child, { testID: 'bullet' });

    expect(getStyle(bullet).color).toEqual('#F00BA4');
  });

  it('styles the text item', () => {
    const textList = renderTextList({
      itemStyle: {
        color: '#F00BA4'
      }
    });

    const child = textList.children[0];
    const item = findChild(child, { testID: 'item' });

    expect(getStyle(item).color).toEqual('#F00BA4');
  });

  it('applies text styles to both the bullet and the item', () => {
    const textList = renderTextList({
      textStyle: {
        color: '#F00BA4'
      }
    });

    const child = textList.children[0];
    const bullet = findChild(child, { testID: 'bullet' });
    const item = findChild(child, { testID: 'item' });

    expect(getStyle(bullet).color).toEqual('#F00BA4');
    expect(getStyle(item).color).toEqual('#F00BA4');
  });

  it('styles the row container', () => {
    const textList = renderTextList({
      rowStyle: {
        backgroundColor: '#F00BA4'
      }
    });

    const child = textList.children[0];
    const row = findChild(child, { testID: 'row' });

    expect(getStyle(row).backgroundColor).toEqual('#F00BA4');
  });

  it('passes on any additional props', () => {
    const textList = renderTextList({ accessibilityHint: 'foo' });
    expect(textList.props.accessibilityHint).toEqual('foo');
  });
});
