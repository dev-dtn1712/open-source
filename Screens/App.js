import '../Config';
import React, { Component } from 'react';
import { Provider } from 'react-redux';
import DebugConfig from '../Config/DebugConfig';
import RootContainer from './Root';
import createStore from '../Redux';
import { initApi } from '../Services/Api';
import {
  initializeAnalytics,
  initializeAnalyticsHelper
} from '../Services/Analytics';
// create our store
const store = createStore();
initApi(store);

initializeAnalytics();
initializeAnalyticsHelper(store);

/**
 * Provides an entry point into our application.  Both index.ios.js and index.android.js
 * call this component first.
 *
 * We create our Redux store here, put it into a provider and then bring in our
 * RootContainer.
 *
 * We separate like this to play nice with React Native's hot reloading.
 */
class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <RootContainer />
      </Provider>
    );
  }
}

// allow reactotron overlay for fast design in dev mode
export default DebugConfig.useReactotron ? console.tron.overlay(App) : App;
