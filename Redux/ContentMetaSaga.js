import {
  take,
  takeEvery,
  select,
  put,
  call,
  all,
  fork,
  cancelled,
  delay
} from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';

import { SET_ACTIVE_USER } from './AuthRedux';

import {
  setContentMeta,
  getContentMetaTimestamp,
  getContentDate
} from './ContentMetaRedux';
import { getContentSet, setContentSet } from '../Storage';
import {
  getContentMetaFromCAT,
  getAllContentsFromCAT
} from '../Services/ContentService';
import {
  indexTemplates,
  setTemplates,
  CURRENT_PARSER_VERSION
} from '../Services/TemplatesService';

let contentMetaChannel = null;

const FETCH_INTERVAL = 30 * 1000;

function createMetaChannel() {
  contentMetaChannel = eventChannel(emit => {
    const updater = async () => {
      const meta = await getContentMetaFromCAT();
      if (meta) {
        emit(meta);
      }
    };
    updater();
    const fetchTimer = setInterval(updater, FETCH_INTERVAL);
    return () => {
      clearInterval(fetchTimer);
    };
  });
  return contentMetaChannel;
}

function closeMetaChannel() {
  if (contentMetaChannel) {
    contentMetaChannel.close();
    contentMetaChannel = null;
  }
}

function* watchOnContentMeta() {
  const channel = createMetaChannel();
  while (true) {
    try {
      /* ------- Update Content Meta --------- */
      const contentMeta = yield take(channel);
      const { updated } = contentMeta;
      const currentTimestamp = yield select(getContentMetaTimestamp);
      if (currentTimestamp !== updated) {
        yield put(setContentMeta(contentMeta));
      }

      /* ------- Update Content Set --------- */
      const contentDate = yield select(getContentDate);
      const storedContentSet = getContentSet();
      const { contentDate: storedContentDate } = storedContentSet || {};

      if (contentDate !== storedContentDate) {
        const { uuid, contentSet } = yield call(getAllContentsFromCAT);
        const indexed = indexTemplates(contentSet);
        setTemplates(indexed);
        setContentSet({
          uuid,
          data: indexed,
          contentDate,
          parserVersion: CURRENT_PARSER_VERSION
        });
      }
    } finally {
      if (yield cancelled()) {
        closeMetaChannel();
      }
    }
  }
}

function* watchOnUseSession({ user }) {
  if (!user && contentMetaChannel) {
    closeMetaChannel();
  } else if (user && !contentMetaChannel) {
    yield delay(10);
    yield fork(watchOnContentMeta);
  }
}

export function* contentMetaRoot() {
  yield all([takeEvery(SET_ACTIVE_USER, watchOnUseSession)]);
}
