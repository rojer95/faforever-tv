import React, {useEffect, useState} from 'react';
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
import {PlayerProvider} from './src/contexts/player';

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
  useKeepAwake();

  const loadSongs = async () => {
    const {data} = await getSongs();
    setSongs(data);
  };

  useEffect(() => {
    loadSongs();
  }, []);

  return (
    <GlobalContext.Provider
      value={{
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
      <PlayerProvider>
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
      </PlayerProvider>
    </GlobalContext.Provider>
  );
};

export default App;
