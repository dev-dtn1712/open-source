import { put, select, call } from 'redux-saga/effects';
import {
  getUserUUID,
  getCurrentUser,
  setActiveUser,
  setLogoutRequest
} from './AuthRedux';
import {
  setProfileSettingsLoading,
  setProfileSettingsError
} from './ProfileSettingsRedux';
import {
  updateUsername,
  updateUserEmail,
  deleteUser
} from '../Services/UserService';
import { logger } from '../Utils';

export function* setChangeUsername(action) {
  yield put(setProfileSettingsLoading(true));
  const user = yield select(getCurrentUser);
  const { username } = action;
  const { id: uuid } = user;
  try {
    yield call(updateUsername, { uuid, username });
    yield put(
      setActiveUser({
        ...user,
        username
      })
    );
  } catch (err) {
    yield put(setProfileSettingsError(err));
  }
  yield put(setProfileSettingsLoading(false));
}

export function* setChangeEmail(action) {
  yield put(setProfileSettingsLoading(true));
  const user = yield select(getCurrentUser);
  const { email } = action;
  const { id: uuid } = user;
  try {
    yield call(updateUserEmail, { uuid, email });
    yield put(
      setActiveUser({
        ...user,
        email
      })
    );
  } catch (err) {
    yield put(setProfileSettingsError(err));
  }
  yield put(setProfileSettingsLoading(false));
}

export function* setDeleteUser() {
  yield put(setProfileSettingsLoading(true));
  const uuid = yield select(getUserUUID);
  try {
    yield call(deleteUser, { uuid });
    yield put(setLogoutRequest({ isReset: true }));
  } catch (err) {
    logger.log(err);
  }

  yield put(setProfileSettingsLoading(false));
}
