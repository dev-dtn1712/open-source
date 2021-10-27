import React from 'react';
import { Text, View } from 'react-native';

import { Header } from './Header';
import {
  findChild,
  findText,
  getRenderer,
  getStyle,
  getText,
  hasText
} from '../../../TestUtils';
import { Images } from '../../Themes';

const renderHeader = getRenderer(Header, {
  backgroundImage: Images.discoveryBackground,
  title: 'My Title'
});

describe('Header', () => {
  it('renders', () => {
    expect(renderHeader()).toBeTruthy();
  });

  it('displays child elements', () => {
    const header = renderHeader({
      children: (
        <View testID="foo">
          <Text>Bar</Text>
          <Text>Baz</Text>
        </View>
      )
    });

    const child = findChild(header, { testID: 'foo' });
    expect(child).toBeTruthy();
    expect(child.type).toEqual('View');

    const [text1, text2] = child.children;
    expect(getText(text1)).toEqual('Bar');
    expect(getText(text2)).toEqual('Baz');
  });

  it('styles body container', () => {
    const header = renderHeader({
      bodyStyle: {
        padding: 10
      },
      children: (
        <View testID="foo">
          <Text>Bar</Text>
          <Text>Baz</Text>
        </View>
      )
    });

    const body = findChild(header, { testID: 'body' });
    expect(getStyle(body).padding).toEqual(10);
  });

  it('displays title text', () => {
    const header = renderHeader({ title: 'foo' });
    expect(hasText(header, 'foo')).toEqual(true);
  });

  it('styles title text', () => {
    const header = renderHeader({
      title: 'foo',
      titleStyle: {
        color: '#F00BA4'
      }
    });

    const title = findText(header, 'foo');
    expect(getStyle(title).color).toEqual('#F00BA4');
  });

  it('displays with background image', () => {
    const header = renderHeader({ backgroundImage: Images.logo });

    const image = findChild(header, 'Image');
    expect(image).toBeTruthy();
    expect(image.props.source).toBe(Images.logo);
  });

  it('overrides default styles with passed styles', () => {
    const header = renderHeader({
      style: {
        margin: 10
      }
    });

    expect(getStyle(header).margin).toEqual(10);
  });

  it('passes on any additional props', () => {
    const header = renderHeader({ accessibilityHint: 'foo' });
    expect(header.props.accessibilityHint).toEqual('foo');
  });
});
