import { combineReducers } from 'redux';
import { reducer as app } from './AppRedux';
import auth from './AuthRedux';
import connection from './ConnectionRedux';
import metadata from './MetadataRedux';
import { reducer as nav } from './NavigationRedux';
import responses from './ResponsesRedux';
import session from './SessionRedux';
import signup from './SignupRedux';
import profileSettings from './ProfileSettingsRedux';
import contentMeta from './ContentMetaRedux';

const reducers = combineReducers({
  app,
  auth,
  connection,
  metadata,
  nav,
  session,
  signup,
  responses,
  profileSettings,
  contentMeta
});

export default reducers;
