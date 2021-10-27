import React, { useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import {
  getActivatedIntents,
  deactivateIntent
} from '../../Redux/MetadataRedux';
import { getResponseValues, clearResponses } from '../../Redux/ResponsesRedux';
import { getUserId } from '../../Redux/AuthRedux';

import {
  DEFAULT_TITLE_HEIGHT,
  ScrollSurface
} from '../../Containers/ScrollSurface';
import {
  DEFAULT_TOP_BAR_HEIGHT,
  ActionModal,
  LargeCard
} from '../../Components';
import { COLOR_PALETTE, APP_WHITE_GRAY, APP_DARK_GRAY } from '../../Themes';
import { backgroundImageUrl } from '../../Services/CloudinaryService';
import { getIntents, getTemplateByUuid } from '../../Services/TemplatesService';
import { shareApp } from '../../Services/ShareService';
import { toTestIds } from '../../Utils';

const HEADER_WRAPPER_HEIGHT =
  DEFAULT_TOP_BAR_HEIGHT + DEFAULT_TITLE_HEIGHT + 16;

const INTENT_RESET_ACTION_TITLE = 'Delete Intent Data?';
const INTENT_RESET_ACTION_STATEMENT =
  'Feel like starting over? Clear out all your data. This can’t be undone.';
const INTENT_RESET_VERIFY_ACTION_TITLE = 'Are You Sure?';
const INTENT_RESET_VERIFY_ACTION_STATEMENT = "There's no going back!";
const APP_SHARE_ACTION_TITLE = 'Options';
const APP_SHARE_ACTION_STATEMENT =
  'Share this app with a potential partner, or if you prefer, reset your data and start';

const STYLES = StyleSheet.create({
  screen: {
    flex: 1
  },
  headerWrapper: {
    backgroundColor: APP_DARK_GRAY,
    height: HEADER_WRAPPER_HEIGHT,
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomRightRadius: 16,
    borderBottomLeftRadius: 16,
    overflow: 'hidden'
  },
  contentContainer: {
    flex: 1,
    padding: 16
  },
  tag: {
    minWidth: 80
  }
});

const getIntentCrumb = name => {
  return `romance/intent.${name}`;
};

export const Intents = ({ navigation }) => {
  const [intentResetAction, setIntentResetAction] = useState(false);
  const [intentResetVerifyAction, setIntentResetVerifyAction] = useState(false);
  const [shareOptionAction, setShareOptionAction] = useState(false);
  const activatedIntents = useSelector(getActivatedIntents);
  const responses = useSelector(getResponseValues);
  const userId = useSelector(getUserId);

  const intentsData = getIntents().sort((a, b) => {
    const first = activatedIntents.has(a.uuid);
    const second = activatedIntents.has(b.uuid);
    if (first === second) {
      return a.naturalOrder > b.naturalOrder;
    }
    return !first && second;
  });

  const dispatch = useDispatch();
  const dispatchDeactivation = useCallback(
    intentId => {
      dispatch(deactivateIntent(intentId));
    },
    [dispatch]
  );
  const dispatchClearResponses = useCallback(
    uuids => {
      dispatch(clearResponses(uuids));
    },
    [dispatch]
  );

  const onPressCard = id => {
    navigation.navigate({
      routeName: 'IntentType',
      params: {
        id
      }
    });
  };

  const onMore = () => {
    setShareOptionAction(true);
  };

  const onIntentResetAction = () => {
    setIntentResetAction(false);
    setIntentResetVerifyAction(true);
  };

  const onShare = async () => {
    setShareOptionAction(false);
    await shareApp(userId);
  };

  const onClear = () => {
    setShareOptionAction(false);
    setIntentResetAction(true);
  };

  const onIntentResetVerifyAction = () => {
    const intents = Array.from(activatedIntents);
    intents.map(intentId => dispatchDeactivation(intentId));

    const responseUuids = responses
      .filter(({ uuid }) => {
        const template = getTemplateByUuid(uuid);
        return template.crumb.split('.')[0] === 'romance';
      })
      .flatMap(({ uuid }) => uuid);
    dispatchClearResponses(responseUuids);

    setIntentResetVerifyAction(false);
  };

  return (
    <View style={STYLES.screen}>
      <ScrollSurface
        title="Intents"
        topBarProps={{
          rightItemIcon: 'more-vert',
          rightItemTestId: 'Delete Intent Data',
          onPressRightItem: onMore
        }}
        contentStyle={{ backgroundColor: APP_WHITE_GRAY }}>
        <View style={STYLES.headerWrapper} />

        <View style={STYLES.contentContainer}>
          {intentsData.map(
            ({ uuid, name, title, statement, style, glyphs }) => {
              const isActivated = activatedIntents.has(uuid);
              const imgUrl = backgroundImageUrl({
                name: getIntentCrumb(name)
              });
              return (
                <LargeCard
                  {...toTestIds(title)}
                  key={uuid}
                  glyph={glyphs}
                  title={title}
                  text={statement}
                  tagAlign="right"
                  tagColor={COLOR_PALETTE.green}
                  tag={isActivated ? 'active' : undefined}
                  tagWrapperStyle={STYLES.tag}
                  backgroundImage={{ uri: imgUrl }}
                  style={{
                    marginVertical: 8,
                    backgroundColor: COLOR_PALETTE[style]
                  }}
                  isActivated={isActivated}
                  onPress={() => {
                    onPressCard(uuid);
                  }}
                />
              );
            }
          )}
        </View>
      </ScrollSurface>
      <ActionModal
        isVisible={intentResetAction}
        title={INTENT_RESET_ACTION_TITLE}
        statement={INTENT_RESET_ACTION_STATEMENT}
        actionOption="Start Over"
        dismissOption="Nevermind"
        onAction={onIntentResetAction}
        onDismiss={() => setIntentResetAction(false)}
      />
      <ActionModal
        isVisible={intentResetVerifyAction}
        title={INTENT_RESET_VERIFY_ACTION_TITLE}
        statement={INTENT_RESET_VERIFY_ACTION_STATEMENT}
        actionOption="I'm sure"
        dismissOption="Nevermind"
        onAction={onIntentResetVerifyAction}
        onDismiss={() => setIntentResetVerifyAction(false)}
      />
      <ActionModal
        isVisible={shareOptionAction}
        title={APP_SHARE_ACTION_TITLE}
        statement={APP_SHARE_ACTION_STATEMENT}
        actionOption="Share with Partner"
        dismissOption="Clear Data"
        onAction={onShare}
        onDismiss={onClear}
        onCancel={() => setShareOptionAction(false)}
      />
    </View>
  );
};
