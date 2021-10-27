import React, { useState, useCallback, useEffect } from 'react';
import {
  KeyboardAvoidingView,
  ScrollView,
  SafeAreaView,
  Text,
  View,
  Platform
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import {
  setForgotRequest,
  setAuthError,
  getAuthError,
  getAuthLoading
} from '../../Redux/AuthRedux';

import {
  ActionModal,
  Button,
  InputField,
  TopBar,
  DEFAULT_TOP_BAR_HEIGHT
} from '../../Components';
import {
  APP_WHITE,
  APP_DARK_GRAY,
  APP_RED,
  Fonts,
  Metrics
} from '../../Themes';
import {
  isValidEmail,
  EMAIL_VALID_ERROR,
  getErrorMessage,
  toTestIds
} from '../../Utils';

const getBackNavigator = ({ pop }) => () => {
  pop();
};

const EMAIL_TITLE = 'Check Your Email';
const EMAIL_STATEMENT =
  'If we matched your user, you will receive an email link to reset your password.';

const DESCRIPTION =
  'Please enter the email you signed up with and we’ll email you a recovery link to reset your password.';

const STYLES = {
  flexContainer: {
    flex: 1
  },
  screen: {
    backgroundColor: APP_DARK_GRAY,
    flex: 1
  },
  topBar: {
    position: 'relative'
  },
  text: {
    ...Fonts.style.normal,
    color: APP_WHITE
  },
  errorText: {
    ...Fonts.style.normal,
    color: APP_RED,
    paddingHorizontal: 16
  },
  container: {
    flex: 1,
    backgroundColor: APP_DARK_GRAY,
    paddingVertical: 0
  },
  cardBody: {
    height: Metrics.screenHeight - DEFAULT_TOP_BAR_HEIGHT - 32,
    justifyContent: 'space-between',
    paddingHorizontal: 16
  }
};

export const Forgot = ({ navigation }) => {
  const dispatch = useDispatch();
  const isSubmitting = useSelector(getAuthLoading);
  const authError = useSelector(getAuthError);

  const [email, setEmail] = useState(navigation.getParam('email', ''));
  const [error, setError] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const dispatchForgot = useCallback(
    value => dispatch(setForgotRequest(value)),
    [dispatch]
  );

  const dispatchError = useCallback(value => dispatch(setAuthError(value)), [
    dispatch
  ]);

  useEffect(() => {
    dispatchError(null);

    return () => {
      dispatchError(null);
    };
  }, []);

  useEffect(() => {
    setError(authError);
  }, [authError]);

  const onChangeEmail = value => {
    setEmail(value);
  };

  const onAction = () => {
    navigation.pop();
  };

  const onForgot = () => {
    if (!isValidEmail(email)) {
      setError({
        message: EMAIL_VALID_ERROR
      });
      return;
    }

    setError(false);
    setIsVisible(true);

    dispatchForgot({
      email
    });
  };

  return (
    <SafeAreaView style={STYLES.screen}>
      <TopBar
        onPressLeftItem={getBackNavigator(navigation)}
        style={STYLES.topBar}
      />
      <KeyboardAvoidingView
        style={STYLES.flexContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView {...toTestIds('Content')} style={STYLES.container}>
          <View style={STYLES.cardBody}>
            <Text style={STYLES.text}>{DESCRIPTION}</Text>
            <View>
              <InputField
                {...toTestIds('Email Input')}
                onChangeText={onChangeEmail}
                value={email}
                label="Email Address"
                placeholder="Enter your email address"
                keyboardType="email-address"
                autoCapitalize="none"
              />

              {error && (
                <Text style={STYLES.errorText}>
                  {getErrorMessage(error, EMAIL_VALID_ERROR)}
                </Text>
              )}
            </View>
            <Button
              {...toTestIds('Send Reset Link Button')}
              onPress={onForgot}
              disabled={isSubmitting || !email}>
              Send Reset Link
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <ActionModal
        isVisible={isVisible}
        title={EMAIL_TITLE}
        statement={EMAIL_STATEMENT}
        actionOption="Got it"
        onAction={onAction}
      />
    </SafeAreaView>
  );
};
