import { createReducer, createActions } from 'reduxsauce';

const { Types, Creators } = createActions({
  setProfileSettingsLoading: ['isLoading'],
  setProfileSettingsError: ['error'],
  setChangeUsernameRequest: ['username'],
  setChangeEmailRequest: ['email'],
  setDeleteUserRequest: null
});

/* ------- Initial State --------- */
export const INITIAL_STATE = {
  error: null,
  isLoading: false
};

// Types and Actions
export const {
  SET_PROFILE_SETTINGS_LOADING,
  SET_PROFILE_SETTINGS_ERROR,
  SET_CHANGE_USERNAME_REQUEST,
  SET_CHANGE_EMAIL_REQUEST,
  SET_DELETE_USER_REQUEST
} = Types;
export const {
  setProfileSettingsError,
  setProfileSettingsLoading,
  setChangeUsernameRequest,
  setChangeEmailRequest,
  setDeleteUserRequest
} = Creators;

/* ------- Selectors --------- */
export const getProfileSettingsError = state => state.profileSettings.error;
export const getProfileSettingsLoading = state =>
  state.profileSettings.isLoading;

/* -------- Reducers ---------- */
export const reduceSetProfileSettingsError = (state, { error }) => ({
  ...state,
  error
});

export const reduceSetProfileSettingsLoading = (state, { isLoading }) => ({
  ...state,
  isLoading
});

export const reduceResetError = state => ({
  ...state,
  error: null
});

/* -------- Hookup Reducers to Types -------- */
export const reducer = createReducer(INITIAL_STATE, {
  [SET_PROFILE_SETTINGS_LOADING]: reduceSetProfileSettingsLoading,
  [SET_PROFILE_SETTINGS_ERROR]: reduceSetProfileSettingsError
});

export default reducer;
