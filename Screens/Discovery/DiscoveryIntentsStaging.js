import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, Text, BackHandler } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { flow, has, isEmpty } from 'lodash';

import {
  initializeSession,
  selectIntentsToShare
} from '../../Redux/SessionRedux';
import { getActivatedIntents } from '../../Redux/MetadataRedux';
import { getResponses } from '../../Redux/ResponsesRedux';
import { getTemplatesByUuids } from '../../Services/TemplatesService';

import {
  DEFAULT_TITLE_HEIGHT,
  ScrollSurface
} from '../../Containers/ScrollSurface';
import {
  DEFAULT_TOP_BAR_HEIGHT,
  ActionModal,
  IntentCard,
  SlideUpButton
} from '../../Components';
import {
  APP_DARK_GRAY,
  APP_WHITE,
  APP_ACCENT_BLUE,
  Fonts,
  COLOR_PALETTE
} from '../../Themes';
import { toTestIds } from '../../Utils';

const HEADER_HEIGHT = 240;

const TITLE = 'Select your intents';
const STATEMENT =
  'Pick which types of relationships you’d like to share with this person. You don’t have share certain ones if you’re not comfortable.';

const VERIFY_DISCONNECT_ACTION_TITLE = 'Exit Discovery';
const VERIFY_DISCONNECT_ACTION_STATEMENT =
  'Are you sure you want to exit the connection with this person?';
const PRIVACY_NOTICE_ACTION_TITLE = 'Choose What to Reveal';
const PRIVACY_NOTICE_ACTION_STATEMENT =
  'Select which intents you’re comfortable exploring with this person.';
const SKIP_ALERT_ACTION_TITLE = 'Show All Intents';
const SKIP_ALERT_ACTION_STATEMENT =
  'Are you sure you want to show %@ all of your active intents?';
const STAGING_WAIT_ACTION_TITLE = 'Waiting for Partner';
const STAGING_WAIT_ACTION_STATEMENT =
  'Tell your partner to hurry up and select which intents they want to share with you.';

const STYLES = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: APP_WHITE
  },
  headerWrapper: {
    backgroundColor: APP_DARK_GRAY,
    height: HEADER_HEIGHT,
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomRightRadius: 16,
    borderBottomLeftRadius: 16,
    overflow: 'hidden'
  },
  textLabel: {
    ...Fonts.style.normal,
    color: APP_WHITE,
    marginTop: DEFAULT_TOP_BAR_HEIGHT + DEFAULT_TITLE_HEIGHT + 26
  },
  buttonContainer: {
    backgroundColor: APP_WHITE
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 8,
    marginVertical: 16,
    paddingBottom: 100
  },
  intentCard: {
    marginBottom: 16
  }
});

const getActivatedIntentTemplates = () => {
  const activeIntents = useSelector(getActivatedIntents);
  return getTemplatesByUuids(Array.from(activeIntents)).sort(
    (a, b) => a.naturalOrder > b.naturalOrder
  );
};

const getActiveIntentsWithResponses = (responsesObj, activatedIntents) => {
  if (isEmpty(responsesObj)) {
    return false;
  }

  return activatedIntents.filter(intent => {
    const { surveys } = intent;
    return surveys
      .flatMap(({ queries }) => queries)
      .flatMap(({ responses }) => responses)
      .some(({ uuid }) => has(responsesObj, uuid));
  });
};

export const DiscoveryIntentsStaging = ({ navigation }) => {
  const [selectedIntents, setSelectedIntents] = useState([]);

  const [verifyDisconnectAction, setVerifyDisconnectAction] = useState(false);
  const [privacyNoticeAction, setPrivacyNoticeAction] = useState(false);
  const [skipAlertAction, setSkipAlertAction] = useState(false);
  const [stagingWaitAction, setStagingWaitAction] = useState(false);

  const intentsSet = new Set(selectedIntents);

  const responsesObj = useSelector(getResponses);
  const activatedIntents = getActivatedIntentTemplates();
  const activeIntentsWithResponses = getActiveIntentsWithResponses(
    responsesObj,
    activatedIntents
  );

  const dispatch = useDispatch();
  const dispatchDisconnect = useCallback(
    () => dispatch(initializeSession(null)),
    [dispatch]
  );
  const dispatchSelectedIntents = useCallback(
    flow([selectIntentsToShare, dispatch]),
    [dispatch]
  );

  const disconnectDiscovery = () => {
    dispatchDisconnect();
    setVerifyDisconnectAction(false);
  };

  const saveIntents = () => {
    dispatchSelectedIntents(selectedIntents);
    setStagingWaitAction(true);
  };

  const enableAllAndContinue = () => {
    const intentIds = activeIntentsWithResponses.map(({ uuid }) => uuid);
    setSelectedIntents(new Set(intentIds));
    dispatchSelectedIntents(intentIds);
    setSkipAlertAction(false);
    setStagingWaitAction(true);
  };

  const onShareToggled = (uuid, isToggled) => {
    if (isToggled) {
      intentsSet.add(uuid);
      setSelectedIntents(Array.from(intentsSet));
    } else {
      intentsSet.delete(uuid);
      setSelectedIntents(Array.from(intentsSet));
    }
  };

  useEffect(() => {
    // Dismiss modals when user navigates away
    const willBlurListener = navigation.addListener('willBlur', () => {
      setPrivacyNoticeAction(false);
      setSkipAlertAction(false);
      setStagingWaitAction(false);
    });

    return () => {
      willBlurListener.remove();
    };
  }, []);

  const onBack = () => setVerifyDisconnectAction(true);
  const handleBackButtonPressAndroid = useCallback(() => {
    if (!navigation.isFocused()) {
      return false;
    }

    onBack();
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

  return (
    <View style={STYLES.screen}>
      <ScrollSurface
        title={TITLE}
        topBarProps={{
          tintColor: APP_ACCENT_BLUE,
          leftItemLabel: '',
          onPressLeftItem: onBack,
          rightItemLabel: 'Skip',
          rightItemTestId: 'Skip Button',
          onPressRightItem: () => setSkipAlertAction(true)
        }}>
        <View style={STYLES.headerWrapper}>
          <Text style={STYLES.textLabel}>{STATEMENT}</Text>
        </View>
        <View style={STYLES.contentContainer}>
          {activeIntentsWithResponses.map(({ uuid, title, style, glyphs }) => (
            <IntentCard
              {...toTestIds(title)}
              key={uuid}
              glyph={glyphs}
              title={title}
              style={[
                STYLES.intentCard,
                {
                  backgroundColor: COLOR_PALETTE[style]
                }
              ]}
              onToggle={isToggled => onShareToggled(uuid, isToggled)}
            />
          ))}
        </View>
      </ScrollSurface>
      <SlideUpButton
        {...toTestIds('Save Button')}
        isVisible={selectedIntents.length > 0}
        onPress={saveIntents}
        containerStyle={STYLES.buttonContainer}
        title="Save"
      />
      <ActionModal
        isVisible={verifyDisconnectAction}
        title={VERIFY_DISCONNECT_ACTION_TITLE}
        statement={VERIFY_DISCONNECT_ACTION_STATEMENT}
        actionOption="Leave"
        dismissOption="Stay"
        onAction={disconnectDiscovery}
        onDismiss={() => setVerifyDisconnectAction(false)}
      />
      <ActionModal
        isVisible={privacyNoticeAction}
        title={PRIVACY_NOTICE_ACTION_TITLE}
        statement={PRIVACY_NOTICE_ACTION_STATEMENT}
        actionOption="Got it!"
        onAction={() => setPrivacyNoticeAction(false)}
        onDismiss={() => setPrivacyNoticeAction(false)}
      />
      <ActionModal
        isVisible={skipAlertAction}
        title={SKIP_ALERT_ACTION_TITLE}
        statement={SKIP_ALERT_ACTION_STATEMENT}
        actionOption="Show Everything"
        dismissOption="Nevermind"
        onAction={enableAllAndContinue}
        onDismiss={() => setSkipAlertAction(false)}
      />
      <ActionModal
        isVisible={stagingWaitAction}
        title={STAGING_WAIT_ACTION_TITLE}
        statement={STAGING_WAIT_ACTION_STATEMENT}
        actionOption="Close"
        onAction={() => setStagingWaitAction(false)}
        onDismiss={() => setStagingWaitAction(false)}
      />
    </View>
  );
};
