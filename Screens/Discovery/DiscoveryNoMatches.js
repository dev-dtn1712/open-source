import React, { useState, useCallback } from 'react';
import { StyleSheet, Image, Text, View } from 'react-native';
import { useDispatch } from 'react-redux';

import { initializeSession } from '../../Redux/SessionRedux';

import { Button, SecondaryButton, ActionModal, TopBar } from '../../Components';
import {
  APP_DARK_GRAY,
  APP_LIGHT_GRAY,
  APP_WHITE,
  APP_ACCENT_BLUE,
  Fonts,
  Images
} from '../../Themes';
import { toTestIds } from '../../Utils';

const TITLE = 'Alignment Missing';
const STATEMENT =
  'Oh no! It looks like you two haven’t found any intents you are compatible on or may not align on your must-haves and nice-to-haves. Try completing your profile, filling out more information in each intent, or selecting new intents.';

const VERIFY_DISCONNECT_ACTION_TITLE = 'Exit Discovery';
const VERIFY_DISCONNECT_ACTION_STATEMENT =
  'Are you sure you want to exit the connection with this person?';

const STYLES = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: APP_DARK_GRAY
  },
  topBar: {
    position: 'relative'
  },
  content: {
    flex: 1,
    paddingHorizontal: 16
  },
  image: {
    resizeMode: 'cover',
    alignSelf: 'center',
    marginTop: 34
  },
  text: {
    textAlign: 'center',
    color: APP_WHITE
  },
  title: {
    ...Fonts.style.title,
    marginTop: 56
  },
  statement: {
    ...Fonts.style.normal,
    marginTop: 8
  },
  button: {
    marginHorizontal: 10,
    marginVertical: 4
  },
  exitText: {
    color: APP_LIGHT_GRAY
  }
});

export const DiscoveryNoMatches = ({ navigation }) => {
  const [verifyDisconnectAction, setVerifyDisconnectAction] = useState(false);

  const dispatch = useDispatch();
  const dispatchDisconnect = useCallback(
    () => dispatch(initializeSession(null)),
    [dispatch]
  );

  const disconnectDiscovery = () => {
    dispatchDisconnect();
    setVerifyDisconnectAction(false);
  };

  const getNavigator = route => () => {
    navigation.navigate(route);
  };

  return (
    <View style={STYLES.screen}>
      <TopBar
        onPressLeftItem={getNavigator('DiscoveryIntentsStaging')}
        leftItemLabel="Retry"
        style={STYLES.topBar}
        tintColor={APP_ACCENT_BLUE}
      />
      <View style={STYLES.content}>
        <Image source={Images.discoveryNoMatches} style={STYLES.image} />
        <Text style={[STYLES.text, STYLES.title]}>{TITLE}</Text>
        <Text style={[STYLES.text, STYLES.statement]}>{STATEMENT}</Text>
        <Button
          {...toTestIds('Reselect Intents Button')}
          onPress={getNavigator('DiscoveryIntentsStaging')}
          style={[STYLES.button, { marginTop: 'auto' }]}>
          Reselect Intents
        </Button>
        <SecondaryButton
          {...toTestIds('Exit Button')}
          onPress={() => setVerifyDisconnectAction(true)}
          style={STYLES.button}
          textStyle={STYLES.exitText}>
          Exit
        </SecondaryButton>
      </View>
      <ActionModal
        isVisible={verifyDisconnectAction}
        title={VERIFY_DISCONNECT_ACTION_TITLE}
        statement={VERIFY_DISCONNECT_ACTION_STATEMENT}
        actionOption="Leave"
        dismissOption="Stay"
        onAction={disconnectDiscovery}
        onDismiss={() => setVerifyDisconnectAction(false)}
      />
    </View>
  );
};
