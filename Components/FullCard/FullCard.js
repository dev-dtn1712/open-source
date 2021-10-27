import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

import { APP_DARK_GRAY, APP_WHITE, Fonts } from '../../Themes';

const DEFAULT_STYLES = StyleSheet.create({
  body: {
    marginTop: 4
  },
  card: {
    flex: 1,
    backgroundColor: APP_DARK_GRAY,
    paddingHorizontal: 16,
    paddingVertical: 32,
    width: '100%'
  },
  footer: {
    marginTop: 'auto'
  },
  imageWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 38,
    width: '100%'
  },
  text: {
    ...Fonts.style.normal,
    color: APP_WHITE
  },
  title: {
    ...Fonts.style.title,
    color: APP_WHITE
  }
});

export const FullCard = ({
  bodyStyle,
  children,
  footer,
  footerStyle,
  image,
  imageStyle,
  imageWrapperStyle,
  style,
  textStyle,
  title,
  titleStyle,
  ...props
}) => (
  <View style={[DEFAULT_STYLES.card, style]} {...props}>
    <View
      testID="imageWrapper"
      style={[DEFAULT_STYLES.imageWrapper, imageWrapperStyle]}>
      <Image source={image} style={imageStyle} />
    </View>
    <Text testID="title" style={[DEFAULT_STYLES.title, titleStyle]}>
      {title}
    </Text>
    <View testID="body" style={[DEFAULT_STYLES.body, bodyStyle]}>
      {React.Children.map(children, child => {
        if (typeof child !== 'string') {
          return child;
        }
        return <Text style={[DEFAULT_STYLES.text, textStyle]}>{child}</Text>;
      })}
    </View>
    {footer !== undefined && (
      <View testID="footer" style={[DEFAULT_STYLES.footer, footerStyle]}>
        {footer}
      </View>
    )}
  </View>
);
