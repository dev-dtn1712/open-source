import { put, call, delay, select, spawn } from 'redux-saga/effects';
import { NavigationActions } from 'react-navigation';
import { getVersion } from 'react-native-device-info';
import {
  startUserSession,
  startAnonymousSession,
  setIsLoadingContent
} from './AppRedux';
import {
  setActiveUser,
  setAppOutdated,
  setAuthLoading,
  setLogoutRequest
} from './AuthRedux';
import { setContentMeta, getMinVersion } from './ContentMetaRedux';
import { setMetadata, setMessagingId } from './MetadataRedux';
import {
  setResponses,
  setBirthDateResponse,
  setGenderResponse,
  getGender
} from './ResponsesRedux';
import {
  open,
  authorize,
  getAuthorization,
  getContentMeta,
  getContentSet,
  setContentSet,
  getMetadata,
  getResponses
} from '../Storage';
import { isRetriableError } from '../Services/Api';
import { AUTH0_ERROR_CODES } from '../Services/AuthService';
import {
  ANALYTICS_CONTENT_SCREEN,
  logContent,
  setUserId
} from '../Services/Analytics';
import { getSecrets } from '../Services/MetaService';
import { setApiKey } from '../Services/CloudinaryService';
import {
  getAllContentsFromJSON,
  getContentMetaFromJSON
} from '../Services/ContentService';
import { indexTemplates, setTemplates } from '../Services/TemplatesService';
import { setMessagingKey, setupMessaging } from '../Services/Messaging';
import { logger } from '../Utils';

const MININUM_STARTUP_TIME = 1200;
let startTime;

function* waitForMinimumStartupTime() {
  if (startTime) {
    const loadTime = Date.now() - startTime;

    if (loadTime < MININUM_STARTUP_TIME) {
      yield delay(MININUM_STARTUP_TIME - loadTime);
    }
  }
}

function* handleMessagingSetup(userUuid) {
  yield call(setupMessaging);
  yield put(setMessagingId(userUuid));
}

function* populateMainContentFromJSON() {
  yield put(setIsLoadingContent(true));
  const content = getAllContentsFromJSON();
  const indexed = indexTemplates(content);
  setContentSet({ data: indexed });
  setTemplates(indexed);
  yield put(setIsLoadingContent(false));
}

function* populateContentFromJSON() {
  const meta = getContentMetaFromJSON();
  yield put(setContentMeta(meta));
  yield spawn(populateMainContentFromJSON);
}

// process STARTUP actions
export function* startup() {
  startTime = Date.now();

  yield call(open);

  logContent({ screen: ANALYTICS_CONTENT_SCREEN.LOADER });

  // Load content from storage or JSON fallback
  const storedContentSet = getContentSet();

  if (!storedContentSet) {
    yield call(populateContentFromJSON);
  } else {
    const { data, parserVersion } = storedContentSet;

    if (!parserVersion || parserVersion === 1) {
      // Parser v1 includes a bug and must be re-indexed from the JSON
      yield call(populateContentFromJSON);
    } else {
      setTemplates(data);
      const contentMeta = getContentMeta();
      yield put(setContentMeta(contentMeta));
    }
  }

  // Check app version
  const minVersion = yield select(getMinVersion);
  const curVersion = getVersion();
  const isAppOutdated = Number(curVersion) < Number(minVersion);
  yield put(setAppOutdated(isAppOutdated));

  if (isAppOutdated) {
    yield put(setAuthLoading(false));
    return;
  }

  // Check authorization
  const authorization = getAuthorization();
  if (authorization) {
    yield put(startUserSession(authorization));
  } else {
    yield put(startAnonymousSession());
  }
}

export function* startupUser(action) {
  yield put(setAuthLoading(true));

  const { user, session } = action;
  try {
    const { userId } = user;
    setUserId(userId);
  } catch (err) {
    logger.error(err);
  }

  yield put(setActiveUser(user));

  /* ------- Retrieve secrets & keys --------- */
  let secrets;

  try {
    secrets = yield call(getSecrets);
  } catch (err) {
    if (isRetriableError(err) || err.code === AUTH0_ERROR_CODES.TOKEN_INVALID) {
      yield put(setLogoutRequest());
      logger.warn(err);
      return;
    }

    logger.error(err);
  }

  const { messagingKey, cloudinaryApiKey, encryptionSecret } = secrets;
  setApiKey(cloudinaryApiKey);
  setMessagingKey(messagingKey);

  try {
    yield call(authorize, {
      ...user,
      secret: encryptionSecret
    });
  } catch (err) {
    logger.error(err);
  }

  yield spawn(handleMessagingSetup, user.userId);

  /* ------- Update Metadata Redux store --------- */
  const storedMetadata = getMetadata();
  yield put(setMetadata(storedMetadata));

  /* ------- Update Responses Redux store --------- */
  const storedResponses = getResponses();
  yield put(setResponses(storedResponses));

  const { birthDate, gender } = session || {};
  if (birthDate) {
    yield put(setBirthDateResponse(birthDate));
  }
  if (gender) {
    yield put(setGenderResponse(gender));
  }

  const storedGender = yield select(getGender);
  const { memberSince } = storedMetadata || {};

  yield waitForMinimumStartupTime();
  yield put(setAuthLoading(false));

  if (memberSince) {
    yield put(NavigationActions.navigate({ routeName: 'App' }));
  } else if (storedGender) {
    yield put(
      NavigationActions.navigate({ routeName: 'RegistrationComplete' })
    );
  } else {
    yield put(NavigationActions.navigate({ routeName: 'OnboardingEdit' }));
  }
}

export function* startupAnonymous() {
  yield put(setAuthLoading(true));
  yield put(setActiveUser(null));

  yield waitForMinimumStartupTime();
  yield put(setAuthLoading(false));

  yield put(NavigationActions.navigate({ routeName: 'Onboarding' }));
}
