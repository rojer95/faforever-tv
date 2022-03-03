/**
 * @format
 */

import 'react-native/tvos-types.d';

import {AppRegistry} from 'react-native';
import App from './App';
import app from './app.json';
import {getSid} from './src/api';

global.sid = null;

getSid().then(({data}) => {
  global.sid = data.sid;
});

AppRegistry.registerComponent(app.name, () => App);
