import React from 'react';
import { Platform } from 'react-native';

import { HtmlFrame } from './Frames';

const TERMS_URI =
  Platform.OS === 'ios'
    ? './terms-of-service.html'
    : 'file:///android_asset/terms-of-service.html';

export const ProfileSettingsTerms = ({ navigation }) => (
  <HtmlFrame navigation={navigation} uri={TERMS_URI} />
);
