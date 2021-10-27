import React, { useEffect } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { has } from 'lodash';

import {
  getResponsesAlignedWithUser,
  alignmentComparesLikeToLike
} from '../../Services/Geometry/QueryTemplate';
import { alignmentIsPolyadic } from '../../Services/Geometry/AlignmentRule';

import {
  logTimingStart,
  logTimingEnd,
  ANALYTICS_EVENT,
  ANALYTICS_CONTENT_TYPE
} from '../../Services/Analytics';

import { QueryForm, Tag } from '../../Components';
import { toTestIds } from '../../Utils';

import {
  APP_BLUE,
  APP_DARK_GRAY,
  APP_INSTRUCTION_GRAY,
  APP_PURPLE,
  APP_RED,
  APP_WHITE,
  APP_BREADCRUMB_GRAY,
  Fonts
} from '../../Themes';

const QUERY_PADDING = 16;
const TAG_LINE_HEIGHT = 15;
const TAG_PADDING_VERTICAL = 3;
const TAG_TOP = 16;
const HEADER_TOP_PADDING = 2 * TAG_PADDING_VERTICAL + TAG_LINE_HEIGHT + TAG_TOP;
const HEADER_HEIGHT = 175 - HEADER_TOP_PADDING - QUERY_PADDING;

const STYLES = {
  query: {
    flex: 1,
    backgroundColor: APP_DARK_GRAY,
    width: '100%',
    overflow: 'hidden'
  },
  content: {
    padding: QUERY_PADDING
  },
  statement: {
    color: APP_WHITE,
    fontFamily: Fonts.type.base,
    fontSize: 24,
    letterSpacing: 0.36,
    lineHeight: 30,
    marginTop: HEADER_TOP_PADDING,
    height: HEADER_HEIGHT
  },
  instructions: {
    color: APP_INSTRUCTION_GRAY,
    fontFamily: Fonts.type.base,
    fontSize: 15,
    letterSpacing: -0.24,
    lineHeight: 20,
    marginTop: 'auto',
    marginBottom: 16
  },
  tag: {
    paddingVertical: TAG_PADDING_VERTICAL,
    top: TAG_TOP
  },
  tagText: {
    lineHeight: TAG_LINE_HEIGHT
  },
  maskView: {
    position: 'absolute',
    opacity: 0,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  }
};

const DEFAULT_INSTRUCTIONS = 'You both answered:';

const TAG_COLORS = {
  'must have': APP_RED,
  'nice to have': APP_PURPLE,
  'good to know': APP_BLUE
};
const getTagColor = text => TAG_COLORS[text] || APP_BLUE;

const toResponseObject = responses =>
  Object.fromEntries(responses.map(response => [response.uuid, response]));

const getAlignedResponses = (responses1, responses2) => {
  const responseObj = toResponseObject(responses2);
  return responses1.filter(({ uuid }) => has(responseObj, uuid));
};

const getUnalignedResponses = (responses1, responses2) => {
  const responseObj = toResponseObject(responses2);
  return responses1.filter(({ uuid }) => !has(responseObj, uuid));
};

const getDefaultInstructions = () => (
  <Text style={STYLES.instructions}>{DEFAULT_INSTRUCTIONS}</Text>
);

const getAlignmentInstructions = (username, isFontHeavy, style) => (
  <Text
    style={[
      STYLES.instructions,
      isFontHeavy && {
        fontSize: 17,
        fontWeight: 'bold',
        color: APP_WHITE
      },
      style
    ]}>
    {`${username} answered:`}
  </Text>
);

const getQueryForm = (query, responses, unaligned) => {
  const { alignmentRule } = query;
  const isPolyadic = alignmentIsPolyadic(alignmentRule);
  const answerStyle = unaligned && {
    backgroundColor: APP_BREADCRUMB_GRAY
  };

  return (
    <QueryForm
      query={query}
      answersOnly
      responseData={responses}
      answerStyle={isPolyadic && answerStyle}
    />
  );
};

export const AlignmentQuery = ({
  isActive = true,
  query,
  user,
  responsesForUser = [],
  peerUser,
  responsesForPeerUser = [],
  isForUnaligned = false,
  showTag = false,
  peerId = '',
  cxIndex = 0,
  style,
  headerStyle,
  ...props
}) => {
  useEffect(() => {
    logTimingStart({
      event: ANALYTICS_EVENT.EXPLORE_QUERY
    });
    return () => {
      logTimingEnd({
        event: ANALYTICS_EVENT.EXPLORE_QUERY,
        contentType: ANALYTICS_CONTENT_TYPE.QUERY_TEMPLATE,
        data: query,
        context: {
          peerID: peerId,
          cxIndex,
          isAligned: !isForUnaligned
        }
      });
    };
  }, [peerId, cxIndex, isForUnaligned]);

  const { alignmentRule, tag } = query;

  // whether there are any aligned responses
  const hasAligned =
    getResponsesAlignedWithUser(
      query,
      toResponseObject(responsesForUser),
      toResponseObject(responsesForPeerUser),
      false
    ).length > 0;

  // whether the alignment rule can be expressed as "you both answered"
  const isLikeToLike = alignmentComparesLikeToLike(query) && hasAligned;

  const isPolyadic = alignmentIsPolyadic(alignmentRule);

  return (
    <View style={[STYLES.query, style]} {...props}>
      <ScrollView
        {...(isActive ? toTestIds('Answers') : {})}
        showsVerticalScrollIndicator={false}>
        {showTag && (
          <Tag
            color={getTagColor(tag)}
            style={STYLES.tag}
            text={tag}
            textStyle={STYLES.tagText}
          />
        )}
        <View style={STYLES.content}>
          <Text style={STYLES.statement}>{query.statement}</Text>

          {isLikeToLike
            ? getDefaultInstructions()
            : getAlignmentInstructions(peerUser, !isPolyadic)}
          {getQueryForm(
            query,
            isLikeToLike
              ? getAlignedResponses(responsesForPeerUser, responsesForUser)
              : responsesForPeerUser,
            !isLikeToLike && isForUnaligned
          )}

          {isLikeToLike &&
            isForUnaligned &&
            getAlignmentInstructions(peerUser, false, {
              marginTop: 26
            })}
          {isLikeToLike &&
            isForUnaligned &&
            getQueryForm(
              query,
              getUnalignedResponses(responsesForPeerUser, responsesForUser),
              isForUnaligned
            )}

          {isLikeToLike &&
            isForUnaligned &&
            getAlignmentInstructions(user, false, {
              marginTop: 26
            })}
          {isLikeToLike &&
            isForUnaligned &&
            getQueryForm(
              query,
              getUnalignedResponses(responsesForUser, responsesForPeerUser),
              isForUnaligned
            )}

          {!isLikeToLike &&
            getAlignmentInstructions(user, !isPolyadic, {
              marginTop: 26
            })}
          {!isLikeToLike &&
            getQueryForm(query, responsesForUser, isForUnaligned)}
        </View>
        <View style={STYLES.maskView} />
      </ScrollView>
    </View>
  );
};
