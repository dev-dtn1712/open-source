import React from 'react';
import { StyleSheet, Modal, Text, View, ActivityIndicator } from 'react-native';
// import Modal from 'react-native-modal';

import { APP_WHITE, APP_BLACK, Fonts } from '../../Themes';

const DEFAULT_STYLE = StyleSheet.create({
  containerBox: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  },
  backDrop: {
    backgroundColor: APP_BLACK,
    opacity: 0.45
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  hudContainer: {
    backgroundColor: APP_BLACK,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    opacity: 0.9
  },
  activity: {},
  text: {
    ...Fonts.style.normal,
    textAlign: 'center',
    color: APP_WHITE,
    marginTop: 8
  }
});

export const ProgressHUD = ({
  isVisible = false,
  hasBackdrop = false,
  activityColor = APP_WHITE,
  title = 'Please Wait',
  style,
  containerStyle,
  activityStyle,
  titleStyle,
  ...props
}) => {
  const transparent = true;
  return (
    <Modal
      style={[DEFAULT_STYLE.containerBox, style]}
      transparent={transparent}
      animationType="none"
      visible={isVisible}
      statusBarTranslucent
      {...props}>
      {hasBackdrop && (
        <View style={[DEFAULT_STYLE.containerBox, DEFAULT_STYLE.backDrop]} />
      )}
      <View style={DEFAULT_STYLE.content}>
        <View style={[DEFAULT_STYLE.hudContainer, containerStyle]}>
          <ActivityIndicator
            size="large"
            style={[DEFAULT_STYLE.activity, activityStyle]}
            color={activityColor}
          />
          {title && (
            <Text style={[DEFAULT_STYLE.text, titleStyle]}>{title}</Text>
          )}
        </View>
      </View>
    </Modal>
  );
};
