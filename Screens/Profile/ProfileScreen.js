import { head } from 'lodash';
import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';

import {
  ButtonCarousel,
  FloatingCard,
  IconButton,
  InitialsCircle,
  DEFAULT_STATUS_BAR_HEIGHT
} from '../../Components';
import { getMemberSince } from '../../Redux/MetadataRedux';
import { getResponses } from '../../Redux/ResponsesRedux';
import { getUsername } from '../../Redux/AuthRedux';
import {
  APP_CHARCOAL_GRAY,
  APP_HEADER_GRAY,
  APP_STEEL_GRAY,
  APP_WHITE,
  Fonts,
  Metrics
} from '../../Themes';
import { ONE_OFF_TYPE, getCoreSurveys } from '../../Services/TemplatesService';
import { toTestIds, toUuids } from '../../Utils';

const PROFILE_CARD_WIDTH = Metrics.screenWidth - 32;

const STYLES = StyleSheet.create({
  background: {
    alignItems: 'center',
    backgroundColor: APP_STEEL_GRAY
  },
  bottom: {
    backgroundColor: APP_WHITE,
    flexGrow: 1,
    paddingTop: 32,
    width: '100%'
  },
  card: {
    alignItems: 'center',
    width: PROFILE_CARD_WIDTH,
    marginVertical: 26
  },
  header: {
    ...Fonts.style.sectionHeader,
    color: APP_HEADER_GRAY,
    marginLeft: 16
  },
  icon: {
    alignSelf: 'flex-end',
    margin: 16,
    marginTop: 16 + DEFAULT_STATUS_BAR_HEIGHT
  },
  name: {
    color: APP_CHARCOAL_GRAY,
    fontFamily: Fonts.type.base,
    fontSize: 32,
    fontWeight: 'bold',
    letterSpacing: 0.41,
    lineHeight: 34,
    paddingTop: 12
  },
  memberSince: {
    ...Fonts.style.subtitle,
    color: APP_HEADER_GRAY
  }
});

const includesCompletedFetcher = allResponses => responseTemplates => {
  const responses = toUuids(responseTemplates).map(uuid => allResponses[uuid]);
  return responses.some(Boolean);
};

export const Profile = ({ navigation }) => {
  const name = useSelector(getUsername);
  const allResponses = useSelector(getResponses);
  const includesCompleted = includesCompletedFetcher(allResponses);
  const memberSince = useSelector(getMemberSince);

  const queries = getCoreSurveys()
    .filter(({ type }) => type === ONE_OFF_TYPE)
    .map(oneOff => head(oneOff.queries));
  const queryData = queries.map(({ responses, statement }) => ({
    statement,
    isCompleted: includesCompleted(responses)
  }));

  const onSurveySelected = index => {
    navigation.navigate('OneOffSurvey', {
      query: queries[index]
    });
  };
  const onSettingsPressed = () => {
    navigation.navigate('ProfileSettings');
  };

  return (
    <SafeAreaView style={STYLES.background}>
      <IconButton
        {...toTestIds('Settings Button')}
        icon="settings"
        onPress={onSettingsPressed}
        style={STYLES.icon}
      />
      <FloatingCard style={STYLES.card}>
        <InitialsCircle text={name} />
        <Text style={STYLES.name}>{name}</Text>
        <Text style={STYLES.memberSince}>Member Since {memberSince}</Text>
      </FloatingCard>
      <View style={STYLES.bottom}>
        {queryData.length > 0 && (
          <Text style={STYLES.header}>Surveys & Questions</Text>
        )}
        <ButtonCarousel
          {...toTestIds('Additional Questions')}
          onSelected={onSurveySelected}
          data={queryData}
        />
      </View>
    </SafeAreaView>
  );
};
