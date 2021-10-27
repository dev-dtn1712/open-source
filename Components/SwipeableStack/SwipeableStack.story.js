import React from 'react';
import { View, Text } from 'react-native';
import { storiesOf } from '@storybook/react-native';

import { SwipeableStack } from './SwipeableStack';
import { APP_WHITE, APP_DARK_GRAY } from '../../Themes';

const DEFAULT_STYLES = {
  container: {
    flex: 1,
    borderRadius: 8,
    shadowColor: 'rgba(0,0,0,0.15)',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    backgroundColor: APP_DARK_GRAY,
    paddingHorizontal: 16,
    paddingVertical: 50,
    width: '100%'
  },
  label: {
    textAlign: 'center',
    fontSize: 55,
    fontFamily: 'System',
    color: APP_WHITE
  }
};

const DEFAULT_ITEMS = [
  {
    uuid: '1',
    statement: 'Hello, first response to my query!'
  },
  {
    uuid: '2',
    statement: 'Hello, second response to my query!'
  },
  {
    uuid: '3',
    statement: 'Hello, third response to my query!'
  },
  {
    uuid: '4',
    statement: 'Hello, forth response to my query!'
  }
];

const DEFAULTS = {
  items: DEFAULT_ITEMS,
  renderItem: item => (
    <View style={DEFAULT_STYLES.container}>
      <Text style={DEFAULT_STYLES.label}>{item.statement}</Text>
    </View>
  ),
  onCardSwiped: () => {}
};

storiesOf('SwipeableStack', module).add('default', () => (
  <SwipeableStack {...DEFAULTS} />
));
