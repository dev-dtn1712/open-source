import { get, omit, cloneDeep } from 'lodash';
import { createReducer, createActions } from 'reduxsauce';

import { SET_LOGOUT_REQUEST } from './AuthRedux';

const INITIAL_STATE = {};

export const USERNAME_RESPONSE_ID = '2201be18-e6d7-4392-9658-0eb9d595d9b0';
export const BIRTH_DATE_RESPONSE_ID = '9dc9bb64-4b97-45a4-9d3a-ca84728ef6ea';
export const GENDER_RESPONSE_IDS = [
  'd7b5e569-9d84-49a9-9638-3cb436d18be8',
  '1d4388db-1beb-4b73-9fee-a7cd56c7c579',
  '0ae8634a-b6d7-461d-824b-3ee9baf2df7b',
  '1886a255-cc6c-4b25-b08d-e2bb54cd65e2',
  '2711cbf4-6fa2-44a3-bc5e-fd21e92a90ba'
];

// Selectors
export const getResponses = ({ responses }) => responses;
export const getResponseValues = ({ responses }) => Object.values(responses);

export const responseSelector = uuid => ({ responses }) => responses[uuid];

const textSelector = uuid => state =>
  get(responseSelector(uuid)(state), 'text', '');

export const getBirthDate = textSelector(BIRTH_DATE_RESPONSE_ID);
export const getGender = state =>
  GENDER_RESPONSE_IDS.find(uuid => responseSelector(uuid)(state)) || '';

const { Types, Creators } = createActions({
  setResponse: ['uuidOrResponse'],
  setResponses: ['uuidsOrResponses'],
  clearResponse: ['uuid'],
  clearResponses: ['uuids'],
  batchUpdateResponses: ['uuidsToClear', 'uuidsOrResponsesToSet'],
  setBirthDateResponse: ['birthDate'],
  setGenderResponse: ['uuid']
});

// Types and Actions
export const {
  SET_RESPONSE,
  SET_RESPONSES,
  CLEAR_RESPONSE,
  CLEAR_RESPONSES,
  BATCH_UPDATE_RESPONSES,
  SET_BIRTH_DATE_RESPONSE,
  SET_GENDER_RESPONSE
} = Types;
export const {
  setResponse,
  setResponses,
  clearResponse,
  clearResponses,
  batchUpdateResponses,
  setBirthDateResponse,
  setGenderResponse
} = Creators;

const toResponse = uuidOrResponse => {
  const defaultProperties = { bias: 0, text: '' };

  if (typeof uuidOrResponse === 'object') {
    return { ...defaultProperties, ...uuidOrResponse };
  }

  return {
    ...defaultProperties,
    uuid: uuidOrResponse
  };
};

const reduceSetResponse = (state, { uuidOrResponse }) => {
  const response = toResponse(uuidOrResponse);

  return {
    ...state,
    [response.uuid]: response
  };
};
const reduceSetResponses = (state, { uuidsOrResponses }) => {
  const responses = uuidsOrResponses.map(toResponse);
  const updated = { ...state };

  for (const response of responses) {
    updated[response.uuid] = response;
  }

  return updated;
};

const reduceClearResponse = (state, { uuid }) => omit(state, uuid);
const reduceClearResponses = (state, { uuids }) => omit(state, uuids);

const reduceClearAllResponses = () => cloneDeep(INITIAL_STATE);

const reduceBatchUpdateResponses = (
  state,
  { uuidsToClear, uuidsOrResponsesToSet }
) => {
  const cleared = reduceClearResponses(state, clearResponses(uuidsToClear));
  return reduceSetResponses(cleared, setResponses(uuidsOrResponsesToSet));
};

const reduceSetBirthDateResponse = (state, { birthDate }) =>
  reduceSetResponse(
    state,
    setResponse({ uuid: BIRTH_DATE_RESPONSE_ID, text: birthDate })
  );
const reduceSetGenderResponse = (state, { uuid }) =>
  reduceBatchUpdateResponses(
    state,
    batchUpdateResponses(GENDER_RESPONSE_IDS, [uuid])
  );

const reducer = createReducer(INITIAL_STATE, {
  [SET_RESPONSE]: reduceSetResponse,
  [SET_RESPONSES]: reduceSetResponses,
  [CLEAR_RESPONSE]: reduceClearResponse,
  [CLEAR_RESPONSES]: reduceClearResponses,
  [SET_LOGOUT_REQUEST]: reduceClearAllResponses,
  [BATCH_UPDATE_RESPONSES]: reduceBatchUpdateResponses,
  [SET_BIRTH_DATE_RESPONSE]: reduceSetBirthDateResponse,
  [SET_GENDER_RESPONSE]: reduceSetGenderResponse
});

// Reducer
export default reducer;
