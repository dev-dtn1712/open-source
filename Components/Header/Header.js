import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { APP_DARK_GRAY, APP_WHITE, Fonts } from '../../Themes';
import { DEFAULT_STATUS_BAR_HEIGHT } from '../TopBar';

export const DEFAULT_HEADER_HEIGHT = 200 + DEFAULT_STATUS_BAR_HEIGHT;

const DEFAULT_STYLES = StyleSheet.create({
  body: {
    flex: 1,
    padding: 0
  },
  header: {
    backgroundColor: APP_DARK_GRAY,
    paddingHorizontal: 16,
    paddingVertical: 16,
    width: '100%',
    borderBottomRightRadius: 16,
    borderBottomLeftRadius: 16,
    height: DEFAULT_HEADER_HEIGHT,
    overflow: 'hidden'
  },
  backgroundImage: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    opacity: 0.2
  },
  title: {
    ...Fonts.style.title,
    color: APP_WHITE
  }
});

export class Header extends React.Component {
  render() {
    const {
      backgroundImage,
      backgroundImageResizeMode = 'cover',
      backgroundImageStyle,
      bodyStyle,
      children,
      headerHeight,
      style,
      showTitle = true,
      title,
      titleStyle,
      ...restProps
    } = this.props;

    return (
      <View
        style={[
          DEFAULT_STYLES.header,
          headerHeight && { height: headerHeight },
          style
        ]}
        {...restProps}>
        {backgroundImage && (
          <Image
            style={[DEFAULT_STYLES.backgroundImage, backgroundImageStyle]}
            resizeMode={backgroundImageResizeMode}
            source={backgroundImage}
          />
        )}
        {title && (
          <Text
            testID="title"
            style={[
              DEFAULT_STYLES.title,
              titleStyle,
              { opacity: showTitle ? 1 : 0 }
            ]}>
            {title}
          </Text>
        )}

        {children && (
          <View testID="body" style={[DEFAULT_STYLES.body, bodyStyle]}>
            {children}
          </View>
        )}
      </View>
    );
  }
}
