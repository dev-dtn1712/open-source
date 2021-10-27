import { get } from 'lodash';
import { createReducer, createActions } from 'reduxsauce';
import { initSynchronizedRandomizer } from '../Services/SessionHelper';

/* ------- Initial State --------- */
const INITIAL_STATE = {
  peer: null,
  peerData: null,
  userData: null,
  alignedIntents: [],
  incomingCompareInvite: null,
  outgoingCompareInvite: null,
  outgoingCompareInviteRejected: false,
  isUserTurn: false,
  seed: 0
};

/* ------- Selectors --------- */
export const getSessionPeer = state => state.session.peer;
export const getSessionPeerId = state => get(state.session.peer, 'uuid', null);
export const getSessionPeerData = state => state.session.peerData;
export const getSessionUserData = state => state.session.userData;
export const getAlignedIntents = state => state.session.alignedIntents;
export const getIncomingCompareInvite = state =>
  state.session.incomingCompareInvite;
export const getOutgoingCompareInvite = state =>
  state.session.outgoingCompareInvite;
export const getOutgoingCompareInviteRejected = state =>
  state.session.outgoingCompareInviteRejected;
export const getIsUserTurn = state => state.session.isUserTurn;
export const getSessionSeed = state => state.session.seed;

const { Types, Creators } = createActions({
  initializeSession: ['sessionConfig'],
  resetSession: null,
  setSessionPeer: ['peer'],
  selectIntentsToShare: ['intentIds'],
  setSessionPeerData: ['sessionData'],
  setSessionUserData: ['sessionData'],
  setAlignedIntents: ['alignedIntents'],
  setIncomingCompareInvite: ['compareInvite'],
  clearIncomingCompareInvite: ['compareInvite'],
  selectIncomingCompareInvite: ['compareInvite'],
  setOutgoingCompareInvite: ['compareInvite'],
  clearOutgoingCompareInvite: ['compareInvite'],
  setOutgoingCompareInviteRejected: ['isRejected'],
  setIsUserTurn: ['isUserTurn']
});

/* ------- Types and Actions --------- */
export const {
  INITIALIZE_SESSION,
  RESET_SESSION,
  SET_SESSION_PEER,
  SELECT_INTENTS_TO_SHARE,
  SET_SESSION_PEER_DATA,
  SET_SESSION_USER_DATA,
  SET_ALIGNED_INTENTS,
  SET_INCOMING_COMPARE_INVITE,
  CLEAR_INCOMING_COMPARE_INVITE,
  SELECT_INCOMING_COMPARE_INVITE,
  SET_OUTGOING_COMPARE_INVITE,
  CLEAR_OUTGOING_COMPARE_INVITE,
  SET_OUTGOING_COMPARE_INVITE_REJECTED,
  SET_IS_USER_TURN
} = Types;
export const {
  initializeSession,
  resetSession,
  setSessionPeer,
  selectIntentsToShare,
  setSessionPeerData,
  setSessionUserData,
  setAlignedIntents,
  setIncomingCompareInvite,
  clearIncomingCompareInvite,
  selectIncomingCompareInvite,
  setOutgoingCompareInvite,
  clearOutgoingCompareInvite,
  setOutgoingCompareInviteRejected,
  setIsUserTurn
} = Creators;

/* -------- Reducers ---------- */
// If passed null, changes to state will happen via Saga-based side-effects
const reduceInitializeSession = (state, { sessionConfig }) => {
  if (!sessionConfig) {
    return state;
  }

  const { peerId, seed, userId } = sessionConfig;

  const synchronizedRandomizer = initSynchronizedRandomizer(seed);
  const randBool = synchronizedRandomizer(2) === 0;
  const isUserTurn = randBool !== userId < peerId;

  return {
    ...state,
    peer: {
      uuid: peerId
    },
    seed,
    isUserTurn
  };
};

// Do not resetSession directly, will be called in the SessionSaga
const reduceResetSession = () => INITIAL_STATE;

const reduceSetSessionPeer = (state, { peer }) => ({
  ...state,
  peer
});

const sessionDataReducer = key => (state, { sessionData }) => ({
  ...state,
  [key]: sessionData
});

const reduceSetPeerSessionData = sessionDataReducer('peerData');
const reduceSetUserSessionData = sessionDataReducer('userData');

const reduceSetAlignedIntents = (state, { alignedIntents }) => ({
  ...state,
  alignedIntents
});

const setInviteReducer = key => (state, { compareInvite }) => {
  const { intentId, isForUnaligned = false } = compareInvite;
  return {
    ...state,
    [key]: {
      intentId,
      isForUnaligned
    }
  };
};
const clearInviteReducer = key => state => ({
  ...state,
  [key]: null
});

const reduceSetIncomingCompareInvite = setInviteReducer(
  'incomingCompareInvite'
);
const reduceClearIncomingCompareInvite = clearInviteReducer(
  'incomingCompareInvite'
);
const reduceSetOutgoingCompareInvite = setInviteReducer(
  'outgoingCompareInvite'
);
const reduceClearOutgoingCompareInvite = clearInviteReducer(
  'outgoingCompareInvite'
);

const reduceSetOutgoingCompareInviteRejected = (state, { isRejected }) => {
  const clearedState = isRejected
    ? reduceClearOutgoingCompareInvite(state, clearOutgoingCompareInvite())
    : state;

  return {
    ...clearedState,
    outgoingCompareInviteRejected: isRejected
  };
};

const reduceSetIsUserTurn = (state, { isUserTurn }) => ({
  ...state,
  isUserTurn
});

/* -------- Hookup Reducers to Types -------- */
export const reducer = createReducer(INITIAL_STATE, {
  [INITIALIZE_SESSION]: reduceInitializeSession,
  [RESET_SESSION]: reduceResetSession,
  [SET_SESSION_PEER]: reduceSetSessionPeer,
  [SET_SESSION_PEER_DATA]: reduceSetPeerSessionData,
  [SET_SESSION_USER_DATA]: reduceSetUserSessionData,
  [SET_ALIGNED_INTENTS]: reduceSetAlignedIntents,
  [SET_INCOMING_COMPARE_INVITE]: reduceSetIncomingCompareInvite,
  [CLEAR_INCOMING_COMPARE_INVITE]: reduceClearIncomingCompareInvite,
  [SET_OUTGOING_COMPARE_INVITE]: reduceSetOutgoingCompareInvite,
  [CLEAR_OUTGOING_COMPARE_INVITE]: reduceClearOutgoingCompareInvite,
  [SET_OUTGOING_COMPARE_INVITE_REJECTED]: reduceSetOutgoingCompareInviteRejected,
  [SET_IS_USER_TURN]: reduceSetIsUserTurn
});

export default reducer;
