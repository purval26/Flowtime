import 'react-native-url-polyfill/auto';
import React from 'react';
import { AppRegistry, Text, TextInput, Platform } from 'react-native';
import * as jsxRuntime from 'react/jsx-runtime';
import App from './App';
import { name as appName } from './app.json';
import { getMessaging, setBackgroundMessageHandler } from '@react-native-firebase/messaging';

// Global font setup for Plus Jakarta Sans
const defaultFont = Platform.OS === 'android' ? 'PlusJakartaSans' : 'Plus Jakarta Sans';
const fontStyle = { fontFamily: defaultFont };

// Intercept React.createElement for Text and TextInput
const originalCreateElement = React.createElement;
React.createElement = function (type, props, ...children) {
  if (type === Text || type === TextInput) {
    props = props ? { ...props } : {};
    props.style = [fontStyle, props.style];
  }
  return originalCreateElement.call(this, type, props, ...children);
};

// Intercept JSX runtime for Text and TextInput
const patchJsx = (jsxFn) => {
  return function (type, props, key) {
    if (type === Text || type === TextInput) {
      props = props ? { ...props } : {};
      props.style = [fontStyle, props.style];
    }
    return jsxFn(type, props, key);
  };
};

if (jsxRuntime.jsx) {
  jsxRuntime.jsx = patchJsx(jsxRuntime.jsx);
}
if (jsxRuntime.jsxs) {
  jsxRuntime.jsxs = patchJsx(jsxRuntime.jsxs);
}

// Register background messaging handler
const firebaseMessaging = getMessaging();
setBackgroundMessageHandler(firebaseMessaging, async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
});

// Register the root component
AppRegistry.registerComponent(appName, () => App);
