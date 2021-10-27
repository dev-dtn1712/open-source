import React, { useCallback } from 'react';
import {
  KeyboardAvoidingView,
  ScrollView,
  Text,
  View,
  Platform
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import {
  setSignupRequest,
  getAuthError,
  setAuthError,
  getAuthLoading
} from '../../Redux/AuthRedux';
import {
  getSignupValues,
  getSignupPassword,
  setSignupPassword
} from '../../Redux/SignupRedux';

import { Button, FullCard, InputField, ProgressHUD } from '../../Components';
import {
  APP_WHITE,
  APP_DARK_GRAY,
  APP_RED,
  Fonts,
  Images,
  Metrics
} from '../../Themes';
import {
  isValidPassword,
  getErrorMessage,
  toTestIds,
  PASSWORD_VALID_ERROR
} from '../../Utils';

const STYLES = {
  flexContainer: {
    flex: 1
  },
  body: {
    flex: 1
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
    paddingBottom: 0
  },
  card: {
    height: Metrics.screenHeight
  },
  cardBody: {
    paddingVertical: 38
  }
};

const PASSWORD_TEMPLATE = {
  title: 'Create a Password',
  statement:
    'Secure your account with a strong password.\n  • 8 or more characters in length\n  • Lower case letters (a-z)\n  • Upper case letters (A-Z)\n  • Number (i.e. 0-9)\n  • Special Characters (e.g. !@#$%^&*)',
  hint: 'Password'
};

const getFooter = ({ disabled, onPress }) => {
  return (
    <Button {...toTestIds('Save Button')} onPress={onPress} disabled={disabled}>
      Save
    </Button>
  );
};

export const RegistrationPassword = () => {
  const dispatch = useDispatch();
  const signupValues = useSelector(getSignupValues);
  const { hint, statement, title } = PASSWORD_TEMPLATE;
  const isSubmitting = useSelector(getAuthLoading);
  const error = useSelector(getAuthError);
  const password = useSelector(getSignupPassword);

  const dispatchPassword = useCallback(
    value => dispatch(setSignupPassword(value)),
    [dispatch]
  );

  const dispatchError = useCallback(value => dispatch(setAuthError(value)), [
    dispatch
  ]);

  const dispatchSignup = useCallback(
    value => dispatch(setSignupRequest(value)),
    [dispatch]
  );

  const onChangeText = value => {
    dispatchPassword(value);
  };
  const onSavePassword = () => {
    if (isValidPassword(password)) {
      dispatchError(null);
      dispatchSignup({
        ...signupValues
      });
    } else {
      dispatchError(true);
    }
  };

  return (
    <KeyboardAvoidingView
      style={STYLES.flexContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView {...toTestIds('Screen')} style={STYLES.container}>
        <FullCard
          footer={getFooter({
            onPress: onSavePassword,
            disabled: !password || isSubmitting
          })}
          image={Images.iconKey}
          title={title}
          style={STYLES.card}
          bodyStyle={STYLES.body}>
          <Text style={STYLES.text}>{statement}</Text>
          <View style={STYLES.cardBody}>
            <InputField
              {...toTestIds('Password Input')}
              label={hint}
              onChangeText={onChangeText}
              value={password}
              secureTextEntry
              autoCapitalize="none"
              autoFocus
            />
            {error && (
              <Text style={STYLES.errorText}>
                {getErrorMessage(error, PASSWORD_VALID_ERROR)}
              </Text>
            )}
          </View>
        </FullCard>
        <ProgressHUD isVisible={isSubmitting} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
