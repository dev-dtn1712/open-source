import React from 'react';
import { Platform } from 'react-native';

import { HtmlFrame } from './Frames';

const PRIVACY_POLICY_URI =
  Platform.OS === 'ios'
    ? './privacy-policy.html'
    : 'file:///android_asset/privacy-policy.html';

export const ProfileSettingsPrivacy = ({ navigation }) => (
  <HtmlFrame navigation={navigation} uri={PRIVACY_POLICY_URI} />
);
