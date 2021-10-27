import React, { useEffect, useRef } from 'react';
import { AppState, View, Linking, StatusBar } from 'react-native';
import { connect } from 'react-redux';

import ReduxNavigation from '../../Navigation/ReduxNavigation';
import { startup } from '../../Redux/AppRedux';
import { getUserId } from '../../Redux/AuthRedux';
import { setIsScanning } from '../../Redux/ConnectionRedux';
import { isDiscoveryScanningScreen, isDarkStatusBarScreen } from '../../Utils';

import { isShareUrl, shareApp } from '../../Services/ShareService';

// Styles
import styles from './RootContainerStyles';

function RootContainer({ startApp, setScanning, nav, userId }) {
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    startApp();
  }, []);

  const onAppStateChange = nextAppState => {
    if (isDiscoveryScanningScreen(nav)) {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        setScanning(true);
      } else {
        setScanning(false);
      }
    }

    appState.current = nextAppState;
  };

  const handleShareApp = async () => {
    await shareApp(userId);
  };

  const listenAppUrl = ({ url }) => {
    if (isShareUrl(url)) {
      handleShareApp();
    }
  };

  useEffect(() => {
    AppState.addEventListener('change', onAppStateChange);
    Linking.addEventListener('url', listenAppUrl);
    return () => {
      AppState.removeEventListener('change', onAppStateChange);
      Linking.removeEventListener('url', listenAppUrl);
    };
  }, []);

  const isDarkStatusBar = isDarkStatusBarScreen(nav);
  return (
    <View style={styles.applicationView}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={isDarkStatusBar ? 'dark-content' : 'light-content'}
      />
      <ReduxNavigation />
    </View>
  );
}

// wraps dispatch to create nicer functions to call within our component
const mapStateToProps = state => ({
  nav: state.nav,
  userId: getUserId(state)
});

const mapDispatchToProps = dispatch => ({
  startApp: () => dispatch(startup()),
  setScanning: isScanning => dispatch(setIsScanning(isScanning))
});

export default connect(mapStateToProps, mapDispatchToProps)(RootContainer);
