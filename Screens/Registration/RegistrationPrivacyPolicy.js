import React from 'react';
import { SafeAreaView, StyleSheet, View, Platform } from 'react-native';
import { WebView } from 'react-native-webview';

import { TopBar, DEFAULT_TOP_BAR_HEIGHT } from '../../Components';
import { APP_ACCENT_BLUE, APP_BLACK, APP_WHITE } from '../../Themes';
import { toTestIds } from '../../Utils';

const TOP_BAR_TITLE = 'Privacy Policy';
const TOP_BAR_BACK_LABEL = 'Done';
const TOP_BAR_BACK_TEST_ID = 'Close Button';
const PRIVACY_POLICY_URI =
  Platform.OS === 'ios'
    ? './privacy-policy.html'
    : 'file:///android_asset/privacy-policy.html';

const STYLES = StyleSheet.create({
  content: {
    height: '100%',
    width: '100%',
    paddingTop: DEFAULT_TOP_BAR_HEIGHT
  },
  screen: {
    backgroundColor: APP_WHITE,
    flex: 1
  },
  topBar: {
    backgroundColor: 'rgba(0,0,0,0)'
  },
  topBarBackLabelStyle: {
    color: APP_ACCENT_BLUE
  },
  topBarTitleStyle: {
    color: APP_BLACK
  }
});

export const RegistrationPrivacyPolicy = ({ navigation }) => (
  <SafeAreaView style={STYLES.screen}>
    <TopBar
      onPressRightItem={() => navigation.goBack()}
      rightItemLabel={TOP_BAR_BACK_LABEL}
      rightItemStyle={STYLES.topBarBackLabelStyle}
      rightItemTestId={TOP_BAR_BACK_TEST_ID}
      style={STYLES.topBar}
      tintColor={APP_ACCENT_BLUE}
      title={TOP_BAR_TITLE}
      titleStyle={STYLES.topBarTitleStyle}
    />
    <View style={STYLES.content}>
      <WebView
        {...toTestIds('Content')}
        originWhitelist={['*']}
        source={{ uri: PRIVACY_POLICY_URI }}
      />
    </View>
  </SafeAreaView>
);
