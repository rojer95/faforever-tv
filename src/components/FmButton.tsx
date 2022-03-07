import React, {useEffect, useState} from 'react';
import {ImageBackground} from 'react-native';
import {observer} from 'mobx-react';
import LinearGradinet from 'react-native-linear-gradient';
import Focusable from './Focusable';
import TitleAndDesc from './TitleAndDes';
import useWidth from '../hooks/useWidth';
import {usePlayer} from '../hooks/useStores';
import {getPicUrl} from '../api';
import {NavigationProp, useNavigation} from '@react-navigation/native';
const fm_icon = require('../assets/fm.png');

const FmButton: React.FC = observer(() => {
  const [poster, setPoster] = useState('');
  const {random, loadRandom, startGlobalRandom, isGlobalRandom} = usePlayer();

  const {w4, space} = useWidth();
  const nav = useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    if (random) {
      setPoster(
        getPicUrl(
          random?.additional?.song_tag?.album,
          random?.additional?.song_tag?.album_artist,
        ),
      );
    }
  }, [random]);

  useEffect(() => {
    loadRandom();
  }, []);

  return (
    <Focusable
      style={{
        height: w4,
        flex: 1,
        marginRight: space,
      }}
      onPress={async () => {
        if (!isGlobalRandom) {
          startGlobalRandom();
        }
        nav.navigate('Music');
      }}
      radius={10}
      ani>
      {poster ? (
        <ImageBackground
          source={{
            uri: poster,
          }}
          style={{
            width: '100%',
            height: '100%',
          }}
          resizeMode="cover">
          <TitleAndDesc
            title="随机听歌"
            desc="陈一发儿最牛逼！"
            icon={fm_icon}
          />
        </ImageBackground>
      ) : (
        <LinearGradinet
          style={{width: '100%', height: '100%'}}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          colors={['#051937', '#A8EB12']}>
          <TitleAndDesc
            title="随机听歌"
            desc="陈一发儿最牛逼！"
            icon={fm_icon}
          />
        </LinearGradinet>
      )}
    </Focusable>
  );
});

export default FmButton;
