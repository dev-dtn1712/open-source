import React, { useState, useEffect } from 'react';
import { SafeAreaView, View } from 'react-native';

import { IconButton, DEFAULT_STATUS_BAR_HEIGHT } from '../../Components';
import { getQueryResponseData, Query } from '../../Containers';
import { APP_DARK_GRAY, APP_WHITE } from '../../Themes';
import { toTestIds } from '../../Utils';
import {
  logTimingStart,
  logTimingEnd,
  ANALYTICS_CONTENT_TYPE,
  ANALYTICS_EVENT,
  ANALYTICS_EVENT_ATTRIBUTES
} from '../../Services/Analytics';

const STYLES = {
  content: {
    flex: 1,
    backgroundColor: APP_DARK_GRAY
  },
  header: {
    padding: 8,
    paddingTop: 8 + DEFAULT_STATUS_BAR_HEIGHT,
    justifyContent: 'flex-end',
    flexDirection: 'row',
    alignSelf: 'stretch',
    backgroundColor: APP_DARK_GRAY
  },
  queryHeader: {
    paddingTop: 0
  },
  screen: {
    flex: 1
  }
};

export const OneOffSurvey = ({ navigation }) => {
  const query = navigation.getParam('query', {});
  const response = getQueryResponseData(query);

  const [isCompleted, setIsCompleted] = useState(false);

  const onClose = () => {
    navigation.goBack();
  };

  const onNext = () => {
    setIsCompleted(true);
    const { onOneOffFinished } = navigation.state.params;
    if (onOneOffFinished) {
      onOneOffFinished();
    }
    navigation.goBack();
  };

  useEffect(() => {
    return () => {
      logTimingEnd({
        event: ANALYTICS_EVENT.ANSWER_SURVEY,
        contentType: ANALYTICS_CONTENT_TYPE.QUERY_TEMPLATE,
        data: query,
        context: {
          [ANALYTICS_EVENT_ATTRIBUTES.COMPLETED]: isCompleted
        }
      });
    };
  }, [isCompleted]);

  useEffect(() => {
    if (query) {
      logTimingStart({ event: ANALYTICS_EVENT.ANSWER_SURVEY });
    }
  }, [query]);

  return (
    <SafeAreaView style={STYLES.screen}>
      <View style={STYLES.header}>
        <IconButton
          {...toTestIds('Close Button')}
          collection="MaterialCommunityIcons"
          icon="close-circle"
          color={APP_WHITE}
          onPress={onClose}
        />
      </View>
      <View style={STYLES.content}>
        <Query
          submitButtonLabel="Save"
          onSubmit={onNext}
          query={query}
          key={query.uuid}
          responseData={response}
          headerStyle={STYLES.queryHeader}
        />
      </View>
    </SafeAreaView>
  );
};
