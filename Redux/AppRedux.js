import { createReducer, createActions } from 'reduxsauce';

/* ------- Initial State --------- */
export const INITIAL_STATE = {
  isOnboarded: false,
  isLoadingContent: false
};

/* ------- Selectors --------- */
export const getIsOnboarded = state => state.app.isOnboarded;
export const getIsLoadingContent = state => state.app.isLoadingContent;

/* ------- Actions --------- */
const { Types, Creators } = createActions({
  startup: null,
  startUserSession: ['user', 'session'],
  startAnonymousSession: null,
  setIsLoadingContent: ['isLoadingContent']
});

export const {
  STARTUP,
  START_USER_SESSION,
  START_ANONYMOUS_SESSION,
  SET_IS_LOADING_CONTENT
} = Types;
export const {
  startup,
  startUserSession,
  startAnonymousSession,
  setIsLoadingContent
} = Creators;

/* -------- Reducers ---------- */
const reduceIsOnboarded = state => ({
  ...state,
  isOnboarded: true
});

const reduceSetIsLoadingContent = (state, { isLoadingContent }) => ({
  ...state,
  isLoadingContent
});

/* -------- Hookup Reducers to Types -------- */
export const reducer = createReducer(INITIAL_STATE, {
  [START_USER_SESSION]: reduceIsOnboarded,
  [SET_IS_LOADING_CONTENT]: reduceSetIsLoadingContent
});

export default reducer;
