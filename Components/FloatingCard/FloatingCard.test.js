import React from 'react';
import { Text } from 'react-native';
import { FloatingCard } from './FloatingCard';
import { getRenderer, getStyle, getText } from '../../../TestUtils';

const renderFloatingCard = getRenderer(FloatingCard, {});

describe('FloatingCard', () => {
  it('renders', () => {
    expect(renderFloatingCard()).toBeTruthy();
  });

  it('displays children', () => {
    const card = renderFloatingCard({ children: <Text>Foo</Text> });
    expect(getText(card)).toEqual('Foo');
  });

  it('overrides default styles with passed styles', () => {
    const card = renderFloatingCard({
      style: {
        backgroundColor: '#F00BA4'
      }
    });

    expect(getStyle(card).backgroundColor).toEqual('#F00BA4');
  });

  it('passes on any additional props', () => {
    const card = renderFloatingCard({ accessibilityHint: 'foo' });
    expect(card.props.accessibilityHint).toEqual('foo');
  });
});
