import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

import { TopBar, DEFAULT_TOP_BAR_HEIGHT } from '../../Components';
import {
  APP_ACCENT_BLUE,
  APP_BLACK,
  APP_BRIGHT_GRAY,
  APP_WHITE
} from '../../Themes';
import { toTestIds } from '../../Utils';

const STYLES = StyleSheet.create({
  content: {
    height: '100%',
    flex: 1,
    marginTop: DEFAULT_TOP_BAR_HEIGHT
  },
  htmlFrame: {
    backgroundColor: APP_WHITE
  },
  paddedContainer: {
    alignItems: 'center',
    padding: 16,
    flex: 1
  },
  screen: {
    backgroundColor: APP_BRIGHT_GRAY,
    flex: 1
  },
  topBar: {
    backgroundColor: 'rgba(0,0,0,0)',
    height: DEFAULT_TOP_BAR_HEIGHT
  },
  topBarBackLabelStyle: {
    color: APP_ACCENT_BLUE
  },
  topBarTitleStyle: {
    color: APP_BLACK
  }
});

export const SimpleFrame = ({
  backLabel = 'Back',
  children,
  onBack,
  style,
  title,
  ...props
}) => (
  <SafeAreaView style={[STYLES.screen, style]} {...props}>
    <TopBar
      onPressLeftItem={onBack}
      leftItemLabel={backLabel}
      leftItemStyle={STYLES.topBarBackLabelStyle}
      style={STYLES.topBar}
      tintColor={APP_ACCENT_BLUE}
      title={title}
      titleStyle={STYLES.topBarTitleStyle}
    />
    <View style={STYLES.content}>{children}</View>
  </SafeAreaView>
);

export const PaddedFrame = ({ children, navigation, title, ...props }) => (
  <SimpleFrame
    backLabel=" "
    onBack={() => navigation.goBack()}
    title={title}
    {...props}>
    <View style={STYLES.paddedContainer}>{children}</View>
  </SimpleFrame>
);

export const HtmlFrame = ({ navigation, uri, ...props }) => (
  <SimpleFrame
    onBack={() => navigation.goBack()}
    style={STYLES.htmlFrame}
    {...props}>
    <WebView
      {...toTestIds('Content')}
      originWhitelist={['*']}
      source={{ uri }}
    />
  </SimpleFrame>
);
