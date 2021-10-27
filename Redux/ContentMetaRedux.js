import { createReducer, createActions } from 'reduxsauce';
import get from 'lodash/get';
import { toTimestamp } from '../Utils';

const { Types, Creators } = createActions({
  setContentMeta: ['contentMeta']
});

export const { SET_CONTENT_META } = Types;
export const { setContentMeta } = Creators;

/* ------- Initial State --------- */
export const INITIAL_STATE = {
  contentDate: '',
  updated: 0,
  uuid: '',
  meta: null
};

/* ------- Selectors --------- */
export const getMinVersion = state =>
  get(state, 'contentMeta.meta.minVersion.value');
export const getContentMetaTimestamp = state => state.contentMeta.updated;
export const getContentDate = state => state.contentMeta.contentDate;

/* -------- Reducers ---------- */
export const reduceSetContentMeta = (state, { contentMeta }) => {
  if (!contentMeta) {
    return state;
  }

  const { updated } = contentMeta;
  const contentDate =
    updated !== undefined ? { contentDate: toTimestamp(updated) } : {};

  return {
    ...state,
    ...contentDate,
    ...contentMeta
  };
};

/* -------- Hookup Reducers to Types -------- */
export const reducer = createReducer(INITIAL_STATE, {
  [SET_CONTENT_META]: reduceSetContentMeta
});

export default reducer;
