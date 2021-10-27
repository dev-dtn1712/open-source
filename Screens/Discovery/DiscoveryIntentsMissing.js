import React from 'react';
import { StyleSheet, Image, Text, View } from 'react-native';

import { TopBar, DEFAULT_TOP_BAR_HEIGHT, Button } from '../../Components';
import { APP_DARK_GRAY, APP_WHITE, Fonts, Images, Metrics } from '../../Themes';
import { toTestIds } from '../../Utils';

const TITLE = 'Just one thing...';
const STATEMENT =
  'Tell us about yourself! After all, if we don’t know what you want, we can’t help you have that conversation. Start your Intents so you and your (potential) partner can see where you align.';
const BUTTON_LABEL = 'Get Started';

const STYLES = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: APP_DARK_GRAY
  },
  content: {
    flex: 1,
    marginTop: DEFAULT_TOP_BAR_HEIGHT,
    padding: 16
  },
  text: {
    textAlign: 'center',
    color: APP_WHITE
  },
  title: {
    ...Fonts.style.title,
    marginTop: 6
  },
  statement: {
    ...Fonts.style.normal,
    marginTop: 8,
    marginHorizontal: 16,
    marginBottom: 'auto'
  },
  image: {
    resizeMode: 'contain',
    alignSelf: 'center',
    width: Metrics.screenWidth - 128
  },
  button: {
    marginTop: 'auto',
    marginBottom: 30
  }
});

export const DiscoveryIntentsMissing = ({ navigation }) => {
  const getNavigator = route => () => {
    navigation.navigate(route);
  };

  return (
    <View style={STYLES.screen}>
      <TopBar onPressLeftItem={getNavigator('DiscoveryIntro')} />
      <View style={STYLES.content}>
        <Text style={[STYLES.text, STYLES.title]}>{TITLE}</Text>
        <Text style={[STYLES.text, STYLES.statement]}>{STATEMENT}</Text>
        <Image source={Images.intentCards} style={STYLES.image} />
        <Button
          {...toTestIds('Start Intents Button')}
          onPress={getNavigator('Intents')}
          style={STYLES.button}>
          {BUTTON_LABEL}
        </Button>
      </View>
    </View>
  );
};
