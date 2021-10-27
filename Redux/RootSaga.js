import { all, takeLatest, fork } from 'redux-saga/effects';
import {
  STARTUP,
  START_ANONYMOUS_SESSION,
  START_USER_SESSION
} from './AppRedux';
import {
  REMOVE_SESSION_INVITE,
  SELECT_SESSION_INVITE,
  SET_CURRENT_SESSION_INVITEE,
  CLEAR_CURRENT_SESSION_INVITEE,
  SET_SESSION_WAS_LOST
} from './ConnectionRedux';
import {
  SELECT_INTENTS_TO_SHARE,
  SET_SESSION_PEER_DATA,
  SET_SESSION_USER_DATA,
  SET_ALIGNED_INTENTS,
  CLEAR_INCOMING_COMPARE_INVITE,
  SELECT_INCOMING_COMPARE_INVITE,
  SET_OUTGOING_COMPARE_INVITE,
  CLEAR_OUTGOING_COMPARE_INVITE,
  SET_IS_USER_TURN
} from './SessionRedux';
import { startup, startupAnonymous, startupUser } from './AppSaga';
import {
  SET_SIGNUP_REQUEST,
  SET_LOGIN_REQUEST,
  SET_LOGOUT_REQUEST,
  SET_FORGOT_REQUEST
} from './AuthRedux';
import { signup, login, logout, forgotPassword } from './AuthSaga';
import {
  updateScanning,
  updateAvailability,
  dispatchSessionInvite,
  dispatchSessionCancel,
  dispatchSessionAccept,
  dispatchSessionReject
} from './ConnectionSaga';
import {
  updateSession,
  alignSessionData,
  navigateOnAlignment,
  handleSessionLost,
  dispatchPrivateData,
  dispatchCompareInvite,
  dispatchCompareCancel,
  dispatchCompareAccept,
  dispatchCompareReject,
  dispatchSwipeNext
} from './SessionSaga';
import {
  SET_SIGNUP_BIRTH_DATE,
  SET_SIGNUP_GENDER,
  SET_SIGNUP_COMPLETE
} from './SignupRedux';
import {
  completeRegistration,
  setProfileBirtDate,
  setProfileGender
} from './SignupSaga';
import {
  SET_CHANGE_USERNAME_REQUEST,
  SET_CHANGE_EMAIL_REQUEST,
  SET_DELETE_USER_REQUEST
} from './ProfileSettingsRedux';
import {
  setChangeUsername,
  setChangeEmail,
  setDeleteUser
} from './ProfileSettingsSaga';
import { contentMetaRoot } from './ContentMetaSaga';

export default function* root() {
  yield all([
    takeLatest(STARTUP, startup),
    takeLatest(START_ANONYMOUS_SESSION, startupAnonymous),
    takeLatest(START_USER_SESSION, startupUser),
    takeLatest(SET_SIGNUP_REQUEST, signup),
    takeLatest(SET_LOGIN_REQUEST, login),
    takeLatest(SET_LOGOUT_REQUEST, logout),
    takeLatest(SET_FORGOT_REQUEST, forgotPassword),
    takeLatest(REMOVE_SESSION_INVITE, dispatchSessionReject),
    takeLatest(SELECT_SESSION_INVITE, dispatchSessionAccept),
    takeLatest(SET_CURRENT_SESSION_INVITEE, dispatchSessionInvite),
    takeLatest(CLEAR_CURRENT_SESSION_INVITEE, dispatchSessionCancel),
    takeLatest(SELECT_INTENTS_TO_SHARE, dispatchPrivateData),
    takeLatest(SET_SESSION_PEER_DATA, alignSessionData),
    takeLatest(SET_SESSION_USER_DATA, alignSessionData),
    takeLatest(SET_ALIGNED_INTENTS, navigateOnAlignment),
    takeLatest(CLEAR_INCOMING_COMPARE_INVITE, dispatchCompareReject),
    takeLatest(SELECT_INCOMING_COMPARE_INVITE, dispatchCompareAccept),
    takeLatest(SET_OUTGOING_COMPARE_INVITE, dispatchCompareInvite),
    takeLatest(CLEAR_OUTGOING_COMPARE_INVITE, dispatchCompareCancel),
    takeLatest(SET_IS_USER_TURN, dispatchSwipeNext),
    takeLatest(SET_SESSION_WAS_LOST, handleSessionLost),
    takeLatest(SET_SIGNUP_BIRTH_DATE, setProfileBirtDate),
    takeLatest(SET_SIGNUP_GENDER, setProfileGender),
    takeLatest(SET_SIGNUP_COMPLETE, completeRegistration),
    takeLatest(SET_CHANGE_USERNAME_REQUEST, setChangeUsername),
    takeLatest(SET_CHANGE_EMAIL_REQUEST, setChangeEmail),
    takeLatest(SET_DELETE_USER_REQUEST, setDeleteUser),
    fork(contentMetaRoot),
    fork(updateScanning),
    fork(updateAvailability),
    fork(updateSession)
  ]);
}
