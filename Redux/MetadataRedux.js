import { createReducer, createActions } from 'reduxsauce';
import { cloneDeep } from 'lodash';
import { SET_LOGOUT_REQUEST } from './AuthRedux';

const INITIAL_STATE = {
  messagingId: '',
  cxIndex: 0,
  memberSince: 0,
  didShownDefineNeedsDialog: false,
  didShownDealMakersAbortDialog: false,
  didShownDealMakersUnlockDialog: false,
  didShownComparisonAbortDialog: false,
  didShownWhereYouAlignDialog: false,
  activatedIntents: new Set()
};

// Selectors
export const getMessagingId = state => state.metadata.messagingId;

export const getMemberSince = state => state.metadata.memberSince;

export const getCxIndex = state => state.metadata.cxIndex;

export const defineNeedsDialogShown = state =>
  state.metadata.didShownDefineNeedsDialog;
export const dealMakersAbortDialogShown = state =>
  state.metadata.didShownDealMakersAbortDialog;
export const dealMakersUnlockDialogShown = state =>
  state.metadata.didShownDealMakersUnlockDialog;
export const comparisonAbortDialogShown = state =>
  state.metadata.didShownComparisonAbortDialog;
export const whereYouAlignDialogShown = state =>
  state.metadata.didShownWhereYouAlignDialog;

export const getActivatedIntents = state => state.metadata.activatedIntents;
export const intentActivationVerifier = uuid => state =>
  state.metadata.activatedIntents.has(uuid);

const { Types, Creators } = createActions({
  setMetadata: ['metadata'],
  setMessagingId: ['messagingId'],
  setCxIndex: ['cxIndex'],
  setMemberSince: ['memberSince'],
  setDefineNeedsDialogShown: ['wasShown'],
  setDealMakersAbortDialogShown: ['wasShown'],
  setDealMakersUnlockDialogShown: ['wasShown'],
  setComparisonAbortDialogShown: ['wasShown'],
  setWhereYouAlignDialogShown: ['wasShown'],
  activateIntent: ['uuid'],
  deactivateIntent: ['uuid']
});

// Types and Actions
export const {
  SET_METADATA,
  SET_MESSAGING_ID,
  SET_CX_INDEX,
  SET_MEMBER_SINCE,
  SET_DEFINE_NEEDS_DIALOG_SHOWN,
  SET_DEAL_MAKERS_ABORT_DIALOG_SHOWN,
  SET_DEAL_MAKERS_UNLOCK_DIALOG_SHOWN,
  SET_COMPARISON_ABORT_DIALOG_SHOWN,
  SET_WHERE_YOU_ALIGN_DIALOG_SHOWN,
  ACTIVATE_INTENT,
  DEACTIVATE_INTENT
} = Types;
export const {
  setMetadata,
  setMessagingId,
  setCxIndex,
  setMemberSince,
  setDefineNeedsDialogShown,
  setDealMakersAbortDialogShown,
  setDealMakersUnlockDialogShown,
  setComparisonAbortDialogShown,
  setWhereYouAlignDialogShown,
  activateIntent,
  deactivateIntent
} = Creators;

const appendToSet = (set, item) => new Set([...set, item]);
const omitFromSet = (set, item) => new Set([...set].filter(i => i !== item));

const reduceSetMetadata = (state, { metadata }) => ({
  ...state,
  ...metadata,
  activatedIntents: new Set(metadata.activatedIntents)
});

const reduceClearMetadata = () => cloneDeep(INITIAL_STATE);

const reduceSetMessagingId = (state, { messagingId }) => ({
  ...state,
  messagingId
});

const reduceSetCxIndex = (state, { cxIndex }) => ({
  ...state,
  cxIndex
});

const reduceMemberSince = (state, { memberSince }) => ({
  ...state,
  memberSince
});

const reduceDefineNeedsDialogShown = (state, { wasShown }) => ({
  ...state,
  didShownDefineNeedsDialog: wasShown
});
const reduceDealMakersAbortDialogShown = (state, { wasShown }) => ({
  ...state,
  didShownDealMakersAbortDialog: wasShown
});
const reduceDealMakersUnlockDialogShown = (state, { wasShown }) => ({
  ...state,
  didShownDealMakersUnlockDialog: wasShown
});
const reduceComparisonAbortDialogShown = (state, { wasShown }) => ({
  ...state,
  didShownComparisonAbortDialog: wasShown
});
const reduceWhereYouAlignDialogShown = (state, { wasShown }) => ({
  ...state,
  didShownWhereYouAlignDialog: wasShown
});

const reduceActivateIntent = ({ activatedIntents, ...state }, { uuid }) => ({
  ...state,
  activatedIntents: appendToSet(activatedIntents, uuid)
});
const reduceDeactivateIntent = ({ activatedIntents, ...state }, { uuid }) => ({
  ...state,
  activatedIntents: omitFromSet(activatedIntents, uuid)
});

const reducer = createReducer(INITIAL_STATE, {
  [SET_METADATA]: reduceSetMetadata,
  [SET_LOGOUT_REQUEST]: reduceClearMetadata,
  [SET_MESSAGING_ID]: reduceSetMessagingId,
  [SET_CX_INDEX]: reduceSetCxIndex,
  [SET_MEMBER_SINCE]: reduceMemberSince,
  [SET_DEFINE_NEEDS_DIALOG_SHOWN]: reduceDefineNeedsDialogShown,
  [SET_DEAL_MAKERS_ABORT_DIALOG_SHOWN]: reduceDealMakersAbortDialogShown,
  [SET_DEAL_MAKERS_UNLOCK_DIALOG_SHOWN]: reduceDealMakersUnlockDialogShown,
  [SET_COMPARISON_ABORT_DIALOG_SHOWN]: reduceComparisonAbortDialogShown,
  [SET_WHERE_YOU_ALIGN_DIALOG_SHOWN]: reduceWhereYouAlignDialogShown,
  [ACTIVATE_INTENT]: reduceActivateIntent,
  [DEACTIVATE_INTENT]: reduceDeactivateIntent
});

// Reducer
export default reducer;
