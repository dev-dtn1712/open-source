import { put, select, delay } from 'redux-saga/effects';
import { NavigationActions } from 'react-navigation';
import { getUserId, getCurrentUser } from './AuthRedux';
import { setMemberSince } from './MetadataRedux';
import { setBirthDateResponse, setGenderResponse } from './ResponsesRedux';

export function* completeRegistration() {
  yield delay(1500);
  const { updatedAt } = yield select(getCurrentUser);

  const updatedDate = new Date(updatedAt);
  const year = updatedDate.getFullYear();

  yield put(setMemberSince(year));

  yield put(NavigationActions.navigate({ routeName: 'IntentsIntro' }));
}

export function* setProfileBirtDate(action) {
  const userId = yield select(getUserId);

  if (!userId) {
    yield put(NavigationActions.navigate({ routeName: 'RegistrationGender' }));
    return;
  }

  const { birthDate } = action;
  yield put(setBirthDateResponse(birthDate));
  yield put(
    NavigationActions.navigate({ routeName: 'OnboardingEditRegister' })
  );
}

export function* setProfileGender(action) {
  const userId = yield select(getUserId);

  if (!userId) {
    yield put(NavigationActions.navigate({ routeName: 'RegistrationName' }));
    return;
  }

  const { gender } = action;
  yield put(setGenderResponse(gender));
  yield put(NavigationActions.navigate({ routeName: 'RegistrationComplete' }));
}
