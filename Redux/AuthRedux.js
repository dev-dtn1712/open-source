import { createReducer, createActions } from 'reduxsauce';
import get from 'lodash/get';

const { Types, Creators } = createActions({
  setLoginRequest: ['data'],
  setForgotRequest: ['data'],
  setLogoutRequest: ['options'],
  setSignupRequest: ['data'],
  setAuthError: ['error'],
  setAuthLoading: ['isLoading'],
  setActiveUser: ['user'],
  setAppOutdated: ['isOutdated']
});

/* ------- Initial State --------- */
export const INITIAL_STATE = {
  error: null,
  isLoading: false,
  currentUser: null,
  isAppOutdated: false
};

// Types and Actions
export const {
  SET_APP_OUTDATED,
  SET_ACTIVE_USER,
  SET_AUTH_LOADING,
  SET_AUTH_ERROR,
  SET_LOGIN_REQUEST,
  SET_FORGOT_REQUEST,
  SET_LOGOUT_REQUEST,
  SET_SIGNUP_REQUEST
} = Types;
export const {
  setAppOutdated,
  setActiveUser,
  setLoginRequest,
  setForgotRequest,
  setLogoutRequest,
  setSignupRequest,
  setAuthError,
  setAuthLoading
} = Creators;

/* ------- Selectors --------- */
export const getAuthInfo = state => state.auth;
export const getAuthError = state => state.auth.error;
export const getAuthLoading = state => state.auth.isLoading;
export const getAppOutdated = state => state.auth.isAppOutdated;
export const getUserUUID = state => get(state, 'auth.currentUser.id', '');
export const getUserId = state => get(state, 'auth.currentUser.userId', '');
export const getCurrentUser = state => state.auth.currentUser;
export const getUsername = state => get(state, 'auth.currentUser.username', '');
export const getUserEmail = state => get(state, 'auth.currentUser.email', '');

/* -------- Reducers ---------- */
export const reduceSetAuthError = (state, { error }) => ({
  ...state,
  error
});

export const reduceSetAuthLoading = (state, { isLoading }) => ({
  ...state,
  isLoading
});

export const reduceResetError = state => ({
  ...state,
  error: null
});

export const reduceSetActiveUser = (state, { user }) => ({
  ...state,
  currentUser: user
});

export const reduceSetAppOutdated = (state, { isOutdated }) => ({
  ...state,
  isAppOutdated: isOutdated
});

/* -------- Hookup Reducers to Types -------- */
export const reducer = createReducer(INITIAL_STATE, {
  [SET_AUTH_LOADING]: reduceSetAuthLoading,
  [SET_AUTH_ERROR]: reduceSetAuthError,
  [SET_SIGNUP_REQUEST]: reduceResetError,
  [SET_LOGIN_REQUEST]: reduceResetError,
  [SET_FORGOT_REQUEST]: reduceResetError,
  [SET_ACTIVE_USER]: reduceSetActiveUser,
  [SET_APP_OUTDATED]: reduceSetAppOutdated
});

export default reducer;
