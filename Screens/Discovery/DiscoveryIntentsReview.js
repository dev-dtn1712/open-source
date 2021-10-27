import React, { useState, useCallback, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  StyleSheet,
  Text,
  BackHandler
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { flow } from 'lodash';

import { getUsername } from '../../Redux/AuthRedux';
import {
  initializeSession,
  getAlignedIntents,
  setOutgoingCompareInvite
} from '../../Redux/SessionRedux';

import { ScrollSurface } from '../../Containers/ScrollSurface';
import {
  DEFAULT_TOP_BAR_HEIGHT,
  InitialsCircle,
  ActionModal,
  IntentCard,
  SecondaryButton
} from '../../Components';
import {
  APP_DARK_GRAY,
  APP_LIGHT_GRAY,
  APP_WHITE,
  Fonts,
  COLOR_PALETTE
} from '../../Themes';
import { toTestIds } from '../../Utils';

import { CompareInviteModals } from './CompareInviteModals';

const HEADER_HEIGHT = 280;

const TITLE = 'Matching Intents';
const STATEMENT =
  'Select an intent from the list below to learn more about how the two of you align.';

const VERIFY_DISCONNECT_ACTION_TITLE = 'Exit Discovery';
const VERIFY_DISCONNECT_ACTION_STATEMENT =
  'Are you sure you want to exit the connection with this person?';

const STYLES = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: APP_DARK_GRAY
  },
  headerWrapper: {
    backgroundColor: APP_DARK_GRAY,
    height: HEADER_HEIGHT,
    paddingHorizontal: 16,
    overflow: 'hidden'
  },
  headerBody: {
    flex: 1,
    paddingTop: DEFAULT_TOP_BAR_HEIGHT,
    alignItems: 'center'
  },
  avatarView: {
    marginTop: 0
  },
  titleLabel: {
    ...Fonts.style.title,
    color: APP_WHITE,
    marginTop: 26
  },
  textLabel: {
    ...Fonts.style.normal,
    color: APP_WHITE,
    textAlign: 'center',
    marginTop: 9
  },
  exitButton: {
    marginTop: 'auto'
  },
  exitButtonText: {
    color: APP_LIGHT_GRAY
  },
  contentContainer: {
    flex: 1,
    backgroundColor: APP_DARK_GRAY,
    paddingHorizontal: 8,
    marginTop: 16,
    marginBottom: 8
  }
});

const renderHeaderWrapper = name => (
  <View style={STYLES.headerWrapper}>
    <View style={STYLES.headerBody}>
      <InitialsCircle text={name} style={[STYLES.avatarView]} />
      <Text style={STYLES.titleLabel}>{TITLE}</Text>
      <Text style={STYLES.textLabel}>{STATEMENT}</Text>
    </View>
  </View>
);

export const DiscoveryIntentsReview = ({ navigation }) => {
  const name = useSelector(getUsername);
  const alignedIntents = useSelector(getAlignedIntents);

  const [verifyDisconnectAction, setVerifyDisconnectAction] = useState(false);

  const dispatch = useDispatch();
  const dispatchDisconnect = useCallback(
    () => dispatch(initializeSession(null)),
    [dispatch]
  );
  const dispatchCompareInvite = useCallback(
    flow([setOutgoingCompareInvite, dispatch]),
    [dispatch]
  );

  const handleBackButtonPressAndroid = useCallback(() => {
    if (!navigation.isFocused()) {
      return false;
    }

    return true;
  }, [navigation]);

  useEffect(() => {
    BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackButtonPressAndroid
    );

    return () => {
      BackHandler.removeEventListener(
        'hardwareBackPress',
        handleBackButtonPressAndroid
      );
    };
  }, [handleBackButtonPressAndroid]);

  const disconnectDiscovery = () => {
    dispatchDisconnect();
    setVerifyDisconnectAction(false);
  };

  const addressDisconnectRequest = () => {
    const isMultipeerActive = true; // will be replaced with connection manager's isMultipeerActive
    if (isMultipeerActive) {
      setVerifyDisconnectAction(true);
    } else {
      navigation.navigate('DiscoveryScanning');
    }
  };

  const onPressIntent = ({ uuid }) => {
    dispatchCompareInvite({ intentId: uuid });
  };

  return (
    <SafeAreaView style={STYLES.screen}>
      <ScrollSurface
        contentStyle={{
          backgroundColor: APP_DARK_GRAY
        }}>
        {renderHeaderWrapper(name)}
        <View style={STYLES.contentContainer}>
          {alignedIntents.map(intentMatch => {
            const { uuid, title, style, glyphs } = intentMatch.template;
            const intentSharing = false;
            return (
              <IntentCard
                {...toTestIds(title)}
                key={uuid}
                glyph={glyphs}
                title={title}
                intentSharing={intentSharing}
                style={{
                  backgroundColor: COLOR_PALETTE[style]
                }}
                onPress={() => onPressIntent(intentMatch)}
              />
            );
          })}
        </View>
      </ScrollSurface>
      <SecondaryButton
        onPress={addressDisconnectRequest}
        style={STYLES.exitButton}
        textStyle={STYLES.exitButtonText}>
        Exit
      </SecondaryButton>
      <ActionModal
        isVisible={verifyDisconnectAction}
        title={VERIFY_DISCONNECT_ACTION_TITLE}
        statement={VERIFY_DISCONNECT_ACTION_STATEMENT}
        actionOption="Leave"
        dismissOption="Stay"
        onAction={disconnectDiscovery}
        onDismiss={() => setVerifyDisconnectAction(false)}
      />
      <CompareInviteModals />
    </SafeAreaView>
  );
};
