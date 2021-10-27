import { put, call } from 'redux-saga/effects';
import { NavigationActions } from 'react-navigation';
import { setLoginRequest, setAuthError, setAuthLoading } from './AuthRedux';
import { startUserSession, startAnonymousSession } from './AppRedux';
import {
  loginWithEmail,
  signUpWithEmail,
  resetPassword,
  AUTH0_ERROR_CODES
} from '../Services/AuthService';

import { deauthorize, deactivate } from '../Storage';

import {
  logSignup,
  logSignin,
  logCustom,
  ANLYTICS_AUTH_PROVIDER,
  ANALYTICS_EVENT
} from '../Services/Analytics';

function getRedirectSignupScreen({ code }) {
  switch (code) {
    case AUTH0_ERROR_CODES.EMAIL_EXISTS:
      return 'RegistrationEmail';
    case AUTH0_ERROR_CODES.USERNAME_EXISTS:
      return 'RegistrationName';
    case AUTH0_ERROR_CODES.PASSWORD_TOO_COMMON:
    case AUTH0_ERROR_CODES.PASSWORD_CONTAIN_USER_INFO:
    case AUTH0_ERROR_CODES.PASSWORD_STRENGTH:
      return '';
    default:
  }
  return 'RegistrationName';
}

// process STARTUP actions
export function* login(action) {
  yield put(setAuthLoading(true));
  const { data } = action;
  try {
    logSignin({ provider: ANLYTICS_AUTH_PROVIDER.DATABASE, success: true });
    const user = yield call(loginWithEmail, data);
    yield put(startUserSession(user, data));
  } catch (err) {
    logSignin({ provider: ANLYTICS_AUTH_PROVIDER.DATABASE, success: false });
    yield put(setAuthError(err));
    yield put(setAuthLoading(false));
  }
}

export function* signup(action) {
  yield put(setAuthLoading(true));
  const { data } = action;
  try {
    yield call(signUpWithEmail, data);
    logSignup({ provider: ANLYTICS_AUTH_PROVIDER.DATABASE, success: true });
    yield put(setLoginRequest(data));
  } catch (err) {
    logSignup({ provider: ANLYTICS_AUTH_PROVIDER.DATABASE, success: false });
    yield put(setAuthError(err));
    yield put(setAuthLoading(false));
    const redirectScreen = getRedirectSignupScreen(err);
    if (redirectScreen) {
      yield put(NavigationActions.navigate({ routeName: redirectScreen }));
    }
  }
}

export function* forgotPassword(action) {
  yield put(setAuthLoading(true));
  const { data } = action;
  logCustom({ event: ANALYTICS_EVENT.FORGOT_PASSWORD });
  try {
    yield call(resetPassword, data);
  } catch (err) {
    yield put(setAuthError(err));
  }
  yield put(setAuthLoading(false));
}

export function* logout(action) {
  const { options } = action;
  const { isReset } = options || {};

  logCustom({ event: ANALYTICS_EVENT.SIGNOUT });

  if (isReset) {
    deactivate();
  } else {
    deauthorize();
  }

  yield put(startAnonymousSession());
}
