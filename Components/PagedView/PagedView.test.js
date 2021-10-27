import React from 'react';
import { Text } from 'react-native';
import { act } from 'react-test-renderer';

import { PagedView } from './PagedView';
import { Metrics } from '../../Themes';
import { getRenderer, getStyle, getText } from '../../../TestUtils';

const renderPagedView = getRenderer(PagedView, {
  children: [<Text>Hello, PagedView!</Text>],
  onPage: () => {}
});

// ScrollViews are made of an RCTScrollView with a nested View
const getNestedChildren = ({ children }) => children[0].children;

const scrollTo = (pagedView, x) => {
  act(() => {
    pagedView.props.onMomentumScrollEnd({
      nativeEvent: {
        contentOffset: {
          x
        }
      }
    });
  });
};

describe('PagedView', () => {
  it('renders', () => {
    expect(renderPagedView()).toBeTruthy();
  });

  it('displays child elements in a ScrollView', () => {
    const paged = renderPagedView({
      children: [<Text>Foo</Text>, <Text>Bar</Text>, <Text>Baz</Text>]
    });

    expect(paged.type).toEqual('RCTScrollView');

    const [page1, page2, page3] = getNestedChildren(paged);
    expect(getText(page1)).toEqual('Foo');
    expect(getText(page2)).toEqual('Bar');
    expect(getText(page3)).toEqual('Baz');
  });

  it('calls onPage with current page when paged pages are changed', () => {
    const onPage = jest.fn();
    const paged = renderPagedView({
      children: [<Text>Foo</Text>, <Text>Bar</Text>, <Text>Baz</Text>],
      onPage
    });

    scrollTo(paged, 2 * Metrics.screenWidth);
    expect(onPage).toHaveBeenCalledWith(2);
  });

  it('optionally sets pageWidth', () => {
    const onPage = jest.fn();
    const paged = renderPagedView({
      children: [<Text>Foo</Text>, <Text>Bar</Text>, <Text>Baz</Text>],
      onPage,
      pageWidth: 42
    });
    const [page] = getNestedChildren(paged);

    expect(getStyle(page).width).toEqual(42);

    scrollTo(paged, 2 * 42);
    expect(onPage).toHaveBeenCalledWith(2);
  });

  it('styles each page wrapper', () => {
    const paged = renderPagedView({
      pageStyle: {
        backgroundColor: '#F00BA4'
      }
    });

    const [page] = getNestedChildren(paged);
    expect(getStyle(page).backgroundColor).toEqual('#F00BA4');
  });

  it('overrides default styles', () => {
    const paged = renderPagedView({
      style: {
        backgroundColor: '#F00BA4'
      }
    });

    expect(getStyle(paged).backgroundColor).toEqual('#F00BA4');
  });

  it('passes on any additional props', () => {
    const paged = renderPagedView({ scrollEnabled: false });
    expect(paged.props.scrollEnabled).toEqual(false);
  });
});
