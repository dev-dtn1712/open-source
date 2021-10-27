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
  APP_BRIGHT_GRAY,
  APP_DARK_GRAY,
  APP_WHITE,
  Fonts,
  Images,
  APP_DISABLED_CARD
} from '../../Themes';

const DEFAULT_STYLES = StyleSheet.create({
  card: {
    position: 'relative',
    height: 167,
    backgroundColor: APP_DARK_GRAY,
    padding: 16,
    alignSelf: 'stretch',
    borderRadius: 4,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: 'rgba(0,0,0,0.13)',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4
  },
  imageWrapper: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    height: 18,
    margin: 8
  },
  statusImage: {},
  title: {
    color: APP_BRIGHT_GRAY,
    fontFamily: Fonts.type.base,
    fontSize: 19,
    fontWeight: 'bold',
    letterSpacing: 0.31,
    lineHeight: 29
  },
  text: {
    color: APP_BRIGHT_GRAY,
    fontFamily: Fonts.type.base,
    fontSize: 13,
    letterSpacing: -0.21,
    lineHeight: 18,
    marginTop: 6
  }
});

export const SmallCard = ({
  statusImage,
  statusImageResizeMode = 'cover',
  statusImageStyle,
  isLocked = false,
  onPress,
  style,
  tag,
  tagColor,
  tagStyle,
  tagWrapperStyle,
  title,
  titleStyle,
  text,
  textStyle,
  ...props
}) => {
  const image = isLocked ? Images.iconLocked : statusImage;

  return (
    <TouchableWithoutFeedback onPress={onPress} {...props}>
      <View
        testID="main"
        style={[
          DEFAULT_STYLES.card,
          style,
          isLocked && { backgroundColor: APP_DISABLED_CARD }
        ]}>
        <View style={[DEFAULT_STYLES.imageWrapper]}>
          {image && (
            <Image
              testID="statusImage"
              style={[
                DEFAULT_STYLES.statusImage,
                statusImageStyle,
                isLocked && { tintColor: APP_WHITE }
              ]}
              resizeMode={statusImageResizeMode}
              source={image}
            />
          )}
        </View>
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
            align="left"
            style={tagWrapperStyle}
            textStyle={tagStyle}
          />
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};
