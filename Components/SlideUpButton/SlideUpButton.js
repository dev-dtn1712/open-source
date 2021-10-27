import React from 'react';
import { StyleSheet } from 'react-native';
import { ActionModal } from '../ActionModal';
import { APP_MEDIUM_GRAY } from '../../Themes';
import { getTestId, omitTestIds } from '../../Utils';

const SLIDE_TIME = 300;

const DEFAULT_STYLES = StyleSheet.create({
  containerStyle: {
    backgroundColor: APP_MEDIUM_GRAY,
    marginHorizontal: 0,
    paddingBottom: 0,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0
  }
});

export const SlideUpButton = ({
  animationTime = SLIDE_TIME,
  buttonStyle,
  isVisible,
  onPress,
  containerStyle,
  title,
  ...props
}) => {
  return (
    <ActionModal
      coverScreen={false}
      hasBackdrop={false}
      animationTime={animationTime}
      isVisible={isVisible}
      actionOption={title}
      onAction={onPress}
      actionStyle={buttonStyle}
      actionTestId={getTestId(props)}
      containerStyle={[DEFAULT_STYLES.containerStyle, containerStyle]}
      {...omitTestIds(props)}
    />
  );
};
