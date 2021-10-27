import React from 'react';
import { Text, View } from 'react-native';

import { FullCard } from './FullCard';
import {
  findChild,
  findText,
  getRenderer,
  getStyle,
  getText,
  hasText
} from '../../../TestUtils';
import { Images } from '../../Themes';

const renderFullCard = getRenderer(FullCard, {
  children: 'Hello, Test!',
  image: Images.discoveryBackground,
  title: 'My Title'
});

describe('FullCard', () => {
  it('renders', () => {
    expect(renderFullCard()).toBeTruthy();
  });

  it('displays child text', () => {
    const card = renderFullCard({ children: 'foo' });
    expect(hasText(card, 'foo')).toEqual(true);
  });

  it('displays child elements', () => {
    const card = renderFullCard({
      children: (
        <View testID="foo">
          <Text>Bar</Text>
          <Text>Baz</Text>
        </View>
      )
    });

    const child = findChild(card, { testID: 'foo' });
    expect(child).toBeTruthy();
    expect(child.type).toEqual('View');

    const [text1, text2] = child.children;
    expect(getText(text1)).toEqual('Bar');
    expect(getText(text2)).toEqual('Baz');
  });

  it('styles body container', () => {
    const card = renderFullCard({
      bodyStyle: {
        padding: 10
      },
      children: 'foo'
    });

    const body = findChild(card, { testID: 'body' });
    expect(getStyle(body).padding).toEqual(10);
    expect(getText(body)).toEqual('foo');
  });

  it('displays title text', () => {
    const card = renderFullCard({ title: 'foo' });
    expect(hasText(card, 'foo')).toEqual(true);
  });

  it('styles title text', () => {
    const card = renderFullCard({
      title: 'foo',
      titleStyle: {
        color: '#F00BA4'
      }
    });

    const title = findText(card, 'foo');
    expect(getStyle(title).color).toEqual('#F00BA4');
  });

  it('displays title elements', () => {
    const card = renderFullCard({
      title: (
        <Text testID="foo">
          Bar
          <Text>Baz</Text>
        </Text>
      )
    });

    const title = findChild(card, { testID: 'foo' });
    expect(title).toBeTruthy();
    expect(getText(title)).toEqual('Bar');
    expect(getText(title.children[1])).toEqual('Baz');
  });

  it('displays an image', () => {
    const card = renderFullCard({ image: Images.logo });

    const image = findChild(card, 'Image');
    expect(image).toBeTruthy();
    expect(image.props.source).toBe(Images.logo);
  });

  it('styles the image', () => {
    const card = renderFullCard({
      image: Images.logo,
      imageStyle: {
        height: '50%'
      }
    });

    const image = findChild(card, 'Image');
    expect(getStyle(image).height).toEqual('50%');
  });

  it('styles the image wrapper', () => {
    const card = renderFullCard({
      imageWrapperStyle: {
        height: '50%'
      }
    });

    const imageWrapper = findChild(card, { testID: 'imageWrapper' });
    expect(getStyle(imageWrapper).height).toEqual('50%');
  });

  it('displays footer elements', () => {
    const card = renderFullCard({
      footer: (
        <View testID="foo">
          <Text>Bar</Text>
          <Text>Baz</Text>
        </View>
      )
    });

    const footer = findChild(card, { testID: 'foo' });
    expect(footer).toBeTruthy();
    expect(footer.type).toEqual('View');

    const [text1, text2] = footer.children;
    expect(getText(text1)).toEqual('Bar');
    expect(getText(text2)).toEqual('Baz');
  });

  it('styles the footer container', () => {
    const card = renderFullCard({
      footer: <Text>Foo</Text>,
      footerStyle: {
        padding: 20
      }
    });

    const footer = findChild(card, { testID: 'footer' });
    expect(getStyle(footer).padding).toEqual(20);
  });

  it('overrides default styles with passed styles', () => {
    const card = renderFullCard({
      style: {
        margin: 10
      }
    });

    expect(getStyle(card).margin).toEqual(10);
  });

  it('passes on any additional props', () => {
    const card = renderFullCard({ accessibilityHint: 'foo' });
    expect(card.props.accessibilityHint).toEqual('foo');
  });
});
