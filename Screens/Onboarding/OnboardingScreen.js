import React, { useState, useEffect } from 'react';
import { StyleSheet, SafeAreaView, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import { getIsOnboarded, getIsLoadingContent } from '../../Redux/AppRedux';

import {
  Button,
  FullCard,
  HorizontalStack,
  ProgressHUD,
  SecondaryButton
} from '../../Components';
import {
  APP_DARK_GRAY,
  APP_BLUE,
  APP_BREADCRUMB_GRAY,
  APP_GREEN,
  APP_PARALLEL_ORANGE,
  APP_RED,
  APP_TEAL,
  APP_WHITE,
  Fonts,
  Images,
  Metrics
} from '../../Themes';
import { toTestIds } from '../../Utils';
import { logContent, ANALYTICS_CONTENT_SCREEN } from '../../Services/Analytics';

const JOIN_LABEL = 'Join Now';
const LOGIN_LABEL = 'Log In';

const STYLES = StyleSheet.create({
  screen: {
    backgroundColor: APP_DARK_GRAY
  },
  btnRegister: {
    marginBottom: 0
  },
  btnLogin: {
    marginBottom: 48,
    backgroundColor: APP_BREADCRUMB_GRAY
  },
  onboardingImage: {
    width: Metrics.screenWidth
  },
  logoImage: {
    marginTop: -48,
    width: 198,
    resizeMode: 'contain'
  },
  cardImage: {
    backgroundColor: APP_WHITE,
    width: Metrics.screenWidth
  },
  navWrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    position: 'absolute',
    top: 0,
    width: '100%'
  },
  statement: {
    ...Fonts.style.normal,
    color: APP_WHITE
  }
});

const getButtonFooter = setNextScreen => (
  <View>
    <Button
      {...toTestIds('Join Button')}
      style={STYLES.btnRegister}
      onPress={() => setNextScreen('OnboardingStart')}>
      {JOIN_LABEL}
    </Button>
    <Button
      {...toTestIds('Login Button')}
      style={STYLES.btnLogin}
      onPress={() => setNextScreen('Login')}>
      {LOGIN_LABEL}
    </Button>
  </View>
);

const getHighlightedText = (color, [start, highlight, end]) => (
  <Text>
    {start}
    <Text style={{ color }}>{highlight}</Text>
    {end || ''}
  </Text>
);

export const Onboarding = ({ navigation }) => {
  const isOnboarded = useSelector(getIsOnboarded);
  const isLoadingContent = useSelector(getIsLoadingContent);

  const [page, setPage] = useState(0);
  const [nextScreen, setNextScreen] = useState('');

  const onSkip = () => {
    setPage(4);
  };

  useEffect(() => {
    if (isOnboarded) {
      onSkip();
    }
  }, [isOnboarded]);

  useEffect(() => {
    if (nextScreen && !isLoadingContent) {
      navigation.navigate(nextScreen);
    }
  }, [isLoadingContent, nextScreen]);

  useEffect(() => {
    logContent({
      screen: ANALYTICS_CONTENT_SCREEN.ONBOARDING,
      context: {
        page
      }
    });
  }, [page]);

  return (
    <SafeAreaView style={STYLES.screen}>
      <HorizontalStack
        {...toTestIds('Pages')}
        currentPage={page}
        highlight={[
          APP_BLUE,
          APP_GREEN,
          APP_RED,
          APP_TEAL,
          APP_PARALLEL_ORANGE
        ]}
        onPage={setPage}>
        <FullCard
          image={Images.orangeDelightedPhonesGuyGal}
          imageStyle={STYLES.onboardingImage}
          title={getHighlightedText(APP_BLUE, TITLES[0])}>
          <Text style={STYLES.statement}>
            {getHighlightedText(APP_BLUE, DESCRIPTIONS[0])}
          </Text>
        </FullCard>
        <FullCard
          image={Images.intentCards}
          imageStyle={STYLES.cardImage}
          title={getHighlightedText(APP_GREEN, TITLES[1])}>
          {DESCRIPTIONS[1]}
        </FullCard>
        <FullCard
          image={Images.fullSleevePhoneGuy}
          imageStyle={STYLES.onboardingImage}
          title={getHighlightedText(APP_RED, TITLES[2])}>
          {DESCRIPTIONS[2]}
        </FullCard>
        <FullCard
          image={Images.twoPhonesJoggerFriends}
          imageStyle={STYLES.onboardingImage}
          title={getHighlightedText(APP_TEAL, TITLES[3])}>
          {DESCRIPTIONS[3]}
        </FullCard>
        <FullCard
          footer={getButtonFooter(setNextScreen)}
          image={Images.logoCanWe}
          imageStyle={STYLES.logoImage}
          imageProps={{
            resizeMode: 'contain'
          }}
          title={getHighlightedText(APP_PARALLEL_ORANGE, TITLES[4])}>
          {DESCRIPTIONS[4]}
        </FullCard>
      </HorizontalStack>
      {page !== 4 && (
        <View style={STYLES.navWrapper}>
          <SecondaryButton {...toTestIds('Skip Button')} onPress={onSkip}>
            Skip
          </SecondaryButton>
        </View>
      )}
      <ProgressHUD isVisible={nextScreen && isLoadingContent} />
    </SafeAreaView>
  );
};
