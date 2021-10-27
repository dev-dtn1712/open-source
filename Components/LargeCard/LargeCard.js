import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View
} from 'react-native';

import { Tag } from '../Tag';
import {
  APP_DISABLED_CARD,
  APP_DARK_GRAY,
  APP_WHITE,
  Fonts
} from '../../Themes';

const GHOSTED_IMAGE_ALPHA = 0.1;

const DEFAULT_STYLES = StyleSheet.create({
  backgroundImage: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    opacity: 0.1
  },
  card: {
    position: 'relative',
    backgroundColor: APP_DARK_GRAY,
    paddingHorizontal: 16,
    paddingVertical: 32,
    alignSelf: 'stretch',
    borderRadius: 4,
    overflow: 'hidden'
  },
  imageWrapper: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingVertical: 2,
    alignSelf: 'stretch'
  },
  text: {
    color: APP_WHITE,
    fontFamily: Fonts.type.base,
    fontSize: 13,
    letterSpacing: -0.08,
    lineHeight: 18,
    paddingVertical: 2
  },
  title: {
    color: APP_WHITE,
    fontFamily: Fonts.type.base,
    fontSize: 23,
    fontWeight: 'bold',
    letterSpacing: 0.37,
    lineHeight: 29,
    paddingVertical: 2
  },
  glyph: {
    fontFamily: Fonts.type.base,
    fontSize: 34,
    letterSpacing: 0.41,
    paddingVertical: 2
  }
});

export const LargeCard = ({
  backgroundImage,
  backgroundImageResizeMode = 'cover',
  backgroundImageStyle,
  glyph,
  glyphStyle,
  image,
  imageStyle,
  imageWrapperStyle,
  isActivated,
  onPress,
  style,
  tag,
  tagColor,
  tagAlign,
  tagStyle,
  tagWrapperStyle,
  text,
  textStyle,
  title,
  titleStyle,
  ...props
}) => (
  <TouchableWithoutFeedback onPress={onPress} {...props}>
    <View
      testID="main"
      style={[
        DEFAULT_STYLES.card,
        style,
        !isActivated && {
          opacity: 0.97,
          backgroundColor: APP_DISABLED_CARD
        }
      ]}>
      {backgroundImage && (
        <Image
          testID="backgroundImage"
          style={[
            DEFAULT_STYLES.backgroundImage,
            backgroundImageStyle,
            {
              opacity: isActivated
                ? GHOSTED_IMAGE_ALPHA
                : GHOSTED_IMAGE_ALPHA * 0.5
            }
          ]}
          resizeMode={backgroundImageResizeMode}
          source={backgroundImage}
        />
      )}
      {glyph && (
        <Text
          testID="glyph"
          style={[
            DEFAULT_STYLES.glyph,
            glyphStyle,
            !isActivated && { opacity: 0.5 }
          ]}>
          {glyph}
        </Text>
      )}
      {image && (
        <View
          testID="imageWrapper"
          style={[DEFAULT_STYLES.imageWrapper, imageWrapperStyle]}>
          <Image style={imageStyle} source={image} />
        </View>
      )}
      <Text testID="title" style={[DEFAULT_STYLES.title, titleStyle]}>
        {title}
      </Text>
      {text && (
        <Text testID="text" style={[DEFAULT_STYLES.text, textStyle]}>
          {text}
        </Text>
      )}
      {tag && (
        <Tag
          testID="tag"
          color={tagColor}
          text={tag}
          align={tagAlign}
          style={tagWrapperStyle}
          textStyle={tagStyle}
        />
      )}
    </View>
  </TouchableWithoutFeedback>
);
