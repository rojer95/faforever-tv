declare var sid: string;
declare var alert: (msg: string) => void;
declare module 'react-native-video';
declare module 'react-native-image-animation';
declare module '@unsw-gsbme/react-native-keep-awake';

type RootStackParamList = {
  Home: any;
  List: {title: string; key: string};
  Music: any;
  Twitch: {
    url?: string;
  };
};
