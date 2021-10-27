import React, { useCallback } from 'react';
import {
  KeyboardAvoidingView,
  ScrollView,
  Text,
  View,
  Platform
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { getAuthError, setAuthError } from '../../Redux/AuthRedux';
import { getSignupUsername, setSignupUsername } from '../../Redux/SignupRedux';

import { Button, FullCard, InputField } from '../../Components';
import { APP_WHITE, APP_DARK_GRAY, APP_RED, Fonts, Images } from '../../Themes';
import { getUsernameTemplate } from '../../Services/TemplatesService';
import {
  getErrorMessage,
  isValidUsername,
  toTestIds,
  USERNAME_VALID_ERROR
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
  text: {
    ...Fonts.style.normal,
    color: APP_WHITE
  },
  errorText: {
    ...Fonts.style.normal,
    color: APP_RED
  },
  container: {
    flex: 1,
    backgroundColor: APP_DARK_GRAY,
    paddingBottom: 0
  },
  cardBody: {
    paddingVertical: 38
  }
};

export const RegistrationName = ({ navigation }) => {
  const dispatch = useDispatch();
  const { hint, statement, title } = getUsernameTemplate();
  const username = useSelector(getSignupUsername);
  const error = useSelector(getAuthError);

  const dispatchUsername = useCallback(
    value => dispatch(setSignupUsername(value)),
    [dispatch]
  );

  const dispatchError = useCallback(value => dispatch(setAuthError(value)), [
    dispatch
  ]);

  const onChangeText = value => {
    dispatchUsername(value);
  };

  const onSaveUsername = () => {
    if (isValidUsername(username)) {
      dispatchError(null);
      navigation.navigate('RegistrationEmail');
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
            onPress: onSaveUsername,
            disabled: !username
          })}
          image={Images.iconIdCard}
          title={title}>
          <Text style={STYLES.text}>{statement}</Text>
          <View style={STYLES.cardBody}>
            <InputField
              {...toTestIds('Username Input')}
              label={hint}
              onChangeText={onChangeText}
              value={username}
              autoFocus
            />
            {error && (
              <Text style={STYLES.errorText}>
                {getErrorMessage(error, USERNAME_VALID_ERROR)}
              </Text>
            )}
          </View>
        </FullCard>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
