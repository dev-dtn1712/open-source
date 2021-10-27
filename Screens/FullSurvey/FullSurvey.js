import React, { useState, useCallback, useEffect } from 'react';
import { SafeAreaView, View, BackHandler } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import {
  dealMakersAbortDialogShown,
  setDealMakersAbortDialogShown
} from '../../Redux/MetadataRedux';
import { getResponses } from '../../Redux/ResponsesRedux';

import {
  DEFAULT_TOP_BAR_HEIGHT,
  PagedView,
  ProgressBar,
  TopBar,
  ActionModal
} from '../../Components';
import { APP_ACCENT_BLUE, APP_DARK_GRAY } from '../../Themes';
import { toQueryResponseIds, Query } from '../../Containers';
import {
  logTimingStart,
  logTimingEnd,
  ANALYTICS_CONTENT_TYPE,
  ANALYTICS_EVENT,
  ANALYTICS_EVENT_ATTRIBUTES
} from '../../Services/Analytics';
import { MUST_HAVE_NAME } from '../../Services/TemplatesService';

const DEAL_MAKERS_ABORT_ACTION_TITLE = 'Leaving So Soon?';
const DEAL_MAKERS_ABORT_ACTION_STATEMENT =
  'You won’t be able to connect with anyone on this intent until you finish your must-haves.';

const STYLES = {
  screen: {
    backgroundColor: APP_DARK_GRAY
  },
  content: {
    marginTop: DEFAULT_TOP_BAR_HEIGHT
  },
  topBar: {
    backgroundColor: APP_DARK_GRAY
  }
};

const isWithinOne = (a, b) => Math.abs(a - b) <= 1;
const getButtonLabel = progress => (progress === 1 ? 'Finish Survey' : 'Next');
const useResponseFetcher = () => {
  const responses = useSelector(getResponses);
  return query =>
    toQueryResponseIds(query)
      .map(responseId => responses[responseId])
      .filter(Boolean);
};

export const FullSurvey = ({ navigation }) => {
  const survey = navigation.getParam('survey', {});
  const { queries = [], name = '' } = survey;
  const intentTitle = navigation.getParam('intentTitle', '');

  const [queryIndex, setQueryIndex] = useState(0);
  const getResponseData = useResponseFetcher();

  const progress = (queryIndex + 1) / queries.length;

  const didShownDealMakersAbortDialog = useSelector(dealMakersAbortDialogShown);
  const [dealMakersAbortAction, setDealMakersAbortAction] = useState(false);

  const dispatch = useDispatch();
  const dispatchDealMakersAbortDialogShown = useCallback(
    wasShown => {
      dispatch(setDealMakersAbortDialogShown(wasShown));
    },
    [dispatch]
  );

  const exitSurvey = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const onTapBack = useCallback(() => {
    if (queryIndex > 0) {
      setQueryIndex(queryIndex - 1);
    } else if (name === MUST_HAVE_NAME && !didShownDealMakersAbortDialog) {
      setDealMakersAbortAction(true);
      dispatchDealMakersAbortDialogShown(true);
    } else {
      exitSurvey();
    }
  }, [
    queryIndex,
    setQueryIndex,
    exitSurvey,
    name,
    setDealMakersAbortAction,
    dispatchDealMakersAbortDialogShown
  ]);

  const handleBackButtonPressAndroid = useCallback(() => {
    if (!navigation.isFocused()) {
      return false;
    }

    onTapBack();
    return true;
  }, [onTapBack, navigation]);

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

  useEffect(() => {
    return () => {
      logTimingEnd({
        event: ANALYTICS_EVENT.ANSWER_SURVEY,
        contentType: ANALYTICS_CONTENT_TYPE.SURVEY_TEMPLATE,
        data: survey,
        context: {
          [ANALYTICS_EVENT_ATTRIBUTES.COMPLETED]: progress === 1
        }
      });
    };
  }, [progress]);

  useEffect(() => {
    if (survey) {
      logTimingStart({ event: ANALYTICS_EVENT.ANSWER_SURVEY });
    }
  }, [survey]);

  const abortDealMakers = () => {
    setDealMakersAbortAction(false);
    exitSurvey();
  };

  const onNext = (currentIndex = 0) => {
    if (progress === 1) {
      const { onSurveyFinished, wasCompletedBefore } = navigation.state.params;
      onSurveyFinished(name, wasCompletedBefore);
      exitSurvey();
    } else {
      setQueryIndex(currentIndex + 1);
    }
  };

  return (
    <SafeAreaView style={STYLES.screen}>
      <TopBar
        onPressLeftItem={onTapBack}
        leftItemLabel=" "
        style={STYLES.topBar}
        tintColor={APP_ACCENT_BLUE}
        title={intentTitle}
      />
      <View style={STYLES.content}>
        <ProgressBar progress={progress} />
        <PagedView pageNumber={queryIndex} scrollEnabled={false}>
          {queries.map(
            (query, i) =>
              isWithinOne(queryIndex, i) && (
                <Query
                  submitButtonLabel={getButtonLabel(progress)}
                  onSubmit={() => onNext(i)}
                  key={query.uuid}
                  query={query}
                  responseData={getResponseData(query)}
                  showTag
                  isActive={queryIndex === i}
                />
              )
          )}
        </PagedView>
      </View>
      <ActionModal
        isVisible={dealMakersAbortAction}
        title={DEAL_MAKERS_ABORT_ACTION_TITLE}
        statement={DEAL_MAKERS_ABORT_ACTION_STATEMENT}
        actionOption="Stay"
        dismissOption="Exit"
        onAction={() => setDealMakersAbortAction(false)}
        onDismiss={abortDealMakers}
      />
    </SafeAreaView>
  );
};
