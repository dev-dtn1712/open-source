import React, { useState, useCallback, useEffect } from 'react';
import {
  Animated,
  StyleSheet,
  View,
  Image,
  Text,
  TouchableWithoutFeedback
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import ToggleSwitch from 'toggle-switch-react-native';
import { head } from 'lodash';

import {
  defineNeedsDialogShown,
  setDefineNeedsDialogShown,
  activateIntent,
  deactivateIntent,
  intentActivationVerifier
} from '../../Redux/MetadataRedux';
import { getResponses } from '../../Redux/ResponsesRedux';

import {
  DEFAULT_TITLE_HEIGHT,
  ScrollSurface
} from '../../Containers/ScrollSurface';
import {
  DEFAULT_TOP_BAR_HEIGHT,
  SmallCard,
  ButtonCarousel,
  ActionModal
} from '../../Components';

import {
  APP_BRIGHT_GRAY,
  APP_WHITE_GRAY,
  APP_WHITE,
  APP_BLACK,
  APP_GREEN,
  APP_DISABLED_CARD,
  APP_RED,
  APP_PURPLE,
  APP_BLUE,
  Images,
  COLOR_PALETTE,
  Metrics,
  Fonts
} from '../../Themes';
import { toTestIds, toUuids } from '../../Utils';
import { backgroundImageUrl } from '../../Services/CloudinaryService';
import {
  MUST_HAVE_NAME,
  NICE_TO_HAVE_NAME,
  ONE_OFF_TYPE,
  getTemplateByUuid
} from '../../Services/TemplatesService';
import {
  logIfIntentCompleted,
  logCustom,
  ANALYTICS_EVENT,
  ANALYTICS_CONTENT_TYPE,
  ANALYTICS_EVENT_ATTRIBUTES
} from '../../Services/Analytics';

const SCREEN_HEIGHT = Math.round(Metrics.screenHeight);
const TAB_BAR_HEIGHT = 70;
const EXPANDED_HEADER_HEIGHT = SCREEN_HEIGHT - TAB_BAR_HEIGHT - 16;
const COLLAPSED_HEADER_HEIGHT = 330;

const ACTIVATE_LABEL = 'Turn on Intent';

const DEFINE_NEEDS_ACTION_TITLE = 'Define Your Needs';
const DEFINE_NEEDS_ACTION_STATEMENT =
  'Answer questions on what you can’t live without in this type of relationship.';
const SAFE_DATA_ACTION_TITLE = 'Personal Data';
const SAFE_DATA_ACTION_STATEMENT =
  'The data in this intent will be safe and sound until you reactivate it.';
const DEAL_MAKERS_UNLOCK_ACTION_TITLE = 'Nice-to-haves Unlocked';
const DEAL_MAKERS_UNLOCK_ACTION_STATEMENT =
  'Take the next survey on what topics you’re willing to be flexible on in this relationship.';

const SURVEY_STATUS = {
  NONE: 'notStarted',
  COMPLETED: 'isCompleted',
  INPROGRESS: 'isProgress'
};

const STYLES = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: APP_BRIGHT_GRAY
  },
  headerWrapper: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomRightRadius: 16,
    borderBottomLeftRadius: 16,
    overflow: 'hidden'
  },
  headerBody: {
    flex: 1,
    paddingTop: DEFAULT_TOP_BAR_HEIGHT + DEFAULT_TITLE_HEIGHT
  },
  backgroundImage: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    opacity: 0.2
  },
  textLabel: {
    ...Fonts.style.normal,
    color: APP_WHITE,
    marginTop: 26
  },
  switchContainer: {
    flexDirection: 'row',
    backgroundColor: APP_WHITE,
    borderRadius: 8,
    marginTop: 'auto',
    marginBottom: 8,
    padding: 16
  },
  switchLabel: {
    ...Fonts.style.normal,
    color: APP_BLACK,
    marginLeft: 16,
    marginTop: 8
  },
  contentContainer: {
    flex: 1,
    paddingVertical: 16
  },
  surveys: {
    marginVertical: 8,
    marginHorizontal: 16
  }
});

const getSurveyTagInfo = level => {
  switch (level) {
    case 1:
      return { tag: 'STEP ONE', tagColor: APP_RED };
    case 2:
      return { tag: 'STEP TWO', tagColor: APP_PURPLE };
    case 3:
      return { tag: 'GOOD TO KNOW', tagColor: APP_BLUE };
    default:
      return { tag: 'STEP ONE', tagColor: APP_RED };
  }
};

const imgUrl = name =>
  backgroundImageUrl({
    name: `romance/intent.${name}`
  });

const includesCompletedFetcher = allResponses => responseTemplates => {
  const responses = toUuids(responseTemplates).map(uuid => allResponses[uuid]);
  return responses.some(Boolean);
};

const surveyCompleted = (survey, includesCompleted) => {
  const { queries } = survey;
  const completedCount = queries.reduce(
    (prev, { responses }) => (includesCompleted(responses) ? prev + 1 : prev),
    0
  );
  if (completedCount === 0) return SURVEY_STATUS.NONE;
  if (completedCount === queries.length) return SURVEY_STATUS.COMPLETED;
  return SURVEY_STATUS.INPROGRESS;
};

const surveyStatusImage = status => {
  if (status === SURVEY_STATUS.COMPLETED) return Images.iconComplete;
  if (status === SURVEY_STATUS.INPROGRESS) return Images.iconInProgress;
  return undefined;
};

const getOneOffQueries = surveys =>
  surveys
    .filter(({ type }) => type === ONE_OFF_TYPE)
    .map(({ queries }) => head(queries));

const getFullSurveys = surveys =>
  surveys.filter(({ type }) => type !== ONE_OFF_TYPE);

const getCloudQueries = (queries, includesCompleted) =>
  queries.map(({ uuid, statement, responses }) => ({
    uuid,
    statement,
    isCompleted: includesCompleted(responses)
  }));

const renderHeaderWrapper = ({
  height,
  backgroundColor,
  backgroundImage,
  narrative,
  explores,
  isExpanded,
  onChangeActivation = () => {}
}) => (
  <Animated.View style={[STYLES.headerWrapper, { height, backgroundColor }]}>
    <Image
      style={STYLES.backgroundImage}
      resizeMode="cover"
      source={backgroundImage}
    />
    <View style={STYLES.headerBody}>
      {isExpanded && <Text style={STYLES.textLabel}>{narrative}</Text>}
      <Text style={STYLES.textLabel}>{explores}</Text>
      <TouchableWithoutFeedback onPress={() => onChangeActivation(isExpanded)}>
        <View style={STYLES.switchContainer}>
          <ToggleSwitch
            {...toTestIds('Activate Intent Switch')}
            isOn={!isExpanded}
            onColor={APP_GREEN}
            offColor={APP_DISABLED_CARD}
            size="large"
            onToggle={isOn => onChangeActivation(isOn)}
          />
          <Text style={STYLES.switchLabel}>{ACTIVATE_LABEL}</Text>
        </View>
      </TouchableWithoutFeedback>
    </View>
  </Animated.View>
);

const SurveySmallCard = ({
  survey,
  level,
  status,
  isLocked,
  onPress = () => {},
  ...props
}) => {
  const { uuid, title, statement } = survey;

  const { tag, tagColor } = getSurveyTagInfo(level);
  return (
    <SmallCard
      key={uuid}
      title={title}
      text={statement}
      isLocked={isLocked}
      statusImage={surveyStatusImage(status)}
      style={STYLES.surveys}
      tag={tag}
      tagColor={tagColor}
      onPress={() => !isLocked && onPress(survey, status)}
      {...props}
    />
  );
};

export const IntentType = ({ navigation }) => {
  const id = navigation.getParam('id');
  const intent = getTemplateByUuid(id);
  const isActivated = useSelector(intentActivationVerifier(id));

  const { uuid, name, title, surveys, style, narrative, explores } = intent;

  const isNavTransparencyEnabled = true;
  const [isExpanded, setIsExpanded] = useState(!isActivated);

  const fullSurveys = getFullSurveys(surveys);
  const hardExpectation = fullSurveys[0];
  const softExpectation = fullSurveys[1];

  const has3rdLevel = fullSurveys.length > 2;
  const goodToKnowExpectation = has3rdLevel ? fullSurveys[2] : null;

  const allResponses = useSelector(getResponses);
  const includesCompleted = includesCompletedFetcher(allResponses);

  const hardExpectationStatus = surveyCompleted(
    hardExpectation,
    includesCompleted
  );
  const softExpectationStatus = surveyCompleted(
    softExpectation,
    includesCompleted
  );

  const goodToKnowExpectationStatus = has3rdLevel
    ? surveyCompleted(goodToKnowExpectation, includesCompleted)
    : false;

  const oneOffQueries = getOneOffQueries(surveys);
  const carouselData = getCloudQueries(oneOffQueries, includesCompleted);

  const didShownDefineNeedsDialog = useSelector(defineNeedsDialogShown);

  const [safeDataAction, setSafeDataAction] = useState(false);
  const [defineNeedsAction, setDefineNeedsAction] = useState(false);
  const [dealMakersUnlockAction, setDealMakersUnlockAction] = useState(false);

  const dispatch = useDispatch();
  const dispatchActivation = useCallback(
    (intentId, shouldActivate) => {
      if (shouldActivate) {
        dispatch(activateIntent(intentId));
      } else {
        dispatch(deactivateIntent(intentId));
      }
    },
    [dispatch]
  );
  const dispatchDefineNeedsDialogShown = useCallback(
    wasShown => {
      dispatch(setDefineNeedsDialogShown(wasShown));
    },
    [dispatch]
  );

  const headerAnimated = new Animated.Value(
    isExpanded ? EXPANDED_HEADER_HEIGHT : COLLAPSED_HEADER_HEIGHT
  );

  const onChangeActivation = isSwitchOn => {
    if (isSwitchOn && !didShownDefineNeedsDialog) {
      setDefineNeedsAction(true);
      dispatchDefineNeedsDialogShown(true);
    }

    dispatchActivation(uuid, isSwitchOn);
    logCustom({
      event: ANALYTICS_EVENT.ACTIVATE_INTENT,
      contentType: ANALYTICS_CONTENT_TYPE.INTENT_TEMPLATE,
      data: intent,
      context: {
        [ANALYTICS_EVENT_ATTRIBUTES.ACTIVATED]: isSwitchOn
      }
    });
    setIsExpanded(!isSwitchOn);
    if (!isSwitchOn) {
      setSafeDataAction(true);
    }
  };

  const setCollapsed = isCollapsed => {
    const initialValue = isCollapsed
      ? EXPANDED_HEADER_HEIGHT
      : COLLAPSED_HEADER_HEIGHT;
    const finalValue = isCollapsed
      ? COLLAPSED_HEADER_HEIGHT
      : EXPANDED_HEADER_HEIGHT;

    headerAnimated.setValue(initialValue);

    Animated.spring(headerAnimated, {
      toValue: finalValue,
      useNativeDriver: false
    }).start();
  };

  const reenableIntent = () => {
    onChangeActivation(true);
    setSafeDataAction(false);
  };

  const resetIntent = () => {
    setSafeDataAction(false);
  };

  const onSurveyFinished = useCallback(
    (surveyFinished, wasCompletedBefore) => {
      if (surveyFinished === MUST_HAVE_NAME) {
        if (!wasCompletedBefore) {
          setDealMakersUnlockAction(true);
        }
        logCustom({
          event: ANALYTICS_EVENT.FINISH_DEALBREAKERS,
          contentType: ANALYTICS_CONTENT_TYPE.INTENT_TEMPLATE,
          data: intent
        });
      } else if (surveyFinished === NICE_TO_HAVE_NAME) {
        logCustom({
          event: ANALYTICS_EVENT.FINISH_DEALMAKERS,
          contentType: ANALYTICS_CONTENT_TYPE.INTENT_TEMPLATE,
          data: intent
        });
      }
      logIfIntentCompleted(intent);
    },
    [setDealMakersUnlockAction]
  );

  const onOneOffFinished = useCallback(() => {
    logIfIntentCompleted(intent, true);
  }, []);

  const onSurveyCard = useCallback(
    (survey, surveyStatus) => {
      navigation.navigate({
        routeName: 'FullSurvey',
        params: {
          survey,
          intentTitle: title,
          onSurveyFinished,
          wasCompletedBefore: surveyStatus === SURVEY_STATUS.COMPLETED
        }
      });
    },
    [navigation]
  );

  const onCloudQuery = query => {
    navigation.navigate({
      routeName: 'OneOffSurvey',
      params: {
        query,
        onOneOffFinished
      }
    });
  };

  useEffect(() => {
    setCollapsed(!isExpanded);
  }, [isExpanded]);

  return (
    <View style={STYLES.screen}>
      <ScrollSurface
        title={title}
        topBarProps={{
          leftItemLabel: 'Intents',
          onPressLeftItem: () => navigation.pop()
        }}
        isNavTransparencyEnabled={isNavTransparencyEnabled}
        barColor={COLOR_PALETTE[style]}
        contentStyle={{ backgroundColor: APP_WHITE_GRAY }}>
        {renderHeaderWrapper({
          height: headerAnimated,
          backgroundColor: COLOR_PALETTE[style],
          backgroundImage: { uri: imgUrl(name) },
          narrative,
          explores,
          isExpanded,
          onChangeActivation
        })}

        {!isExpanded && (
          <View style={STYLES.contentContainer}>
            <SurveySmallCard
              {...toTestIds('Must-haves')}
              survey={hardExpectation}
              level={1}
              status={hardExpectationStatus}
              onPress={onSurveyCard}
            />
            <SurveySmallCard
              {...toTestIds('Nice-to-haves')}
              survey={softExpectation}
              level={2}
              status={softExpectationStatus}
              isLocked={
                hardExpectationStatus !== SURVEY_STATUS.COMPLETED &&
                softExpectationStatus !== SURVEY_STATUS.COMPLETED
              }
              onPress={onSurveyCard}
            />
            {has3rdLevel && (
              <SurveySmallCard
                {...toTestIds('good-to-knows')}
                survey={goodToKnowExpectation}
                level={3}
                status={goodToKnowExpectationStatus}
                isLocked={
                  softExpectationStatus !== SURVEY_STATUS.COMPLETED &&
                  goodToKnowExpectationStatus !== SURVEY_STATUS.COMPLETED
                }
                onPress={onSurveyCard}
              />
            )}
            <ButtonCarousel
              {...toTestIds('Additional Questions')}
              data={carouselData}
              onSelected={index => onCloudQuery(oneOffQueries[index])}
            />
          </View>
        )}
      </ScrollSurface>
      <ActionModal
        isVisible={defineNeedsAction}
        title={DEFINE_NEEDS_ACTION_TITLE}
        statement={DEFINE_NEEDS_ACTION_STATEMENT}
        actionOption="Got it!"
        onAction={() => setDefineNeedsAction(false)}
        onDismiss={() => setDefineNeedsAction(false)}
      />
      <ActionModal
        isVisible={safeDataAction}
        title={SAFE_DATA_ACTION_TITLE}
        statement={SAFE_DATA_ACTION_STATEMENT}
        actionOption="Cancel"
        dismissOption="OK"
        onAction={reenableIntent}
        onDismiss={resetIntent}
      />
      <ActionModal
        isVisible={dealMakersUnlockAction}
        image={Images.iconSurveyUnlocked}
        title={DEAL_MAKERS_UNLOCK_ACTION_TITLE}
        statement={DEAL_MAKERS_UNLOCK_ACTION_STATEMENT}
        actionOption="Got it!"
        onAction={() => setDealMakersUnlockAction(false)}
        onDismiss={() => setDealMakersUnlockAction(false)}
      />
    </View>
  );
};
