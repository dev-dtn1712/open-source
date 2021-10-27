import {
  SET_METADATA,
  SET_CX_INDEX,
  ACTIVATE_INTENT,
  DEACTIVATE_INTENT,
  SET_MEMBER_SINCE,
  SET_DEFINE_NEEDS_DIALOG_SHOWN,
  SET_DEAL_MAKERS_ABORT_DIALOG_SHOWN,
  SET_DEAL_MAKERS_UNLOCK_DIALOG_SHOWN,
  SET_COMPARISON_ABORT_DIALOG_SHOWN,
  SET_WHERE_YOU_ALIGN_DIALOG_SHOWN
} from './MetadataRedux';
import {
  SET_RESPONSE,
  SET_RESPONSES,
  CLEAR_RESPONSE,
  CLEAR_RESPONSES,
  BATCH_UPDATE_RESPONSES,
  SET_BIRTH_DATE_RESPONSE,
  SET_GENDER_RESPONSE,
  BIRTH_DATE_RESPONSE_ID,
  GENDER_RESPONSE_IDS
} from './ResponsesRedux';
import { SET_ACTIVE_USER } from './AuthRedux';
import { SET_CONTENT_META } from './ContentMetaRedux';
import {
  authorize,
  deauthorize,
  setMetadata,
  setResponse,
  clearResponse,
  setResponses,
  clearResponses,
  batchUpdateResponses,
  setContentMeta
} from '../Storage';
import { setAuthHeader, clearAuthHeader } from '../Services/Api';

const parseMetadata = getState => {
  const { metadata } = getState();
  return {
    ...metadata,
    activatedIntents: [...metadata.activatedIntents]
  };
};

export const storeMetadataMiddleware = ({ getState }) => next => action => {
  const result = next(action);

  switch (action.type) {
    case SET_METADATA:
      setMetadata(parseMetadata(getState));
      break;
    case ACTIVATE_INTENT:
    case DEACTIVATE_INTENT: {
      const { activatedIntents } = parseMetadata(getState);
      setMetadata({ activatedIntents });
      break;
    }
    case SET_MEMBER_SINCE: {
      const { memberSince } = parseMetadata(getState);
      setMetadata({ memberSince });
      break;
    }
    case SET_CX_INDEX: {
      const { cxIndex } = parseMetadata(getState);
      setMetadata({ cxIndex });
      break;
    }
    case SET_DEFINE_NEEDS_DIALOG_SHOWN: {
      const { didShownDefineNeedsDialog } = parseMetadata(getState);
      setMetadata({ didShownDefineNeedsDialog });
      break;
    }
    case SET_DEAL_MAKERS_ABORT_DIALOG_SHOWN: {
      const { didShownDealMakersAbortDialog } = parseMetadata(getState);
      setMetadata({ didShownDealMakersAbortDialog });
      break;
    }
    case SET_DEAL_MAKERS_UNLOCK_DIALOG_SHOWN: {
      const { didShownDealMakersUnlockDialog } = parseMetadata(getState);
      setMetadata({ didShownDealMakersUnlockDialog });
      break;
    }
    case SET_WHERE_YOU_ALIGN_DIALOG_SHOWN: {
      const { didShownWhereYouAlignDialog } = parseMetadata(getState);
      setMetadata({ didShownWhereYouAlignDialog });
      break;
    }
    case SET_COMPARISON_ABORT_DIALOG_SHOWN: {
      const { didShownComparisonAbortDialog } = parseMetadata(getState);
      setMetadata({ didShownComparisonAbortDialog });
      break;
    }
    default:
  }

  return result;
};

export const storeResponsesMiddleware = () => next => action => {
  switch (action.type) {
    case SET_RESPONSE:
      setResponse(action.uuidOrResponse);
      break;
    case CLEAR_RESPONSE:
      clearResponse(action.uuid);
      break;
    case SET_RESPONSES:
      setResponses(action.uuidsOrResponses);
      break;
    case CLEAR_RESPONSES:
      clearResponses(action.uuids);
      break;
    case BATCH_UPDATE_RESPONSES:
      batchUpdateResponses(action.uuidsToClear, action.uuidsOrResponsesToSet);
      break;
    case SET_BIRTH_DATE_RESPONSE:
      setResponse({ uuid: BIRTH_DATE_RESPONSE_ID, text: action.birthDate });
      break;
    case SET_GENDER_RESPONSE:
      batchUpdateResponses(GENDER_RESPONSE_IDS, [action.uuid]);
      break;
    default:
  }

  return next(action);
};

export const storeUserMiddleware = () => next => action => {
  switch (action.type) {
    case SET_ACTIVE_USER:
      if (action.user) {
        authorize(action.user);
        setAuthHeader(action.user);
      } else {
        deauthorize();
        clearAuthHeader();
      }

      break;
    default:
  }

  return next(action);
};

export const storeContentMiddleware = () => next => action => {
  switch (action.type) {
    case SET_CONTENT_META:
      if (action.contentMeta) {
        setContentMeta(action.contentMeta);
      }
      break;
    default:
  }

  return next(action);
};
