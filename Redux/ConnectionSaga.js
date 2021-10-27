import { call, cancel, fork, put, select, take } from 'redux-saga/effects';
import { stubTrue } from 'lodash';
import {
  SET_IS_SCANNING,
  SET_IS_AVAILABLE,
  setAvailablePeers,
  setIsAvailable,
  getSessionInvites,
  addSessionInvite,
  removeSessionInvite,
  getCurrentSessionInvitee,
  clearCurrentSessionInvitee,
  setCurrentInviteeRejectedSession,
  setSessionWasLost
} from './ConnectionRedux';
import { getUsername } from './AuthRedux';
import { getContentDate } from './ContentMetaRedux';
import { getMemberSince, getMessagingId, getCxIndex } from './MetadataRedux';
import { initializeSession, getSessionPeer } from './SessionRedux';
import {
  startMessaging,
  stopMessaging,
  devicesLost,
  devicesConnected
} from '../Services/Messaging';
import { makeAvailable, makeUnavailable, peers } from '../Services/Peering';
import {
  sessionInvites,
  sessionCancels,
  sessionAccepts,
  sessionRejects,
  sendSessionInvite,
  cancelSessionInvite,
  acceptSessionInvite,
  rejectSessionInvite
} from '../Services/Sessions';
import { eventHandler } from '../Utils';
import { logCustom, ANALYTICS_EVENT } from '../Services/Analytics';

const getSenderUUID = message => message.senderUUID;

function* startSession({ senderUUID, seed }) {
  const userId = yield select(getMessagingId);
  const cxIndex = yield select(getCxIndex);
  logCustom({
    event: ANALYTICS_EVENT.INVITE_PEER,
    context: {
      peerID: senderUUID,
      cxIndex,
      success: true
    }
  });
  yield put(initializeSession({ peerId: senderUUID, seed, userId }));
}

function* handleRejections({ senderUUID }) {
  const cxIndex = yield select(getCxIndex);
  logCustom({
    event: ANALYTICS_EVENT.INVITE_PEER,
    context: {
      peerID: senderUUID,
      cxIndex,
      success: false
    }
  });
}

function* onDeviceConnected(peerInfo) {
  // send peer dtected to to analytics
  const cxIndex = yield select(getCxIndex);
  const { uuid } = peerInfo;
  logCustom({
    event: ANALYTICS_EVENT.DETECT_PEER,
    context: {
      peerID: uuid,
      cxIndex
    }
  });
  yield true;
}

function* checkForDroppedPeers({ uuid }) {
  // Check outgoing session invite
  const currentInvitee = yield select(getCurrentSessionInvitee);
  if (currentInvitee === uuid) {
    yield put(setCurrentInviteeRejectedSession(true));
  }

  // Check incoming session invites
  const inviteIds = yield select(getSessionInvites);
  if (inviteIds.includes(uuid)) {
    yield put(removeSessionInvite(uuid));
  }

  // Check active session
  const sessionPeer = yield select(getSessionPeer);
  if (sessionPeer && sessionPeer.uuid === uuid) {
    yield put(setSessionWasLost(true));
  }
}

function* matchesCurrentSessionInvitee({ senderUUID }) {
  const currentInvitee = yield select(getCurrentSessionInvitee);
  return currentInvitee === senderUUID;
}

const handlePeers = eventHandler({
  events: peers,
  action: setAvailablePeers,
  onCancel: function* cancelPeers() {
    yield put(setAvailablePeers([]));
  }
});
const handleSessionInvites = eventHandler({
  events: sessionInvites,
  action: addSessionInvite,
  parseEvent: getSenderUUID,
  onCancel: function* cancelSessionInvites() {
    for (const peerId of yield select(getSessionInvites)) {
      yield put(removeSessionInvite(peerId));
    }
  }
});
const handleSessionCancels = eventHandler({
  events: sessionCancels,
  action: removeSessionInvite,
  parseEvent: getSenderUUID
});
const handleSessionAccepts = eventHandler({
  events: sessionAccepts,
  effect: startSession,
  isValid: matchesCurrentSessionInvitee
});
const handleSessionRejects = eventHandler({
  events: sessionRejects,
  effect: handleRejections,
  action: setCurrentInviteeRejectedSession,
  parseEvent: stubTrue,
  isValid: matchesCurrentSessionInvitee
});

const handleDevicesConnected = eventHandler({
  events: devicesConnected,
  effect: onDeviceConnected
});
const handleDevicesLost = eventHandler({
  events: devicesLost,
  effect: checkForDroppedPeers
});

export function* updateScanning() {
  try {
    while (true) {
      let { isScanning } = yield take(SET_IS_SCANNING);

      if (isScanning) {
        yield startMessaging();
        const peerTask = yield fork(handlePeers);
        const devicesLostTask = yield fork(handleDevicesLost);
        const deviceConnectedTask = yield fork(handleDevicesConnected);

        while (isScanning) {
          ({ isScanning } = yield take(SET_IS_SCANNING));
        }

        yield put(setIsAvailable(false));
        yield cancel(devicesLostTask);
        yield cancel(deviceConnectedTask);
        yield cancel(peerTask);
        yield stopMessaging();
      }
    }
  } finally {
    yield stopMessaging();
  }
}

export function* updateAvailability() {
  while (true) {
    let { isAvailable } = yield take(SET_IS_AVAILABLE);

    if (isAvailable) {
      const username = yield select(getUsername);
      const memberSince = yield select(getMemberSince);
      const contentDate = yield select(getContentDate);
      const userId = yield select(getMessagingId);

      yield makeAvailable({ uuid: userId, username, memberSince, contentDate });

      const invitesTask = yield fork(handleSessionInvites);
      const cancelsTask = yield fork(handleSessionCancels);
      const acceptsTask = yield fork(handleSessionAccepts);
      const rejectsTask = yield fork(handleSessionRejects);

      while (isAvailable) {
        ({ isAvailable } = yield take(SET_IS_AVAILABLE));
      }

      yield cancel(rejectsTask);
      yield cancel(acceptsTask);
      yield cancel(cancelsTask);
      yield cancel(invitesTask);

      yield put(clearCurrentSessionInvitee(null));
      // Due to a possible race condition with stopping messaging,
      // we won't wait for the unavailable profile messages to send
      makeUnavailable();
    }
  }
}

export function* dispatchSessionInvite({ peerId }) {
  const cxIndex = yield select(getCxIndex);
  logCustom({
    event: ANALYTICS_EVENT.DETECT_PEER,
    context: {
      peerID: peerId,
      cxIndex
    }
  });

  yield call(sendSessionInvite, peerId);
}
export function* dispatchSessionCancel({ peerId }) {
  // Triggered as a side-effect of clearing current invitee, which
  // optionally takes a peer id if the user triggered the cancel
  if (peerId) {
    yield call(cancelSessionInvite, peerId);
  }
}
export function* dispatchSessionAccept({ peerId }) {
  const seed = Math.floor(Math.random() * 2 ** 31);

  const userId = yield select(getMessagingId);
  yield call(acceptSessionInvite, peerId, seed);
  yield put(initializeSession({ peerId, userId, seed }));
}
export function* dispatchSessionReject({ peerId }) {
  yield call(rejectSessionInvite, peerId);
}
