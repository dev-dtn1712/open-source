import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { IconButton } from '../IconButton';
import { APP_DARK_GRAY, APP_WHITE, Fonts, Metrics } from '../../Themes';
import { toTestIds } from '../../Utils';

export const DEFAULT_STATUS_BAR_HEIGHT = 20;
export const DEFAULT_TOP_BAR_WITHOUT_STATUS_BAR = Metrics.navBarHeight;
export const DEFAULT_TOP_BAR_HEIGHT =
  DEFAULT_TOP_BAR_WITHOUT_STATUS_BAR + DEFAULT_STATUS_BAR_HEIGHT;

export const CENTER_PADDING = 8;

const DEFAULT_STYLES = StyleSheet.create({
  mainContainer: {
    position: 'absolute'
  },
  withStatusBar: {
    paddingTop: 0,
    height: DEFAULT_TOP_BAR_WITHOUT_STATUS_BAR
  },
  baseFlex: {
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: DEFAULT_STATUS_BAR_HEIGHT,
    height: DEFAULT_TOP_BAR_HEIGHT
  },
  container: {
    backgroundColor: APP_DARK_GRAY,
    width: '100%',
    position: 'relative'
  },
  leftContainer: {
    position: 'absolute',
    top: 0,
    left: 16,
    justifyContent: 'flex-start'
  },
  rightContainer: {
    position: 'absolute',
    top: 0,
    right: 16,
    justifyContent: 'flex-end'
  },
  title: {
    ...Fonts.style.title,
    textAlign: 'center',
    fontSize: Fonts.size.normal,
    color: APP_WHITE
  },
  itemLabel: {
    ...Fonts.style.normal
  },
  leftItemLabel: {
    marginLeft: 4
  },
  rightItemLabel: {
    marginRight: 4
  }
});

const calculateCenterWidth = (left, right) => {
  const limitedSize = Math.max(left, right) * 2;
  return Metrics.screenWidth - limitedSize - 32 - CENTER_PADDING;
};

export class TopBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      leftWidth: 0,
      rightWidth: 0
    };
  }

  onLayoutLeft = ({
    nativeEvent: {
      layout: { width }
    }
  }) => {
    this.setState({
      leftWidth: width
    });
  };

  onLayoutRight = ({
    nativeEvent: {
      layout: { width }
    }
  }) => {
    this.setState({
      rightWidth: width
    });
  };

  render() {
    const {
      title,
      titleStyle,
      onPressLeftItem,
      onPressRightItem,
      leftItemIcon = 'arrow-back',
      leftItemLabel = 'Back',
      leftItemStyle,
      leftItemTestId = 'Navigate Back',
      rightItemIcon,
      rightItemLabel,
      rightItemStyle,
      rightItemTestId,
      style,
      tintColor,
      withStatusBar = false,
      ...restProps
    } = this.props;

    const { leftWidth, rightWidth } = this.state;
    const titleMaxWidth = calculateCenterWidth(leftWidth, rightWidth);

    return (
      <View
        style={[
          DEFAULT_STYLES.container,
          DEFAULT_STYLES.baseFlex,
          withStatusBar && DEFAULT_STYLES.withStatusBar,
          DEFAULT_STYLES.mainContainer,
          style
        ]}
        {...restProps}>
        {onPressLeftItem && (
          <IconButton
            {...toTestIds(leftItemTestId)}
            color={tintColor || APP_WHITE}
            icon={leftItemIcon}
            label={leftItemLabel}
            labelStyle={[
              DEFAULT_STYLES.itemLabel,
              DEFAULT_STYLES.leftItemLabel,
              leftItemStyle
            ]}
            onPress={onPressLeftItem}
            style={[
              DEFAULT_STYLES.baseFlex,
              withStatusBar && DEFAULT_STYLES.withStatusBar,
              DEFAULT_STYLES.leftContainer
            ]}
            onLayout={this.onLayoutLeft}
          />
        )}
        {title && (
          <Text
            testID="title"
            style={[
              DEFAULT_STYLES.title,
              titleStyle,
              { maxWidth: titleMaxWidth }
            ]}
            ellipsizeMode="tail"
            numberOfLines={1}>
            {title}
          </Text>
        )}
        {onPressRightItem && (
          <IconButton
            {...toTestIds(rightItemTestId)}
            color={tintColor || APP_WHITE}
            icon={rightItemIcon}
            label={rightItemLabel}
            labelStyle={[
              DEFAULT_STYLES.itemLabel,
              DEFAULT_STYLES.rightItemLabel,
              rightItemStyle
            ]}
            onPress={onPressRightItem}
            style={[
              DEFAULT_STYLES.baseFlex,
              withStatusBar && DEFAULT_STYLES.withStatusBar,
              DEFAULT_STYLES.rightContainer
            ]}
            onLayout={this.onLayoutRight}
          />
        )}
      </View>
    );
  }
}
