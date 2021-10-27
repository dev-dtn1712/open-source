import React from 'react';
import { StyleSheet, Image, Text, View } from 'react-native';

import { Button } from '../../Components';
import { APP_DARK_GRAY, APP_WHITE, Fonts, Images, Metrics } from '../../Themes';
import { toTestIds } from '../../Utils';

const TITLE = 'Relationship Types';
const STATEMENT =
  'We call different types of relationships "Intents" to help you divide the types of relationships and what you want in out of each one.';

const STYLES = StyleSheet.create({
  button: {
    marginBottom: 32,
    marginTop: 'auto'
  },
  card: {
    backgroundColor: APP_DARK_GRAY,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    flex: 1,
    paddingHorizontal: 8,
    paddingTop: 32
  },
  screen: {
    backgroundColor: APP_WHITE,
    height: '100%',
    width: '100%'
  },
  tags: {
    height: Metrics.screenWidth,
    resizeMode: 'contain',
    width: Metrics.screenWidth
  },
  statement: {
    marginTop: 12
  },
  text: {
    textAlign: 'center',
    color: APP_WHITE
  }
});

const getNavigator = ({ navigate }) => () => navigate('Intents');

export const IntentsIntro = ({ navigation }) => (
  <View style={STYLES.screen}>
    <Image source={Images.intentTags} style={STYLES.tags} />
    <View style={STYLES.card}>
      <Text style={[Fonts.style.title, STYLES.text]}>{TITLE}</Text>
      <Text style={[Fonts.style.normal, STYLES.text, STYLES.statement]}>
        {STATEMENT}
      </Text>
      <Button
        {...toTestIds('Select Intents Button')}
        onPress={getNavigator(navigation)}
        style={STYLES.button}>
        Select Your Intents
      </Button>
    </View>
  </View>
);
