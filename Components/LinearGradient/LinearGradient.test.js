import React from 'react';
import { processColor, Text } from 'react-native';
import { LinearGradient } from './LinearGradient';
import { getRenderer, getStyle, getText } from '../../../TestUtils';

const renderLinearGradient = getRenderer(LinearGradient, {});

describe('LinearGradient', () => {
  it('renders', () => {
    expect(renderLinearGradient()).toBeTruthy();
  });

  it('displays children', () => {
    const gradient = renderLinearGradient({ children: <Text>Foo</Text> });
    expect(getText(gradient)).toEqual('Foo');
  });

  it('changes gradient with an array of two or more colors', () => {
    const gradient = renderLinearGradient({ colors: ['#F00', '#BA4', '#BA2'] });

    expect(gradient.props.colors).toEqual([
      processColor('#F00'),
      processColor('#BA4'),
      processColor('#BA2')
    ]);
  });

  it('angles gradient with start and end percentages', () => {
    const gradient = renderLinearGradient({
      colors: ['#F00BA4', '#BA4BA2'],
      start: { x: 0, y: 0 },
      end: { x: 1, y: 0 }
    });

    expect(gradient.props.startPoint).toEqual({ x: 0, y: 0 });
    expect(gradient.props.endPoint).toEqual({ x: 1, y: 0 });
  });

  it('sets alternate color locations with an array of percentages', () => {
    const gradient = renderLinearGradient({
      colors: ['#F00BA4', '#BA4BA2'],
      locations: [0.42, 0.53]
    });

    expect(gradient.props.locations).toEqual([0.42, 0.53]);
  });

  it('falls back to a View if passed a single color', () => {
    const gradient = renderLinearGradient({ colors: ['#F00BA4'] });

    expect(gradient.type).toEqual('View');
    expect(getStyle(gradient).backgroundColor).toEqual('#F00BA4');
  });

  it('uses a View if passed a color property', () => {
    const gradient = renderLinearGradient({ color: '#F00BA4' });

    expect(gradient.type).toEqual('View');
    expect(getStyle(gradient).backgroundColor).toEqual('#F00BA4');
  });

  it('overrides default styles with passed styles', () => {
    const gradient = renderLinearGradient({
      style: {
        borderRadius: 42
      }
    });

    expect(getStyle(gradient).borderRadius).toEqual(42);
  });

  it('passes on any additional props', () => {
    const gradient = renderLinearGradient({ accessibilityHint: 'foo' });
    expect(gradient.props.accessibilityHint).toEqual('foo');
  });
});
