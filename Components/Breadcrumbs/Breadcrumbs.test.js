import { Breadcrumbs } from './Breadcrumbs';
import { getRenderer, getStyle } from '../../../TestUtils';

const renderBreadcrumbs = getRenderer(Breadcrumbs, {
  count: 3,
  selected: 0,
  size: 9,
  spacing: 7
});
const getBackgroundColor = component => getStyle(component).backgroundColor;

describe('Breadcrumbs', () => {
  it('renders', () => {
    expect(renderBreadcrumbs()).toBeTruthy();
  });

  it('displays as many breadcrumbs as the count', () => {
    const { children } = renderBreadcrumbs({ count: 5 });

    for (const child of children) {
      expect(child.type).toEqual('View');
    }

    expect(children.length).toEqual(5);
  });

  it('highlights the selected breadcrumb in a different color', () => {
    const { children } = renderBreadcrumbs({ count: 4, selected: 1 });
    const color = getBackgroundColor(children[0]);
    const highlight = getBackgroundColor(children[1]);

    expect(getBackgroundColor(children[0])).not.toEqual(highlight);
    expect(getBackgroundColor(children[1])).not.toEqual(color);
    expect(getBackgroundColor(children[2])).not.toEqual(highlight);
    expect(getBackgroundColor(children[3])).not.toEqual(highlight);
  });

  it('accepts custom breadcrumb colors', () => {
    const breadcrumbs = renderBreadcrumbs({
      color: '#F00BA4',
      selected: 1
    });

    expect(getBackgroundColor(breadcrumbs.children[0])).toEqual('#F00BA4');
  });

  it('accepts custom highlight colors', () => {
    const breadcrumbs = renderBreadcrumbs({
      highlight: '#F00BA4',
      selected: 1
    });

    expect(getBackgroundColor(breadcrumbs.children[1])).toEqual('#F00BA4');
  });

  it('accepts a custom breadcrumb size', () => {
    const breadcrumbs = renderBreadcrumbs({ size: 42 });
    const { width, height, borderRadius } = getStyle(breadcrumbs.children[0]);

    expect(width).toEqual(42);
    expect(height).toEqual(42);
    expect(borderRadius).toEqual(42);
  });

  it('accepts custom breadcrumb size and spacing', () => {
    const breadcrumbs = renderBreadcrumbs({ count: 4, size: 7, spacing: 13 });
    const { height, width } = getStyle(breadcrumbs);

    expect(height).toEqual(7 + 13 + 13);
    expect(width).toEqual(4 * (7 + 13 + 13));
  });

  it('overrides default styles with passed styles', () => {
    const breadcrumbs = renderBreadcrumbs({
      style: {
        backgroundColor: '#F00BA4'
      }
    });

    expect(getBackgroundColor(breadcrumbs)).toEqual('#F00BA4');
  });

  it('passes on any additional props', () => {
    const breadcrumbs = renderBreadcrumbs({ accessibilityHint: 'foo' });
    expect(breadcrumbs.props.accessibilityHint).toEqual('foo');
  });
});
