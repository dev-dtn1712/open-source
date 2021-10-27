import {
  call,
  cancel,
  fork,
  put,
  select,
  spawn,
  take
} from 'redux-saga/effects';
import { NavigationActions, StackActions } from 'react-navigation';

import { getUsername } from './AuthRedux';
import {
  clearCurrentSessionInvitee,
  getAvailablePeers,
  setIsAvailable,
  setSessionWasLost
} from './ConnectionRedux';
import { getMessagingId, getCxIndex, setCxIndex } from './MetadataRedux';
import { getResponses } from './ResponsesRedux';
import {
  INITIALIZE_SESSION,
  initializeSession,
  resetSession,
  getSessionPeerId,
  setSessionPeer,
  getSessionPeerData,
  setSessionPeerData,
  getSessionUserData,
  setSessionUserData,
  setAlignedIntents,
  getOutgoingCompareInvite,
  clearOutgoingCompareInvite,
  getIncomingCompareInvite,
  setIncomingCompareInvite,
  clearIncomingCompareInvite,
  setOutgoingCompareInviteRejected,
  setIsUserTurn
} from './SessionRedux';

import { analyzeAlignment } from '../Services/Geometry';
import {
  privateData,
  compareInvites,
  compareCancels,
  compareAccepts,
  compareRejects,
  nextSwipes,
  sessionCancels,
  sendPrivateData,
  sendCompareInvite,
  cancelCompareInvite,
  acceptCompareInvite,
  rejectCompareInvite,
  sendSwipedNext,
  cancelSessionInvite
} from '../Services/Sessions';
import { getIntents } from '../Services/TemplatesService';
import { eventHandler, logger } from '../Utils';
import {
  logTimingStart,
  logTimingEnd,
  logCustom,
  ANALYTICS_EVENT,
  ANALYTICS_CONTENT_TYPE
} from '../Services/Analytics';

const has = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const stubNull = () => null;
const stubTrue = () => true;
const pluck = key => item => item[key];
const pluckUuid = pluck('uuid');

const includesChecker = items => {
  const itemSet = new Set(items);
  return item => itemSet.has(item);
};
const uuidIncludedIn = uuids => {
  const includesUuid = includesChecker(uuids);
  return ({ uuid }) => includesUuid(uuid);
};

const queryIncludesResponse = responseMatcher => ({ responses }) =>
  responses.some(responseMatcher);
const surveyIncludesResponse = responseMatcher => ({ queries }) =>
  queries.some(queryIncludesResponse(responseMatcher));

function* senderMatchesSessionPeer({ senderUUID }) {
  const peerId = yield select(getSessionPeerId);
  return senderUUID === peerId;
}
function* eventMatchesIncomingInvite(event) {
  const { intentId } = yield select(getIncomingCompareInvite);
  const senderMatches = yield senderMatchesSessionPeer(event);

  return senderMatches && event.intentId === intentId;
}
function* eventMatchesOutgoingInvite(event) {
  const { intentId } = yield select(getOutgoingCompareInvite);
  const senderMatches = yield senderMatchesSessionPeer(event);

  return senderMatches && event.intentId === intentId;
}

function* startAlignmentCompare({ intentId, isForUnaligned }) {
  const routeInfo = {
    routeName: 'DiscoveryIntentConnecting',
    params: {
      intentId,
      isForUnaligned
    }
  };

  // When navigating from the Matching Intents screen we want to keep it on
  // the navigation stack, but not when navigating from the Compare screen
  if (isForUnaligned) {
    yield put(StackActions.replace(routeInfo));
  } else {
    yield put(NavigationActions.navigate(routeInfo));
  }
}
function* startCompareFromOutgoing({ intentId }) {
  const outgoingInvite = yield select(getOutgoingCompareInvite);
  if (outgoingInvite.intentId === intentId) {
    yield put(clearOutgoingCompareInvite(null));
    yield fork(startAlignmentCompare, outgoingInvite);
  }
}
function* startCompareFromIncoming({ intentId }) {
  const incomingInvite = yield select(getIncomingCompareInvite);
  if (incomingInvite.intentId === intentId) {
    yield put(clearIncomingCompareInvite(null));
    yield fork(startAlignmentCompare, incomingInvite);
  }
}

const handlePrivateData = eventHandler({
  events: privateData,
  action: setSessionPeerData
});
const handleCompareInvites = eventHandler({
  events: compareInvites,
  action: setIncomingCompareInvite,
  isValid: senderMatchesSessionPeer
});
const handleCompareCancels = eventHandler({
  events: compareCancels,
  action: clearIncomingCompareInvite,
  parseEvent: stubNull,
  isValid: eventMatchesIncomingInvite
});
const handleCompareAccepts = eventHandler({
  events: compareAccepts,
  effect: startCompareFromOutgoing,
  isValid: eventMatchesOutgoingInvite
});
const handleCompareRejects = eventHandler({
  events: compareRejects,
  action: setOutgoingCompareInviteRejected,
  parseEvent: stubTrue,
  isValid: eventMatchesOutgoingInvite
});
const handleNextSwipes = eventHandler({
  events: nextSwipes,
  action: setIsUserTurn,
  parseEvent: stubTrue,
  isValid: senderMatchesSessionPeer
});
const handleSessionCancels = eventHandler({
  events: sessionCancels,
  action: setSessionWasLost,
  parseEvent: stubTrue,
  isValid: senderMatchesSessionPeer
});

export function* updateSession() {
  while (true) {
    let { sessionConfig } = yield take(INITIALIZE_SESSION);

    if (sessionConfig) {
      // if new session increase cxIndex
      let cxIndex = yield select(getCxIndex);
      cxIndex += 1;
      yield put(setCxIndex(cxIndex + 1));

      const { peerId } = sessionConfig;
      const availablePeers = yield select(getAvailablePeers);
      const peer = availablePeers.find(({ uuid }) => uuid === peerId);

      if (peer) {
        // log peer connection to analytics
        logTimingStart({
          event: ANALYTICS_EVENT.CONNECT_PEER
        });

        logger.debug('Starting session with:', peerId);
        const privateDataTask = yield fork(handlePrivateData);
        const compareInviteTask = yield fork(handleCompareInvites);
        const compareCancelTask = yield fork(handleCompareCancels);
        const compareAcceptTask = yield fork(handleCompareAccepts);
        const compareTaskReject = yield fork(handleCompareRejects);
        const nextSwipesTask = yield fork(handleNextSwipes);
        const sessionCancelTask = yield fork(handleSessionCancels);

        yield put(setSessionPeer(peer));
        yield put(
          NavigationActions.navigate({ routeName: 'DiscoveryIntentsStaging' })
        );
        yield put(setIsAvailable(false));

        // Wait for Session to end
        while (sessionConfig) {
          ({ sessionConfig } = yield take(INITIALIZE_SESSION));
        }
        // log peer connection to analytics
        logTimingEnd({
          event: ANALYTICS_EVENT.CONNECT_PEER,
          context: {
            peerID: peerId,
            cxIndex
          }
        });

        yield call(cancelSessionInvite, peerId);
        yield put(setIsAvailable(true));
        yield put(clearCurrentSessionInvitee(peerId));
        yield put(
          NavigationActions.navigate({ routeName: 'DiscoveryScanning' })
        );
        yield put(resetSession());
        yield cancel(sessionCancelTask);
        yield cancel(nextSwipesTask);
        yield cancel(compareTaskReject);
        yield cancel(compareAcceptTask);
        yield cancel(compareCancelTask);
        yield cancel(compareInviteTask);
        yield cancel(privateDataTask);
      } else {
        // Peer id missing from available peers, clear invalid Session state
        logger.warn('Session user not found among available peers:', peerId);
        yield put(initializeSession(null));
      }
    }
  }
}

function* clearSessionData() {
  yield put(setSessionPeerData(null));
  yield put(setSessionUserData(null));
}

// Runs any time peer or user data is updated
export function* alignSessionData() {
  const peerData = yield select(getSessionPeerData);
  const userData = yield select(getSessionUserData);

  if (peerData && userData) {
    const peerId = yield select(getSessionPeerId);
    const cxIndex = yield select(getCxIndex);

    const alignedIntents = analyzeAlignment({
      userResponses: userData.responses,
      peerResponses: peerData.responses,
      userIntentIds: userData.intentIds,
      peerIntentIds: peerData.intentIds
    });

    // log aligned Intents to analytics
    alignedIntents.forEach(alignedIntent => {
      logCustom({
        event: ANALYTICS_EVENT.DETECT_ALIGNMENT,
        contentType: ANALYTICS_CONTENT_TYPE.INTENT_TEMPLATE,
        data: alignedIntent.template,
        context: {
          peerID: peerId,
          cxIndex,
          aligned: alignedIntent.alignedQueries.length,
          unaligned: alignedIntent.unalignedQueries.length,
          bothAnswered: alignedIntent.bothAnswered.count
        }
      });
    });
    yield put(setAlignedIntents(alignedIntents));
  }
}

export function* navigateOnAlignment({ alignedIntents }) {
  if (alignedIntents.length > 0) {
    yield put(
      NavigationActions.navigate({ routeName: 'DiscoveryIntentsReview' })
    );
  } else {
    yield put(NavigationActions.navigate({ routeName: 'DiscoveryNoMatches' }));

    // Spawn off this call to avoid stacking up puts to the same action,
    // which will prevent this function from ever completing
    yield spawn(clearSessionData);
  }
}

export function* dispatchPrivateData({ intentIds }) {
  const peerId = yield select(getSessionPeerId);

  if (peerId) {
    const userMessagingId = yield select(getMessagingId);
    const username = yield select(getUsername);
    const answeredResponses = yield select(getResponses);

    const isAnswered = uuid => has(answeredResponses, uuid);
    const selectedIntents = getIntents().filter(uuidIncludedIn(intentIds));
    const cxIndex = yield select(getCxIndex);
    // send shared intents to analytics
    selectedIntents.forEach(intent => {
      logCustom({
        event: ANALYTICS_EVENT.SHARE_INTENT,
        contentType: ANALYTICS_CONTENT_TYPE.INTENT_TEMPLATE,
        data: intent,
        context: {
          peerID: peerId,
          cxIndex
        }
      });
    });

    const selectedSurveys = selectedIntents.flatMap(pluck('surveys'));

    const surveyIds = selectedSurveys
      .filter(surveyIncludesResponse(({ uuid }) => isAnswered(uuid)))
      .map(pluckUuid);

    const responses = selectedSurveys
      .flatMap(pluck('queries'))
      .flatMap(pluck('responses'))
      .map(pluckUuid)
      .filter(isAnswered)
      .map(uuid => answeredResponses[uuid]);

    yield call(sendPrivateData, peerId, {
      uuid: userMessagingId,
      username,
      intentIds,
      surveyIds,
      responses
    });

    yield put(setSessionUserData({ intentIds, surveyIds, responses }));
  }
}

export function* handleSessionLost({ sessionWasLost }) {
  if (sessionWasLost) {
    yield put(initializeSession(null));
  }
}

export function* dispatchCompareInvite({ compareInvite }) {
  const { intentId, isForUnaligned } = compareInvite;
  const peerId = yield select(getSessionPeerId);

  yield call(sendCompareInvite, peerId, intentId, isForUnaligned);
}
export function* dispatchCompareCancel({ compareInvite }) {
  // Can be triggered as a side-effect of other state changes, will only
  // send a cancel message if passed a compareInvite to send
  if (compareInvite) {
    const { intentId, isForUnaligned } = compareInvite;
    const peerId = yield select(getSessionPeerId);

    yield call(cancelCompareInvite, peerId, intentId, isForUnaligned);
  }
}
export function* dispatchCompareAccept({ compareInvite }) {
  const { intentId } = compareInvite;
  const peerId = yield select(getSessionPeerId);

  yield call(acceptCompareInvite, peerId, intentId);
  yield spawn(startCompareFromIncoming, compareInvite);
}
export function* dispatchCompareReject({ compareInvite }) {
  if (compareInvite) {
    const { intentId } = compareInvite;
    const peerId = yield select(getSessionPeerId);

    yield call(rejectCompareInvite, peerId, intentId);
  }
}
export function* dispatchSwipeNext({ isUserTurn }) {
  // Was user's turn and they swiped, notify peer it is now their turn
  if (!isUserTurn) {
    const peerId = yield select(getSessionPeerId);
    yield call(sendSwipedNext, peerId);
  }
}
