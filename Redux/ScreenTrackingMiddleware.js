import { NavigationActions, SwitchActions } from 'react-navigation';
import { setIsScanning } from './ConnectionRedux';
import {
  logger,
  getCurrentRouteName,
  compareDiscoveryScanningScreen
} from '../Utils';
import {
  getAnalyticsDataFromFromNavAction,
  logContent
} from '../Services/Analytics';

const TRACKABLE_ACTIONS = new Set([
  NavigationActions.NAVIGATE,
  NavigationActions.BACK,
  SwitchActions.JUMP_TO
]);

const screenTracking = ({ getState, dispatch }) => next => action => {
  if (!TRACKABLE_ACTIONS.has(action.type)) {
    return next(action);
  }

  const currentScreen = getCurrentRouteName(getState().nav);
  const result = next(action);
  const nextScreen = getCurrentRouteName(getState().nav);
  if (nextScreen !== currentScreen) {
    try {
      logger.log(`NAVIGATING ${currentScreen} to ${nextScreen}`);

      const contentData = getAnalyticsDataFromFromNavAction(
        currentScreen,
        nextScreen,
        action
      );
      if (contentData) {
        logContent(contentData);
      }

      const compareResult = compareDiscoveryScanningScreen(
        currentScreen,
        nextScreen
      );
      if (compareResult !== 0) {
        dispatch(setIsScanning(compareResult > 0));
      }
    } catch (e) {
      logger.log(e);
    }
  }
  return result;
};

export default screenTracking;
