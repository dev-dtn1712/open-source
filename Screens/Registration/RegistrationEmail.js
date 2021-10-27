/* eslint-disable no-useless-escape */
import React, { useCallback } from 'react';
import {
  KeyboardAvoidingView,
  ScrollView,
  Text,
  View,
  Platform
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { getSignupEmail, setSignupEmail } from '../../Redux/SignupRedux';
import { getAuthError, setAuthError } from '../../Redux/AuthRedux';

import { Button, FullCard, InputField } from '../../Components';
import {
  APP_WHITE,
  APP_DARK_GRAY,
  APP_RED,
  Fonts,
  Images,
  Metrics
} from '../../Themes';
import {
  isValidEmail,
  getErrorMessage,
  toTestIds,
  EMAIL_VALID_ERROR
} from '../../Utils';

const getFooter = ({ disabled, onPress }) => {
  return (
    <Button {...toTestIds('Save Button')} onPress={onPress} disabled={disabled}>
      Save
    </Button>
  );
};

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
    paddingVertical: 38,
    flex: 1
  }
};

const EMAIL_TEMPLATE = {
  title: 'Email Address',
  statement:
    'How can we reach you to help you with things like resetting your password?',
  hint: 'Email Address'
};

export const RegistrationEmail = ({ navigation }) => {
  const dispatch = useDispatch();
  const { hint, statement, title } = EMAIL_TEMPLATE;
  const email = useSelector(getSignupEmail);
  const error = useSelector(getAuthError);
  const dispatchEmail = useCallback(value => dispatch(setSignupEmail(value)), [
    dispatch
  ]);
  const dispatchError = useCallback(value => dispatch(setAuthError(value)), [
    dispatch
  ]);

  const onChangeText = value => {
    dispatchEmail(value);
  };
  const onSaveEmail = () => {
    if (isValidEmail(email)) {
      dispatchError(null);
      navigation.navigate('RegistrationPassword');
    } else {
      dispatchError(true);
    }
  };

  return (
    <KeyboardAvoidingView
      style={STYLES.flexContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView {...toTestIds('Content')} style={STYLES.container}>
        <FullCard
          footer={getFooter({
            onPress: onSaveEmail,
            disabled: !email
          })}
          image={Images.iconMailbox}
          title={title}
          style={STYLES.card}
          bodyStyle={STYLES.body}>
          <Text style={STYLES.text}>{statement}</Text>
          <View style={STYLES.cardBody}>
            <InputField
              {...toTestIds('Email Input')}
              label={hint}
              onChangeText={onChangeText}
              value={email}
              keyboardType="email-address"
              autoCapitalize="none"
              autoFocus
            />
            {error && (
              <Text style={STYLES.errorText}>
                {getErrorMessage(error, EMAIL_VALID_ERROR)}
              </Text>
            )}
          </View>
        </FullCard>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
