import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { StyleSheet, Image, Text, View, BackHandler } from 'react-native';
import { StackActions } from 'react-navigation';
import { useSelector } from 'react-redux';

import { UserCard, IntentConnectingCard } from '../../Components';
import { getSessionPeer, getAlignedIntents } from '../../Redux/SessionRedux';
import {
  APP_DARK_GRAY,
  APP_WHITE,
  APP_FIELD_TEXT,
  Fonts,
  Images,
  Metrics,
  COLOR_PALETTE
} from '../../Themes';
import { getCurrentSynchronizedRandomizer } from '../../Services/SessionHelper';
import { backgroundImageUrl } from '../../Services/CloudinaryService';

const TITLE = 'Preparing your Alignment';

const QUOTES = [
  {
    text: 'Be brave enough to start a conversation that matters.',
    quoteBy: 'Meg Wheatley'
  },
  {
    text:
      'Conversation about the weather is the last refuge of the unimaginative.',
    quoteBy: 'Oscar Wilde'
  },
  {
    text: 'Sometimes the heart sees what is invisible to the eye.',
    quoteBy: 'H. Jackson Brown'
  },
  {
    text: 'Everybody’s somebody’s everything',
    quoteBy: 'Chance the Rapper'
  },
  {
    text:
      'Let us always meet each other with smile, for the smile is the beginning of love.',
    quoteBy: 'Mother Theresa'
  }
];

const CONNECTING_TIMEOUT = 3000;

const STYLES = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: APP_DARK_GRAY
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 16
  },
  image: {
    resizeMode: 'contain',
    alignSelf: 'center',
    width: 96,
    height: 81,
    marginTop: 115
  },
  text: {
    fontFamily: Fonts.type.base,
    textAlign: 'center',
    color: APP_WHITE
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16
  },
  comment: {
    ...Fonts.style.normal,
    textAlign: 'center',
    color: APP_FIELD_TEXT,
    marginBottom: 16
  },
  quoteByWrapper: {
    alignSelf: 'stretch',
    alignItems: 'flex-end'
  },
  commentWrapper: {
    marginTop: 16,
    alignSelf: 'stretch',
    alignItems: 'center',
    paddingHorizontal: 16
  },
  user: {
    width: Metrics.screenWidth - 32,
    borderRadius: 4,
    marginTop: 16,
    marginHorizontal: 0
  },
  intentContainer: {
    marginTop: 8
  }
});

const getIntentCrumb = name => {
  return `romance/intent.${name}`;
};

export const DiscoveryIntentConnecting = ({ navigation }) => {
  const intentId = navigation.getParam('intentId');
  const isForUnaligned = navigation.getParam('isForUnaligned');
  const peer = useSelector(getSessionPeer);
  const alignedIntents = useSelector(getAlignedIntents);

  const { username, memberSince } = peer;

  const intentMatch = alignedIntents.find(({ uuid }) => uuid === intentId);
  const { alignedQueries, unalignedQueries } = intentMatch;
  const intent = intentMatch.template;
  const { glyphs, title, name, style: intentStyle } = intent;
  const imgUrl = backgroundImageUrl({
    name: getIntentCrumb(name)
  });

  const [timeoutTimer, setTimeoutTimer] = useState(null);

  const stopTimeoutTimer = () => {
    if (timeoutTimer !== null) {
      clearTimeout(timeoutTimer);
      setTimeoutTimer(null);
    }
  };

  const registerTimeoutTimer = (fn, interval = 0) => {
    stopTimeoutTimer();
    setTimeoutTimer(setTimeout(fn, interval));
  };

  const synchronizedRandomizer = getCurrentSynchronizedRandomizer();
  const { text: quoteText, quoteBy } = useMemo(() => {
    const quoteIndex = synchronizedRandomizer(QUOTES.length);
    return QUOTES[quoteIndex];
  }, [synchronizedRandomizer]);

  useEffect(() => {
    registerTimeoutTimer(() => {
      navigation.dispatch(
        StackActions.replace({
          routeName: 'DiscoveryIntentCompare',
          params: {
            intent,
            isForUnaligned,
            alignedQueries,
            unalignedQueries
          }
        })
      );
    }, CONNECTING_TIMEOUT);

    return () => {
      stopTimeoutTimer();
    };
  }, []);

  const handleBackButtonPressAndroid = useCallback(() => {
    if (!navigation.isFocused()) {
      return false;
    }
    return true;
  }, [navigation]);

  useEffect(() => {
    BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackButtonPressAndroid
    );

    return () => {
      BackHandler.removeEventListener(
        'hardwareBackPress',
        handleBackButtonPressAndroid
      );
    };
  }, [handleBackButtonPressAndroid]);

  return (
    <View style={STYLES.screen}>
      <View style={STYLES.content}>
        <Image source={Images.logoCanWe} style={STYLES.image} />
        <Text style={[STYLES.text, STYLES.title]}>{TITLE}</Text>
        <View style={STYLES.commentWrapper}>
          <Text style={STYLES.comment}>{quoteText}</Text>
          <View style={STYLES.quoteByWrapper}>
            <Text style={STYLES.comment}>{`- ${quoteBy}`}</Text>
          </View>
        </View>

        <UserCard
          style={STYLES.user}
          username={username}
          memberSince={memberSince}
        />
        <IntentConnectingCard
          style={[
            STYLES.intentContainer,
            {
              backgroundColor: COLOR_PALETTE[intentStyle]
            }
          ]}
          glyph={glyphs}
          title={title}
          imageBackground={{ uri: imgUrl }}
        />
      </View>
    </View>
  );
};
