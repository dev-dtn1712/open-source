import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { FloatingCard } from '../FloatingCard';
import { InitialsCircle } from '../InitialsCircle';
import { APP_CHARCOAL_GRAY, APP_HEADER_GRAY, Fonts } from '../../Themes';

const DEFAULT_STYLES = StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: 26
  },
  memberSince: {
    ...Fonts.style.subtitle,
    color: APP_HEADER_GRAY
  },
  textContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    marginLeft: 20
  },
  username: {
    color: APP_CHARCOAL_GRAY,
    fontFamily: Fonts.type.base,
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: 0.31,
    lineHeight: 24
  }
});

export const UserCard = ({ memberSince, style, username, ...props }) => (
  <FloatingCard style={[DEFAULT_STYLES.card, style]} {...props}>
    <InitialsCircle size={50} text={username} />
    <View style={DEFAULT_STYLES.textContainer}>
      <Text style={DEFAULT_STYLES.username}>{username}</Text>
      <Text style={DEFAULT_STYLES.memberSince}>Member Since {memberSince}</Text>
    </View>
  </FloatingCard>
);
