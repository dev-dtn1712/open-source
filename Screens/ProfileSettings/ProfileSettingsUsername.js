import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import { PaddedFrame } from './Frames';
import { Input, Button } from '../../Components';
import { APP_DIVIDER_GRAY, APP_RED, Fonts } from '../../Themes';
import {
  isValidUsername,
  getErrorMessage,
  USERNAME_VALID_ERROR,
  toTestIds
} from '../../Utils';

import { getUsername } from '../../Redux/AuthRedux';
import {
  getProfileSettingsError,
  getProfileSettingsLoading,
  setChangeUsernameRequest,
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

export const ProfileSettingsUsername = ({ navigation }) => {
  const dispatch = useDispatch();
  const username = useSelector(getUsername);
  const isSubmitting = useSelector(getProfileSettingsLoading);
  const error = useSelector(getProfileSettingsError);
  const [currentName, setCurrentName] = useState(username);

  useEffect(() => {
    setCurrentName(username);

    return () => {
      dispatch(setProfileSettingsError(null));
    };
  }, [username]);

  const onChangeCurrentName = newVal => {
    setCurrentName(newVal);
  };

  const onSaveUsername = () => {
    dispatch(setChangeUsernameRequest(currentName));
    navigation.goBack();
  };

  const disabled = currentName === username || !isValidUsername(currentName);

  return (
    <PaddedFrame navigation={navigation} title="User Name">
      <View style={STYLES.wrapper}>
        <Input
          {...toTestIds('Username Input')}
          value={currentName}
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
        onPress={onSaveUsername}
        disabled={disabled}
        loading={isSubmitting}
        style={STYLES.button}>
        Save
      </Button>
    </PaddedFrame>
  );
};
