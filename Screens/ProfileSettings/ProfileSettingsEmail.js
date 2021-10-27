import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import { PaddedFrame } from './Frames';
import { Input, Button } from '../../Components';
import { APP_DIVIDER_GRAY, APP_RED, Fonts } from '../../Themes';
import {
  isValidEmail,
  getErrorMessage,
  USERNAME_VALID_ERROR,
  toTestIds
} from '../../Utils';

import { getUserEmail } from '../../Redux/AuthRedux';
import {
  getProfileSettingsError,
  getProfileSettingsLoading,
  setChangeEmailRequest,
  setProfileSettingsError
} from '../../Redux/ProfileSettingsRedux';

const STYLES = StyleSheet.create({
  input: {
    borderColor: APP_DIVIDER_GRAY,
    borderWidth: 0.5
  },
  button: {
    alignSelf: 'stretch'
  },
  errorText: {
    ...Fonts.style.normal,
    color: APP_RED,
    marginLeft: 16
  },
  wrapper: {
    alignSelf: 'stretch',
    flex: 1
  }
});

export const ProfileSettingsEmail = ({ navigation }) => {
  const dispatch = useDispatch();
  const email = useSelector(getUserEmail);
  const isSubmitting = useSelector(getProfileSettingsLoading);
  const error = useSelector(getProfileSettingsError);
  const [currentEmail, setCurrentEmail] = useState(email);

  useEffect(() => {
    setCurrentEmail(email);

    return () => {
      dispatch(setProfileSettingsError(null));
    };
  }, [email]);

  const onChangeCurrentName = newVal => {
    setCurrentEmail(newVal);
  };

  const onSaveEmail = () => {
    dispatch(setChangeEmailRequest(currentEmail));
    navigation.goBack();
  };

  const disabled = currentEmail === email || !isValidEmail(currentEmail);

  return (
    <PaddedFrame navigation={navigation} title="Email">
      <View style={STYLES.wrapper}>
        <Input
          {...toTestIds('Username Input')}
          value={currentEmail}
          onChangeText={onChangeCurrentName}
          style={STYLES.input}
        />
        {error && (
          <Text style={STYLES.errorText}>
            {getErrorMessage(error, USERNAME_VALID_ERROR)}
          </Text>
        )}
      </View>
      <Button
        {...toTestIds('Save Button')}
        onPress={onSaveEmail}
        disabled={disabled}
        loading={isSubmitting}
        style={STYLES.button}>
        Save
      </Button>
    </PaddedFrame>
  );
};
