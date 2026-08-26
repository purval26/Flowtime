import 'react-native-url-polyfill/auto';
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { getMessaging, setBackgroundMessageHandler } from '@react-native-firebase/messaging';

// Register background messaging handler
const firebaseMessaging = getMessaging();
setBackgroundMessageHandler(firebaseMessaging, async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
});

// Register the root component
AppRegistry.registerComponent(appName, () => App);
