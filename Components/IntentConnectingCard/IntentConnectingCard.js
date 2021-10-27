import React from 'react';
import { StyleSheet, View, Image, Text } from 'react-native';

import { APP_WHITE, APP_BLUE } from '../../Themes';

const DEFAULT_STYLES = StyleSheet.create({
  card: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: APP_BLUE,
    minHeight: 100,
    borderRadius: 4,
    paddingVertical: 8
  },
  intentBackground: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    opacity: 0.1
  },
  glyph: {
    fontSize: 34,
    marginLeft: 16
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    marginLeft: 16,
    marginRight: 'auto'
  },
  title: {
    textAlign: 'left',
    color: APP_WHITE,
    fontSize: 23,
    fontWeight: 'bold'
  }
});

export const IntentConnectingCard = ({
  glyph,
  title,
  imageBackground,
  style,
  textStyle,
  ...props
}) => {
  return (
    <View style={[DEFAULT_STYLES.card, style]} {...props}>
      {imageBackground && (
        <Image
          style={DEFAULT_STYLES.intentBackground}
          resizeMode="cover"
          source={imageBackground}
        />
      )}
      {glyph && <Text style={DEFAULT_STYLES.glyph}>{glyph}</Text>}
      {title && (
        <View style={DEFAULT_STYLES.titleContainer}>
          <Text style={[DEFAULT_STYLES.title, textStyle]}>{title}</Text>
        </View>
      )}
    </View>
  );
};
