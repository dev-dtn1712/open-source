import React from 'react';
import { StyleSheet, Image, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import { has, isEmpty } from 'lodash';

import { getActivatedIntents } from '../../Redux/MetadataRedux';
import { getResponses } from '../../Redux/ResponsesRedux';
import { getUserId } from '../../Redux/AuthRedux';
import { getTemplatesByUuids } from '../../Services/TemplatesService';
import { shareApp } from '../../Services/ShareService';

import { Button, IconButton } from '../../Components';
import {
  Fonts,
  Images,
  Metrics,
  APP_WHITE,
  APP_DARK_GRAY,
  APP_BLUE
} from '../../Themes';
import { toTestIds } from '../../Utils';

const TITLE = 'Connect with your partner ';
const TITLE_EMPHASIS = 'via Bluetooth';
const STATEMENT =
  'To start a guided conversation with your partner, make sure they’re within Bluetooth range, on this screen, and ready to join you!\n\nYour better date starts now—enter the conversation.';
const BUTTON_LABEL = 'Connect Now';

const STYLES = StyleSheet.create({
  screen: {
    backgroundColor: APP_DARK_GRAY
  },
  background: {
    height: Metrics.screenHeight,
    width: Metrics.screenWidth,
    resizeMode: 'cover',
    opacity: 0.15
  },
  card: {
    marginTop: 'auto',
    marginLeft: 16,
    marginRight: 16,
    marginBottom: 0
  },
  radar: {
    marginLeft: 4,
    resizeMode: 'center'
  },
  text: {
    textAlign: 'left',
    color: APP_WHITE
  },
  title: {
    marginTop: 23
  },
  titleNearYou: {
    color: APP_BLUE
  },
  statement: {
    marginTop: 16
  },
  share: {
    position: 'absolute',
    top: 30,
    right: 0,
    width: 40,
    height: 36
  },
  connect: {
    marginTop: 66,
    marginBottom: 46
  }
});

const getActivatedIntentTemplates = () => {
  const activeIntents = useSelector(getActivatedIntents);
  return getTemplatesByUuids(Array.from(activeIntents));
};

const hasActiveResponses = (responsesObj, activatedIntents) => {
  if (isEmpty(responsesObj)) {
    return false;
  }

  return activatedIntents
    .flatMap(({ surveys }) => surveys)
    .flatMap(({ queries }) => queries)
    .flatMap(({ responses }) => responses)
    .some(({ uuid }) => has(responsesObj, uuid));
};

export const DiscoveryIntro = ({ navigation }) => {
  const responsesObj = useSelector(getResponses);
  const userId = useSelector(getUserId);
  const activatedIntents = getActivatedIntentTemplates();

  const onShare = async () => {
    await shareApp(userId);
  };

  const onStartScan = () => {
    if (hasActiveResponses(responsesObj, activatedIntents)) {
      navigation.navigate('DiscoveryScanning');
    } else {
      navigation.navigate('DiscoveryIntentsMissing');
    }
  };

  return (
    <View style={STYLES.screen}>
      <Image source={Images.discoveryBackground} style={STYLES.background} />
      <IconButton icon="share" onPress={onShare} style={STYLES.share} />
      <View style={[STYLES.card]}>
        <Image source={Images.iconRadar} style={STYLES.radar} />
        <Text style={[Fonts.style.title, STYLES.text, STYLES.title]}>
          <Text>{TITLE}</Text>
          <Text style={[STYLES.titleNearYou]}>{TITLE_EMPHASIS}</Text>
        </Text>
        <Text style={[Fonts.style.normal, STYLES.text, STYLES.statement]}>
          {STATEMENT}
        </Text>
        <Button
          {...toTestIds('Start Scanning Button')}
          onPress={onStartScan}
          style={STYLES.connect}>
          {BUTTON_LABEL}
        </Button>
      </View>
    </View>
  );
};
