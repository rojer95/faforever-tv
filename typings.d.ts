declare var sid: string;
declare module 'react-native-video';
declare module 'react-native-image-animation';
declare module '@unsw-gsbme/react-native-keep-awake';

type RootStackParamList = {
  Home: any;
  List: {detail: any};
  Music: any;
  Twitch: {
    url?: string;
  };
};
