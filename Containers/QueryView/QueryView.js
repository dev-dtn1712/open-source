import React, { useCallback, useState, useMemo, useEffect } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { batchUpdateResponses, getResponses } from '../../Redux/ResponsesRedux';
import { QueryForm, Tag, SlideUpButton } from '../../Components';
import { toTestIds, toUuids } from '../../Utils';

import {
  logTimingStart,
  logTimingEnd,
  ANALYTICS_CONTENT_TYPE,
  ANALYTICS_EVENT
} from '../../Services/Analytics';

import {
  APP_BLUE,
  APP_DARK_GRAY,
  APP_INSTRUCTION_GRAY,
  APP_PURPLE,
  APP_RED,
  APP_WHITE,
  Fonts
} from '../../Themes';

const QUERY_PADDING = 16;
const TAG_LINE_HEIGHT = 15;
const TAG_PADDING_VERTICAL = 3;
const TAG_TOP = 10;
const HEADER_HEIGHT = 210;
const HEADER_TOP_PADDING =
  2 * TAG_PADDING_VERTICAL + TAG_LINE_HEIGHT + TAG_TOP + 16;

const STYLES = {
  query: {
    flex: 1,
    backgroundColor: APP_DARK_GRAY,
    padding: QUERY_PADDING,
    width: '100%'
  },
  queryHeader: {
    height: HEADER_HEIGHT,
    paddingTop: HEADER_TOP_PADDING
  },
  statement: {
    color: APP_WHITE,
    fontFamily: Fonts.type.base,
    fontSize: 24,
    letterSpacing: 0.36,
    lineHeight: 30
  },
  instructions: {
    color: APP_INSTRUCTION_GRAY,
    fontFamily: Fonts.type.base,
    fontSize: 15,
    letterSpacing: -0.24,
    lineHeight: 20
  },
  tag: {
    left: -QUERY_PADDING,
    paddingVertical: TAG_PADDING_VERTICAL,
    top: TAG_TOP
  },
  tagText: {
    lineHeight: TAG_LINE_HEIGHT
  },
  formWrapper: {}
};

const BINARY_INSTRUCTIONS = 'Select only one answer from the list below';
const CONTINUUM_INSTRUCTIONS = 'Slide the scale left or right';
const DEFAULT_INSTRUCTIONS = 'Enter your answer below';
const POLYADIC_INSTRUCTIONS = max =>
  `Select up to ${max} answers from the list below`;

const TAG_COLORS = {
  'must have': APP_RED,
  'nice to have': APP_PURPLE,
  'good to know': APP_BLUE
};
const getTagColor = text => TAG_COLORS[text] || APP_BLUE;

const getQueryInstructions = ({ queryRule }) => {
  switch (queryRule.type) {
    case 'binary':
      return BINARY_INSTRUCTIONS;
    case 'polyadic':
      if (queryRule.max === 1) {
        return BINARY_INSTRUCTIONS;
      }
      return POLYADIC_INSTRUCTIONS(queryRule.max);
    case 'continuum':
      return CONTINUUM_INSTRUCTIONS;
    default:
      return DEFAULT_INSTRUCTIONS;
  }
};

export const toQueryResponseIds = ({ responses = [] }) => toUuids(responses);
export const getQueryResponseData = query => {
  const allResponses = useSelector(getResponses);
  const ids = toQueryResponseIds(query);
  return ids.map(uuid => allResponses[uuid]).filter(Boolean);
};

export const isValidQuery = ({ queryRule }, responseCount) => {
  switch (queryRule.type) {
    case 'binary':
      return responseCount === 1;
    case 'polyadic':
      return responseCount >= queryRule.min && responseCount <= queryRule.max;
    default:
      return true;
  }
};

export const Query = ({
  submitButtonLabel,
  onSubmit = () => {},
  formStyle,
  formContentContainerStyle,
  headerStyle,
  isActive = true,
  query,
  responseData,
  style,
  showTag = false,
  ...props
}) => {
  useEffect(() => {
    if (query) {
      logTimingStart({ event: ANALYTICS_EVENT.ANSWER_QUERY });
    }
    return () => {
      logTimingEnd({
        event: ANALYTICS_EVENT.ANSWER_QUERY,
        contentType: ANALYTICS_CONTENT_TYPE.QUERY_TEMPLATE,
        data: query
      });
    };
  }, [query]);

  const dispatch = useDispatch();
  const [currentResponseData, setCurrentresponseData] = useState(responseData);
  const queryResponseIds = useMemo(() => toQueryResponseIds(query), [query]);

  const isSlideUpButton = isValidQuery(query, currentResponseData.length);

  const dispatchResponses = useCallback(
    (responseIds, responses) => {
      dispatch(batchUpdateResponses(responseIds, responses));
    },
    [dispatch]
  );

  const onSave = () => {
    dispatchResponses(queryResponseIds, currentResponseData);
    onSubmit();
  };

  const onChange = newResponses => {
    setCurrentresponseData(newResponses);
  };

  return (
    <View style={[STYLES.query, style]} {...props}>
      <View style={[STYLES.queryHeader, headerStyle]}>
        {showTag && !!query.tag && (
          <Tag
            color={getTagColor(query.tag)}
            style={STYLES.tag}
            text={query.tag}
            textStyle={STYLES.tagText}
          />
        )}
        <Text style={STYLES.statement}>{query.statement}</Text>
        <Text style={STYLES.instructions}>{getQueryInstructions(query)}</Text>
      </View>
      <ScrollView
        {...(isActive ? toTestIds('Answers') : {})}
        showsVerticalScrollIndicator={false}
        style={[STYLES.formWrapper, formStyle]}
        contentContainerStyle={[
          formContentContainerStyle,
          isSlideUpButton && {
            paddingBottom: 82
          }
        ]}>
        <QueryForm
          onChange={onChange}
          query={query}
          responseData={currentResponseData}
        />
      </ScrollView>
      <SlideUpButton
        {...toTestIds('Next Button')}
        isVisible={isSlideUpButton}
        onPress={onSave}
        title={submitButtonLabel}
      />
    </View>
  );
};
