import React, { useState, useCallback, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView
} from 'react-native';
import { getVersion, getBuildNumber } from 'react-native-device-info';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { setLogoutRequest } from '../../Redux/AuthRedux';
import { getContentMetaTimestamp } from '../../Redux/ContentMetaRedux';
import {
  setDeleteUserRequest,
  getProfileSettingsLoading
} from '../../Redux/ProfileSettingsRedux';

import { ActionModal } from '../../Components';
import { SimpleFrame } from './Frames';
import {
  APP_ACCENT_RED,
  APP_BLACK,
  APP_DIVIDER_GRAY,
  APP_MEDIUM_GRAY,
  APP_WHITE,
  Fonts
} from '../../Themes';
import { toTestIds } from '../../Utils';

const ACTIONS = {
  LOGOUT: 'logout',
  DELETE: 'delete'
};

const ACTION_TEMPLATES = {
  [ACTIONS.LOGOUT]: {
    title: 'Logout',
    statement: 'Are you sure?',
    actionButon: 'Logout',
    cancelButton: 'Cancel'
  },
  [ACTIONS.DELETE]: {
    title: 'Delete Account',
    statement: 'Are you sure?',
    actionButon: 'Delete',
    cancelButton: 'Cancel'
  }
};

const ICON_SIZE = Fonts.size.normal + 2;

const STYLES = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 0
  },
  header: {
    ...Fonts.style.sectionHeader,
    color: APP_MEDIUM_GRAY,
    marginVertical: 8,
    marginLeft: 20
  },
  logout: {
    color: APP_ACCENT_RED
  },
  section: {
    borderBottomWidth: 0.25,
    borderColor: APP_DIVIDER_GRAY,
    marginBottom: 32
  },
  settingButton: {
    alignItems: 'center',
    backgroundColor: APP_WHITE,
    borderColor: APP_DIVIDER_GRAY,
    borderTopWidth: 0.25,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12
  },
  settingButtonText: {
    ...Fonts.style.normal,
    color: APP_BLACK
  }
});

const SettingButton = ({ label, onPress, textStyle, ...props }) => (
  <TouchableOpacity onPress={onPress} style={STYLES.settingButton} {...props}>
    <Text style={[STYLES.settingButtonText, textStyle]}>{label}</Text>
    <Icon color={APP_DIVIDER_GRAY} name="arrow-forward" size={ICON_SIZE} />
  </TouchableOpacity>
);

export const ProfileSettings = ({ navigation }) => {
  const contentTimestamp = useSelector(getContentMetaTimestamp);
  const contentMilliseconds = String(contentTimestamp).slice(-4);
  const versionText = `Version: ${getVersion()} (${getBuildNumber()}-${contentMilliseconds})`;

  const isSubmitting = useSelector(getProfileSettingsLoading);

  const getNavigator = route => () => {
    navigation.navigate(route);
  };

  const [currentAction, setCurrentAction] = useState(ACTIONS.LOGOUT);
  const [isVisible, setIsVisible] = useState(false);
  const actionTemplate = ACTION_TEMPLATES[currentAction];

  useEffect(() => {
    if (!isSubmitting) {
      setIsVisible(false);
    }
  }, [isSubmitting]);

  const dispatch = useDispatch();
  const dispatchLogout = useCallback(() => dispatch(setLogoutRequest()), [
    dispatch
  ]);

  const dispatchDeleteAccount = useCallback(
    () => dispatch(setDeleteUserRequest()),
    [dispatch]
  );

  const onLogout = () => {
    setCurrentAction(ACTIONS.LOGOUT);
    setIsVisible(true);
  };

  const onDelete = () => {
    setCurrentAction(ACTIONS.DELETE);
    setIsVisible(true);
  };

  const onConfirm = () => {
    if (currentAction === ACTIONS.DELETE) {
      dispatchDeleteAccount();
      return;
    }

    dispatchLogout();
  };

  const onDismiss = () => {
    if (isSubmitting) {
      return;
    }

    setIsVisible(false);
  };

  return (
    <SimpleFrame onBack={() => navigation.goBack()}>
      <ScrollView {...toTestIds('Content')} style={STYLES.container}>
        <View style={STYLES.section}>
          <Text style={STYLES.header}>Account Settings</Text>
          <SettingButton
            {...toTestIds('Set Date Of Birth')}
            label="Date of Birth"
            onPress={getNavigator('ProfileSettingsBirthDate')}
          />
          <SettingButton
            {...toTestIds('Set Gender')}
            label="Gender"
            onPress={getNavigator('ProfileSettingsGender')}
          />
        </View>
        <View style={STYLES.section}>
          <Text style={STYLES.header}>Advanced</Text>
          <SettingButton
            {...toTestIds('View Terms And Conditions')}
            label="Terms"
            onPress={getNavigator('ProfileSettingsTerms')}
          />
          <SettingButton
            {...toTestIds('View Privacy Policy')}
            label="Privacy"
            onPress={getNavigator('ProfileSettingsPrivacy')}
          />
          <SettingButton
            {...toTestIds('Logout')}
            label="Log out"
            onPress={onLogout}
            textStyle={STYLES.logout}
          />
          <SettingButton
            {...toTestIds('Delete Account')}
            label="Delete Account"
            onPress={onDelete}
            textStyle={STYLES.logout}
          />
        </View>
        <View style={STYLES.section}>
          <Text style={STYLES.header}>About</Text>
          <Text style={[STYLES.settingButton, STYLES.settingButtonText]}>
            {versionText}
          </Text>
        </View>
      </ScrollView>

      <ActionModal
        isVisible={isVisible}
        title={actionTemplate.title}
        statement={actionTemplate.statement}
        actionOption={actionTemplate.actionButon}
        dismissOption={actionTemplate.cancelButton}
        loading={isSubmitting}
        onAction={onConfirm}
        onDismiss={onDismiss}
      />
    </SimpleFrame>
  );
};
