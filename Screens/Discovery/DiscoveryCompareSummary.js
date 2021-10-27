import React from 'react';
import { StyleSheet, ScrollView, Text, View } from 'react-native';

import {
  Button,
  InitialsCircle,
  IntentCard,
  SecondaryButton
} from '../../Components';
import {
  APP_ACCENT_BLUE,
  APP_BRIGHT_GRAY,
  APP_DARK_GRAY,
  APP_LIGHT_GRAY,
  APP_WHITE,
  APP_GREEN,
  COLOR_PALETTE,
  Fonts
} from '../../Themes';
import { toTestIds } from '../../Utils';

const ALIGNED_LABEL = 'Expectations Aligned';
const UNALIGNED_LABEL = 'Unaligned Expectations';
const SUMMARY_STATEMENT =
  'Hopefully the two of you found more in common than you originally thought. Try connecting on other relationship types or go get to know each other more!';
const UNALIGNED_TITLE = 'Unaligned Expectations';
const UNALIGNED_STATEMENT =
  'Wondering how your expectations may be different? Review them together.';
const UNALIGNED_BUTTON_LABEL = 'Review Unaligned Responses';
const OTHER_INTENT_STATEMENT = 'other intents with alignment';
const EMPTY_TITLE = 'No More Matching Intents';
const EMPTY_STATEMENT =
  'Try connecting on another persona to find more intents to share with this person.';

const STYLES = StyleSheet.create({
  container: {
    marginVertical: 16,
    padding: 16
  },
  summaryContainer: {
    marginBottom: 0,
    paddingBottom: 0,
    paddingHorizontal: 16,
    alignItems: 'center'
  },
  unalignedContainer: {
    backgroundColor: APP_DARK_GRAY,
    textAlign: 'center'
  },
  unalignedButton: {
    marginHorizontal: 0
  },
  exitButton: {
    marginTop: 0
  },
  exitButtonText: {
    color: APP_WHITE,
    fontWeight: 'bold'
  },
  text: {
    fontFamily: Fonts.type.base,
    color: APP_WHITE,
    textAlign: 'center'
  },
  alignedCount: {
    color: APP_ACCENT_BLUE,
    fontSize: 36,
    fontWeight: 'bold',
    letterSpacing: 0.79
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 0.18,
    marginTop: 2,
    textTransform: 'uppercase'
  },
  statement: {
    color: APP_BRIGHT_GRAY,
    fontSize: 15,
    letterSpacing: -0.24,
    lineHeight: 20,
    marginVertical: 16
  },
  otherIntentsContainer: {
    marginVertical: 0,
    paddingVertical: 0,
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center'
  },
  otherIntentCount: {
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
    textAlignVertical: 'center',
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: APP_GREEN
  },
  otherIntentStatement: {
    fontSize: 14,
    color: APP_LIGHT_GRAY,
    marginLeft: 8
  },
  otherIntentsEmptyContainer: {
    paddingHorizontal: 16
  },
  emptyTitle: {
    color: APP_LIGHT_GRAY,
    fontSize: 13,
    letterSpacing: 0.23,
    lineHeight: 41,
    textAlign: 'left'
  },
  emptyStatement: {
    color: APP_BRIGHT_GRAY,
    fontSize: 15,
    letterSpacing: -0.24,
    lineHeight: 20,
    textAlign: 'left'
  },
  intentsContainer: {
    marginVertical: 0
  },
  intentCard: {
    marginHorizontal: 0,
    marginTop: 0
  }
});

const renderSummary = (peerName, numerator, total, isForUnaligned) => (
  <View style={[STYLES.container, STYLES.summaryContainer]}>
    <View>
      <InitialsCircle size={33} text={peerName} />
    </View>
    <Text style={[STYLES.text, STYLES.alignedCount]}>
      {`${numerator}/${total}`}
    </Text>
    <Text style={[STYLES.text, STYLES.sectionLabel]}>
      {isForUnaligned ? UNALIGNED_LABEL : ALIGNED_LABEL}
    </Text>
    <Text style={[STYLES.text, STYLES.statement]}>{SUMMARY_STATEMENT}</Text>
  </View>
);

const renderUnaligned = onPressUnaligned => (
  <View style={[STYLES.container, STYLES.unalignedContainer]}>
    <Text style={[STYLES.text, STYLES.sectionLabel]}>{UNALIGNED_TITLE}</Text>
    <Text style={[STYLES.text, STYLES.statement]}>{UNALIGNED_STATEMENT}</Text>
    <Button onPress={onPressUnaligned} style={STYLES.unalignedButton}>
      {UNALIGNED_BUTTON_LABEL}
    </Button>
  </View>
);

const renderOtherIntents = intentCount => {
  return (
    <View style={[STYLES.container, STYLES.otherIntentsContainer]}>
      <Text style={[STYLES.text, STYLES.otherIntentCount]}>{intentCount}</Text>
      <Text style={[STYLES.text, STYLES.otherIntentStatement]}>
        {OTHER_INTENT_STATEMENT}
      </Text>
    </View>
  );
};

const renderOtherIntentsEmpty = () => {
  return (
    <View style={[STYLES.container, STYLES.otherIntentsEmptyContainer]}>
      <Text style={[STYLES.text, STYLES.emptyTitle]}>{EMPTY_TITLE}</Text>
      <Text style={[STYLES.text, STYLES.emptyStatement]}>
        {EMPTY_STATEMENT}
      </Text>
    </View>
  );
};

const renderIntents = ({ intents, onPressIntent = () => {} }) => {
  return (
    <View style={[STYLES.container, STYLES.intentsContainer]}>
      {intents.map(intent => {
        const { uuid, title, style, glyphs } = intent;
        const intentSharing = false;
        return (
          <IntentCard
            {...toTestIds(title)}
            key={uuid}
            glyph={glyphs}
            title={title}
            intentSharing={intentSharing}
            style={[
              STYLES.intentCard,
              {
                backgroundColor: COLOR_PALETTE[style]
              }
            ]}
            onPress={() => onPressIntent(intent)}
          />
        );
      })}
    </View>
  );
};

export const DiscoveryCompareSummary = ({
  isForUnaligned,
  shouldOfferUnaligned,
  otherIntents,
  onPressExit,
  onPressIntent,
  onPressUnaligned,
  queryMatches,
  queryCount,
  peerName,
  ...props
}) => (
  <ScrollView {...toTestIds('Content')} {...props}>
    {renderSummary(peerName, queryMatches.length, queryCount, isForUnaligned)}
    {shouldOfferUnaligned && renderUnaligned(onPressUnaligned)}
    {otherIntents.length > 0
      ? renderOtherIntents(otherIntents.length)
      : renderOtherIntentsEmpty()}
    {otherIntents.length > 0 &&
      renderIntents({
        intents: otherIntents,
        onPressIntent
      })}
    <SecondaryButton
      {...toTestIds('Exit Button')}
      onPress={onPressExit}
      style={STYLES.exitButton}
      textStyle={STYLES.exitButtonText}>
      Exit
    </SecondaryButton>
  </ScrollView>
);
