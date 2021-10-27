import { createReducer, createActions } from 'reduxsauce';

/* ------- Initial State --------- */
export const INITIAL_STATE = {
  isScanning: false,
  isAvailable: false,
  availablePeers: [],
  sessionInvites: [],
  currentSessionInvitee: null,
  currentInviteeRejectedSession: false,
  sessionWasLost: false
};

/* ------- Selectors --------- */
export const getConnection = state => state.connection;
export const getSessionInvites = state => state.connection.sessionInvites;
export const getCurrentSessionInvitee = state =>
  state.connection.currentSessionInvitee;
export const getCurrentInviteeRejectedSession = state =>
  state.connection.currentInviteeRejectedSession;
export const getSessionWasLost = state => state.connection.sessionWasLost;
export const getAvailablePeers = state => state.connection.availablePeers;

const { Types, Creators } = createActions({
  setIsScanning: ['isScanning'],
  setIsAvailable: ['isAvailable'],
  setAvailablePeers: ['peers'],
  addSessionInvite: ['peerId'],
  removeSessionInvite: ['peerId'],
  selectSessionInvite: ['peerId'],
  setCurrentSessionInvitee: ['peerId'],
  clearCurrentSessionInvitee: ['peerId'],
  setCurrentInviteeRejectedSession: ['isRejected'],
  setSessionWasLost: ['sessionWasLost']
});

/* ------- Types and Actions --------- */
export const {
  SET_IS_SCANNING,
  SET_IS_AVAILABLE,
  SET_AVAILABLE_PEERS,
  ADD_SESSION_INVITE,
  REMOVE_SESSION_INVITE,
  SELECT_SESSION_INVITE,
  SET_CURRENT_SESSION_INVITEE,
  CLEAR_CURRENT_SESSION_INVITEE,
  SET_CURRENT_INVITEE_REJECTED_SESSION,
  REMOVE_POTENTIAL_CONNECTION,
  SET_SESSION_WAS_LOST
} = Types;
export const {
  setIsScanning,
  setIsAvailable,
  setAvailablePeers,
  addSessionInvite,
  removeSessionInvite,
  selectSessionInvite,
  setCurrentSessionInvitee,
  clearCurrentSessionInvitee,
  setCurrentInviteeRejectedSession,
  setSessionWasLost
} = Creators;

/* -------- Reducers ---------- */
const reduceSetIsScanning = (state, { isScanning }) => ({
  ...state,
  isScanning
});
const reduceSetIsAvailable = (state, { isAvailable }) => ({
  ...state,
  isAvailable
});

const reduceSetAvailablePeers = (state, { peers }) => ({
  ...state,
  availablePeers: peers
});

const reduceAddSessionInvite = (state, { peerId }) => {
  const { sessionInvites } = state;
  if (sessionInvites.includes(peerId)) {
    return state;
  }

  return {
    ...state,
    sessionInvites: [...sessionInvites, peerId]
  };
};
const reduceRemoveSessionInvite = (state, { peerId }) => ({
  ...state,
  sessionInvites: state.sessionInvites.filter(id => id !== peerId)
});
const reduceSelectSessionInvite = state => ({
  ...state,
  sessionInvites: []
});

const reduceSetCurrentSessionInvitee = (state, { peerId }) => ({
  ...state,
  currentSessionInvitee: peerId
});
const reduceClearCurrentSessionInvitee = state => ({
  ...state,
  currentSessionInvitee: null
});
const reduceSetCurrentInviteeRejectedSession = (state, { isRejected }) => ({
  ...state,
  ...(isRejected ? { currentSessionInvitee: null } : {}),
  currentInviteeRejectedSession: isRejected
});

const reduceSetSessionWasLost = (state, { sessionWasLost }) => ({
  ...state,
  sessionWasLost
});

/* -------- Hookup Reducers to Types -------- */
export const reducer = createReducer(INITIAL_STATE, {
  [SET_IS_SCANNING]: reduceSetIsScanning,
  [SET_IS_AVAILABLE]: reduceSetIsAvailable,
  [SET_AVAILABLE_PEERS]: reduceSetAvailablePeers,
  [ADD_SESSION_INVITE]: reduceAddSessionInvite,
  [REMOVE_SESSION_INVITE]: reduceRemoveSessionInvite,
  [SELECT_SESSION_INVITE]: reduceSelectSessionInvite,
  [SET_CURRENT_SESSION_INVITEE]: reduceSetCurrentSessionInvitee,
  [CLEAR_CURRENT_SESSION_INVITEE]: reduceClearCurrentSessionInvitee,
  [SET_CURRENT_INVITEE_REJECTED_SESSION]: reduceSetCurrentInviteeRejectedSession,
  [SET_SESSION_WAS_LOST]: reduceSetSessionWasLost
});

export default reducer;
