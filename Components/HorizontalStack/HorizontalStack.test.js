import React from 'react';
import { Text } from 'react-native';
import { act } from 'react-test-renderer';

import { HorizontalStack } from './HorizontalStack';
import { Metrics } from '../../Themes';
import { findChild, getRenderer, getStyle, getText } from '../../../TestUtils';

const renderHorizontalStack = getRenderer(HorizontalStack, {
  children: [<Text>Hello, Test!</Text>]
});

// ScrollViews are made of an RCTScrollView with a nested View
const getNestedChildren = ({ children }) => children[0].children;

describe('HorizontalStack', () => {
  it('renders', () => {
    expect(renderHorizontalStack()).toBeTruthy();
  });

  it('displays child elements in a ScrollView', () => {
    const stack = renderHorizontalStack({
      children: [<Text>Foo</Text>, <Text>Bar</Text>, <Text>Baz</Text>]
    });

    const scrollView = findChild(stack, 'RCTScrollView');
    expect(scrollView).toBeTruthy();

    const [page1, page2, page3] = getNestedChildren(scrollView);
    expect(getText(page1)).toEqual('Foo');
    expect(getText(page2)).toEqual('Bar');
    expect(getText(page3)).toEqual('Baz');
  });

  it('calls onPage with current page when stack pages are changed', () => {
    const onPage = jest.fn();
    const stack = renderHorizontalStack({ onPage });
    const scrollView = findChild(stack, 'RCTScrollView');

    act(() => {
      scrollView.props.onMomentumScrollEnd({
        nativeEvent: {
          contentOffset: {
            x: 2 * Metrics.screenWidth
          }
        }
      });
    });

    expect(onPage).toHaveBeenCalledWith(2);
  });

  it('overlays breadcrumbs by default', () => {
    const stack = renderHorizontalStack();
    const breadcrumbs = findChild(stack, { testID: 'breadcrumbs' });

    expect(breadcrumbs).toBeTruthy();
    expect(getStyle(breadcrumbs).position).toEqual('absolute');
  });

  it('allows breadcrumbs to be hidden', () => {
    const stack = renderHorizontalStack({ showBreadcrumbs: false });
    const breadcrumbs = findChild(stack, { testID: 'breadcrumbs' });

    expect(breadcrumbs).not.toBeTruthy();
  });

  it('styles each page wrapper', () => {
    const stack = renderHorizontalStack({
      pageStyle: {
        margin: 42
      }
    });

    const [page] = getNestedChildren(findChild(stack, 'RCTScrollView'));
    expect(getStyle(page).margin).toEqual(42);
  });

  it('styles the overall stack wrapper', () => {
    const stack = renderHorizontalStack({
      wrapperStyle: {
        margin: 42
      }
    });

    expect(getStyle(stack).margin).toEqual(42);
  });

  it('styles the core ScrollView element', () => {
    const stack = renderHorizontalStack({
      style: {
        margin: 42
      }
    });

    const scrollView = findChild(stack, 'RCTScrollView');
    expect(getStyle(scrollView).margin).toEqual(42);
  });

  it('passes on any additional props to the core ScrollView element', () => {
    const stack = renderHorizontalStack({ scrollEnabled: false });
    const scrollView = findChild(stack, 'RCTScrollView');

    expect(scrollView.props.scrollEnabled).toEqual(false);
  });
});
