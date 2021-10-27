import React from 'react';
import { SafeAreaView, StyleSheet, View, Text } from 'react-native';

import { Button, FullCard, TopBar } from '../../Components';
import {
  APP_DARK_GRAY,
  APP_FIELD_TEXT,
  APP_BLUE,
  Fonts,
  Images
} from '../../Themes';
import { toTestIds } from '../../Utils';

const TITLE = 'Create your profile.';
const STATEMENT =
  "You're on your way to making real connections that count! Let's start with the basics.";
const LEGAL_LINK_STATEMENT =
  'By clicking the “Get Started” button or by using the app, you are acknowledging that you have read, understood, and agree to our ';
const LINK_AND_STATEMENT = ' and ';
const LINK_END_STATEMENT = '.';
const PRIVACY_POLICY_EMPHASIS = 'Privacy Policy';
const TERMS_EMPHASIS = 'Terms of Service';

const STYLES = StyleSheet.create({
  screen: {
    backgroundColor: APP_DARK_GRAY,
    flex: 1
  },
  topBar: {
    position: 'relative'
  },
  text: {
    ...Fonts.style.normal,
    color: APP_FIELD_TEXT,
    marginBottom: 10
  },
  link: {
    color: APP_BLUE
  }
});

const getNavigator = ({ navigate }, route) => () => {
  navigate(route);
};

const getBackNavigator = ({ pop }) => () => {
  pop();
};

const getFooter = navigation => (
  <View>
    <Text style={STYLES.text}>
      {LEGAL_LINK_STATEMENT}
      <Text
        {...toTestIds('View Privacy Policy')}
        style={STYLES.link}
        onPress={getNavigator(navigation, 'RegistrationPrivacyPolicy')}>
        {PRIVACY_POLICY_EMPHASIS}
      </Text>
      {LINK_AND_STATEMENT}
      <Text
        {...toTestIds('View Terms And Conditions')}
        style={STYLES.link}
        onPress={getNavigator(navigation, 'RegistrationTerms')}>
        {TERMS_EMPHASIS}
      </Text>
      {LINK_END_STATEMENT}
    </Text>
    <Button
      {...toTestIds('Start Button')}
      onPress={getNavigator(navigation, 'RegistrationBirthday')}>
      Get Started!
    </Button>
  </View>
);

export const RegistrationStart = ({ navigation }) => (
  <SafeAreaView style={STYLES.screen}>
    <TopBar
      onPressLeftItem={getBackNavigator(navigation)}
      leftItemLabel="Welcome"
      style={STYLES.topBar}
    />
    <FullCard
      footer={getFooter(navigation)}
      image={Images.iconEasel}
      title={TITLE}>
      {STATEMENT}
    </FullCard>
  </SafeAreaView>
);
