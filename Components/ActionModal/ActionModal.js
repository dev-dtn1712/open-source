import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import Modal from 'react-native-modal';

import { Button } from '../Button';
import { InitialsCircle } from '../InitialsCircle';
import { APP_WHITE, APP_DARK_GRAY, APP_MEDIUM_GRAY, Fonts } from '../../Themes';
import { toTestIds } from '../../Utils';

const ANIMATION_TIMING = 500;

const DEFAULT_STYLE = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    marginBottom: 0,
    marginHorizontal: 0
  },
  imageContainer: {
    alignItems: 'center',
    zIndex: 99
  },
  username: {
    position: 'absolute'
  },
  image: {
    position: 'absolute',
    resizeMode: 'center',
    width: 70,
    height: 70
  },
  glyph: {
    position: 'absolute',
    ...Fonts.style.glyph
  },
  contentContainer: {
    backgroundColor: APP_DARK_GRAY,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    marginTop: 54,
    marginHorizontal: 16,
    paddingBottom: 16
  },
  text: {
    textAlign: 'center',
    color: APP_WHITE,
    marginLeft: 16,
    marginRight: 16
  },
  title: {
    ...Fonts.style.title,
    marginTop: 40,
    marginBottom: 16
  },
  statement: {
    ...Fonts.style.normal,
    marginBottom: 24
  }
});

export const ActionModal = ({
  animationTime = ANIMATION_TIMING,
  username,
  image,
  glyph,
  title,
  statement,
  actionOption = undefined,
  dismissOption = undefined,
  actionTestId = 'Confirm Modal',
  dismissTestId = 'Cancel Modal',
  isVisible = false,
  onAction = () => {},
  onDismiss = () => {},
  onCancel,
  containerStyle,
  titleStyle,
  statementStyle,
  actionStyle,
  dismissStyle,
  loading,
  style,
  ...props
}) => {
  return (
    <Modal
      style={[DEFAULT_STYLE.modal, style]}
      isVisible={isVisible}
      animationInTiming={animationTime}
      animationOutTiming={animationTime}
      onBackButtonPress={onCancel || onDismiss}
      onBackdropPress={onCancel || onDismiss}
      useNativeDriver
      statusBarTranslucent
      {...props}>
      <View>
        <View style={[DEFAULT_STYLE.imageContainer]}>
          {username && (
            <InitialsCircle style={[DEFAULT_STYLE.username]} text={username} />
          )}
          {image && <Image source={image} style={[DEFAULT_STYLE.image]} />}
          {glyph && <Text style={[DEFAULT_STYLE.glyph]}>{glyph}</Text>}
        </View>
        <View
          style={[DEFAULT_STYLE.contentContainer, containerStyle]}
          testID="modalContainer">
          {title && (
            <Text style={[DEFAULT_STYLE.text, DEFAULT_STYLE.title, titleStyle]}>
              {title}
            </Text>
          )}
          {statement && (
            <Text
              style={[
                DEFAULT_STYLE.text,
                DEFAULT_STYLE.statement,
                statementStyle
              ]}>
              {statement}
            </Text>
          )}
          {actionOption && (
            <Button
              {...toTestIds(actionTestId)}
              onPress={onAction}
              loading={loading}
              style={[actionStyle]}>
              {actionOption}
            </Button>
          )}
          {dismissOption && (
            <Button
              {...toTestIds(dismissTestId)}
              onPress={onDismiss}
              style={[
                { backgroundColor: APP_MEDIUM_GRAY, marginTop: 0 },
                dismissStyle
              ]}>
              {dismissOption}
            </Button>
          )}
        </View>
      </View>
    </Modal>
  );
};
