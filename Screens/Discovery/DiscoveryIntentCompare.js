import { get, flow } from 'lodash';
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { SafeAreaView, View, Text, BackHandler } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import {
  comparisonAbortDialogShown,
  whereYouAlignDialogShown,
  setComparisonAbortDialogShown,
  setWhereYouAlignDialogShown,
  getCxIndex
} from '../../Redux/MetadataRedux';
import { getUsername } from '../../Redux/AuthRedux';
import {
  initializeSession,
  getSessionPeer,
  getAlignedIntents,
  getIsUserTurn,
  setIsUserTurn,
  setOutgoingCompareInvite,
  getSessionPeerId
} from '../../Redux/SessionRedux';

import {
  DEFAULT_TOP_BAR_HEIGHT,
  TopBar,
  ProgressBar,
  SwipeableStack,
  ActionModal
} from '../../Components';
import { toTestIds, toUuids } from '../../Utils';

import { DiscoveryCompareSummary } from './DiscoveryCompareSummary';
import { CompareInviteModals } from './CompareInviteModals';

import {
  APP_BLACK,
  APP_DARK_GRAY,
  APP_ACCENT_BLUE,
  APP_WHITE,
  APP_GREEN,
  APP_RED,
  Fonts
} from '../../Themes';
import { AlignmentQuery } from '../../Containers';

import {
  logTimingStart,
  logTimingEnd,
  ANALYTICS_EVENT,
  ANALYTICS_CONTENT_TYPE
} from '../../Services/Analytics';

const COMPARISON_ABORT_ACTION_TITLE = 'Stop Exploring?';
const COMPARISON_ABORT_ACTION_STATEMENT =
  'Are you sure you want to stop in the middle of comparing your alignment?';

const WHERE_YOU_ALIGN_ACTION_TITLE = 'See where you align';
const WHERE_YOU_ALIGN_ACTION_STATEMENT =
  'Swipe through each card to see where the two of you match on different topics.';

const VERIFY_DISCONNECT_ACTION_TITLE = 'Exit Discovery';
const VERIFY_DISCONNECT_ACTION_STATEMENT =
  'Are you sure you want to exit the connection with this person?';

const STYLES = {
  screen: {
    flex: 1,
    backgroundColor: APP_BLACK
  },
  content: {
    flex: 1,
    marginTop: DEFAULT_TOP_BAR_HEIGHT
  },
  topBar: {
    backgroundColor: APP_DARK_GRAY
  },
  query: {
    borderRadius: 8,
    shadowColor: 'rgba(0,0,0,0.15)',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4
  },
  queryheader: {},
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: APP_DARK_GRAY,
    opacity: 0.42,
    height: 50,
    marginBotton: 0,
    marginTop: 8,
    borderTopRightRadius: 8,
    borderTopLeftRadius: 8
  },
  turnText: {
    color: APP_WHITE,
    fontFamily: Fonts.type.base,
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: -0.24,
    lineHeight: 20,
    textAlignVertical: 'center'
  },
  button: {
    height: 50,
    marginTop: 'auto',
    marginBottom: 10
  }
};

const renderTurnDetails = (isUserTurn, peerName, emphasized = false) => {
  const turnColor = isUserTurn ? APP_GREEN : APP_RED;
  return (
    <View
      style={[
        STYLES.footer,
        emphasized && {
          backgroundColor: turnColor,
          opacity: 1
        }
      ]}>
      <Text style={[STYLES.turnText, !emphasized && { color: turnColor }]}>
        {isUserTurn ? 'Your Turn' : `${peerName.toUpperCase()}'s Turn`}
      </Text>
    </View>
  );
};

const usePrevious = value => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

export const DiscoveryIntentCompare = ({ navigation }) => {
  const intent = navigation.getParam('intent');
  const isForUnaligned = navigation.getParam('isForUnaligned');
  const alignedQueries = navigation.getParam('alignedQueries');
  const unalignedQueries = navigation.getParam('unalignedQueries');

  const peerId = useSelector(getSessionPeerId);
  const cxIndex = useSelector(getCxIndex);
  const peerName = get(useSelector(getSessionPeer), ['username'], '');
  const alignedIntents = useSelector(getAlignedIntents);
  const name = useSelector(getUsername);

  const isUserTurn = useSelector(getIsUserTurn);
  const emphasized = false;

  const queryMatches = isForUnaligned ? unalignedQueries : alignedQueries;
  const shouldOfferUnaligned = !isForUnaligned && unalignedQueries.length > 0;
  const queryCount = new Set([
    ...toUuids(alignedQueries),
    ...toUuids(unalignedQueries)
  ]).size;

  // Intents in aligned result, filtered with parent?
  const otherIntents = alignedIntents
    .filter(({ uuid }) => uuid !== intent.uuid)
    .map(({ template }) => template);
  const [verifyDisconnectAction, setVerifyDisconnectAction] = useState(false);

  const [wasUserTurn, setWasUserTurn] = useState(isUserTurn);
  const [queryIndex, setQueryIndex] = useState(0);
  const progress = queryMatches.length
    ? (queryIndex + 1) / queryMatches.length
    : 2;

  const prevWasUserTurn = usePrevious(wasUserTurn);

  const didShownComparisonAbortDialog = useSelector(comparisonAbortDialogShown);
  const [comparisonAbortAction, setComparisonAbortAction] = useState(false);
  const didShownWhereYouAlignDialog = useSelector(whereYouAlignDialogShown);
  const [showWhereYouAlignDialog, setShowWhereYouAlignDialog] = useState(false);

  const dispatch = useDispatch();
  const dispatchComparisonAbortDialogShown = useCallback(
    flow([setComparisonAbortDialogShown, dispatch]),
    [dispatch]
  );
  const dispatchWhereYouAlignDialogShown = useCallback(
    flow([setWhereYouAlignDialogShown, dispatch]),
    [dispatch]
  );
  const dispatchDisconnect = useCallback(
    () => dispatch(initializeSession(null)),
    [dispatch]
  );
  const dispatchPeerTurn = useCallback(() => dispatch(setIsUserTurn(false)), [
    dispatch
  ]);
  const dispatchCompareInvite = useCallback(
    flow([setOutgoingCompareInvite, dispatch]),
    [dispatch]
  );

  const onTapClose = useCallback(() => {
    if (!didShownComparisonAbortDialog) {
      setComparisonAbortAction(true);
      dispatchComparisonAbortDialogShown(true);
    } else {
      navigation.navigate('DiscoveryIntentsReview');
    }
  }, [
    navigation,
    didShownComparisonAbortDialog,
    setComparisonAbortAction,
    dispatchComparisonAbortDialogShown
  ]);

  useEffect(() => {
    logTimingStart({
      event: ANALYTICS_EVENT.EXPLORE_ALIGNMENT
    });
    return () => {
      logTimingEnd({
        event: ANALYTICS_EVENT.EXPLORE_ALIGNMENT,
        contentType: ANALYTICS_CONTENT_TYPE.INTENT_TEMPLATE,
        data: intent,
        context: {
          peerID: peerId,
          cxIndex,
          isAligned: !isForUnaligned
        }
      });
    };
  }, [intent, peerId, cxIndex, isForUnaligned]);

  useEffect(() => {
    setShowWhereYouAlignDialog(!didShownWhereYouAlignDialog);
  }, [didShownWhereYouAlignDialog]);

  const handleBackButtonPressAndroid = useCallback(() => {
    if (!navigation.isFocused()) {
      return false;
    }

    onTapClose();

    return true;
  }, [onTapClose]);

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

  const triggerFnRef = useRef(() => {});
  const setSwipeTriggerFn = useCallback(triggerFn => {
    triggerFnRef.current = triggerFn;
  });

  useEffect(() => {
    // Current turn state has changed
    if (wasUserTurn !== isUserTurn) {
      if (isUserTurn) {
        setWasUserTurn(true);
      } else {
        setWasUserTurn(false);
      }
    } else if (prevWasUserTurn === false && wasUserTurn) {
      triggerFnRef.current();
    }
  }, [isUserTurn, wasUserTurn]);

  const onDidShowWhereYouAlign = () => {
    setShowWhereYouAlignDialog(false);
    dispatchWhereYouAlignDialogShown(true);
  };

  const abortComparison = () => {
    setComparisonAbortAction(false);
    navigation.navigate('DiscoveryIntentsReview');
  };

  const disconnectDiscovery = () => {
    dispatchDisconnect();
    setVerifyDisconnectAction(false);
  };

  const onPressIntent = pressedIntent => {
    dispatchCompareInvite({
      intentId: pressedIntent.uuid,
      isForUnaligned: false
    });
  };

  const onPressUnaligned = () => {
    dispatchCompareInvite({
      intentId: intent.uuid,
      isForUnaligned: true
    });
  };

  const onCardSwiped = cardIndex => {
    setQueryIndex(cardIndex + 1);
    if (isUserTurn && prevWasUserTurn !== false && wasUserTurn) {
      dispatchPeerTurn();
    }
  };

  const renderItem = (queryMatch, index) => {
    const { uuid, template, userResponses, peerResponses } = queryMatch;
    return (
      <AlignmentQuery
        key={uuid}
        query={template}
        user={name}
        responsesForUser={userResponses}
        peerUser={peerName}
        responsesForPeerUser={peerResponses}
        isForUnaligned={isForUnaligned}
        showTag
        style={STYLES.query}
        headerStyle={STYLES.queryheader}
        isActive={index === 0}
        peerId={peerId}
        cxIndex={cxIndex}
      />
    );
  };

  return (
    <SafeAreaView style={STYLES.screen}>
      <TopBar
        onPressLeftItem={onTapClose}
        leftItemLabel=" "
        style={STYLES.topBar}
        tintColor={APP_ACCENT_BLUE}
        title={intent.title}
      />
      <View style={STYLES.content}>
        <ProgressBar progress={progress} />
        {progress <= 1 && (
          <SwipeableStack
            {...toTestIds('Alignments')}
            items={queryMatches}
            renderItem={renderItem}
            onCardSwiped={onCardSwiped}
            setSwipeTriggerFn={setSwipeTriggerFn}
            disabled={!isUserTurn}
          />
        )}
        {progress <= 1 && renderTurnDetails(isUserTurn, peerName, emphasized)}
        {progress > 1 && (
          <DiscoveryCompareSummary
            isForUnaligned={isForUnaligned}
            shouldOfferUnaligned={shouldOfferUnaligned}
            otherIntents={otherIntents}
            onPressExit={() => setVerifyDisconnectAction(true)}
            onPressIntent={onPressIntent}
            onPressUnaligned={onPressUnaligned}
            queryMatches={queryMatches}
            queryCount={queryCount}
            peerName={peerName}
          />
        )}
      </View>
      <ActionModal
        isVisible={comparisonAbortAction}
        title={COMPARISON_ABORT_ACTION_TITLE}
        statement={COMPARISON_ABORT_ACTION_STATEMENT}
        actionOption="Leave"
        dismissOption="Stay"
        onAction={abortComparison}
        onDismiss={() => setComparisonAbortAction(false)}
      />
      <ActionModal
        isVisible={showWhereYouAlignDialog}
        title={WHERE_YOU_ALIGN_ACTION_TITLE}
        statement={WHERE_YOU_ALIGN_ACTION_STATEMENT}
        actionOption="Got it!"
        onAction={onDidShowWhereYouAlign}
      />
      <ActionModal
        isVisible={verifyDisconnectAction}
        title={VERIFY_DISCONNECT_ACTION_TITLE}
        statement={VERIFY_DISCONNECT_ACTION_STATEMENT}
        actionOption="Leave"
        dismissOption="Stay"
        onAction={disconnectDiscovery}
        onDismiss={() => setVerifyDisconnectAction(false)}
      />
      <CompareInviteModals />
    </SafeAreaView>
  );
};
