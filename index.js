/**
 * @format
 */

import 'react-native/tvos-types.d';

import {AppRegistry, ToastAndroid} from 'react-native';
import App from './App';
import app from './app.json';
import {getSid} from './src/api';

global.sid = null;
global.alert = msg => {
  ToastAndroid.showWithGravity(msg, ToastAndroid.LONG, ToastAndroid.CENTER);
};

getSid()
  .then(({data}) => {
    global.sid = data.data.sid;
  })
  .catch(() => {
    global.alert('登录失败，可能您的网络不支持IPV6');
  });

AppRegistry.registerComponent(app.name, () => App);
