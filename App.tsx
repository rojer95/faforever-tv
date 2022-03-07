import React, {useEffect, useState} from 'react';
import codePush from 'react-native-code-push';
import Home from './src/pages/Home';
import List from './src/pages/List';
import Twitch from './src/pages/Twitch';
import Music from './src/pages/Music';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {useKeepAwake} from '@unsw-gsbme/react-native-keep-awake';

import GlobalContext from './src/contexts/global';
import BackButton from './src/components/BackButton';
import {getSongs} from './src/api';
import GlobalPlayer from './src/components/GlobalPlayer';
import {useLike} from './src/hooks/useStores';

const Stack = createStackNavigator<RootStackParamList>();

const optionGeter = (name: string) => {
  return {
    headerStyle: {
      backgroundColor: '#363636',
    },
    headerTitleStyle: {
      color: '#FFFFFF',
    },
    headerTitle: name,
    headerLeft: () => <BackButton />,
  };
};

const App = () => {
  const [currentPage, setCurrentPage] = useState('Home');
  const [songs, setSongs] = useState<Record<string, any>>({});
  const [pageLastFocus, setPageLastFocus] = useState<Record<string, string>>(
    {},
  );

  const [cruteria, setCruteria] = useState<any[]>([]);
  useKeepAwake();

  const like = useLike();

  const loadSongs = async () => {
    const {data} = await getSongs();
    setSongs(data);
  };

  useEffect(() => {
    loadSongs();
    like.init();
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        cruteria,
        setCruteria,
        songs,
        page: currentPage,
        setPage: setCurrentPage,
        pageLastFocus,
        setPageLastFocus: (page: string, uuid: string) => {
          setPageLastFocus({
            ...pageLastFocus,
            [page]: uuid,
          });
        },
      }}>
      <GlobalPlayer />
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={Home}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="List"
            component={List}
            options={optionGeter('歌曲列表')}
          />

          <Stack.Screen
            name="Music"
            component={Music}
            options={{
              headerShown: false,
            }}
          />

          <Stack.Screen
            name="Twitch"
            component={Twitch}
            options={{
              headerShown: false,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </GlobalContext.Provider>
  );
};

export default codePush({
  checkFrequency: codePush.CheckFrequency.ON_APP_START,
})(App);
