import { Tag } from './Tag';
import { getRenderer, getStyle } from '../../../TestUtils';

const renderTag = getRenderer(Tag, { color: 'gray', text: 'ACTIVE' });

describe('Tag', () => {
  it('renders', () => {
    expect(renderTag()).toBeTruthy();
  });

  it('creates a tag of the correct align', () => {
    const tag = renderTag({ align: 'right' });
    const { borderTopLeftRadius } = getStyle(tag);

    expect(borderTopLeftRadius).toBeTruthy();
  });

  it('accepts a custom color', () => {
    const tag = renderTag({ color: '#F00BA4' });
    const { backgroundColor } = getStyle(tag);

    expect(backgroundColor).toEqual('#F00BA4');
  });

  it('overrides default styles with passed styles', () => {
    const tag = renderTag({
      style: {
        margin: 10
      }
    });
    const { margin } = getStyle(tag);

    expect(margin).toEqual(10);
  });

  it('passes on any additional props', () => {
    const tag = renderTag({ accessibilityHint: 'foo' });
    expect(tag.props.accessibilityHint).toEqual('foo');
  });
});
