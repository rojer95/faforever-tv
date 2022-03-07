import React, {useEffect, useState} from 'react';
import {ImageBackground} from 'react-native';
import {observer} from 'mobx-react';
import LinearGradinet from 'react-native-linear-gradient';
import Focusable from './Focusable';

import TitleAndDesc from './TitleAndDes';
import useWidth from '../hooks/useWidth';
import {useLike} from '../hooks/useStores';
import {getPicUrl} from '../api';
import {NavigationProp, useNavigation} from '@react-navigation/native';
const mylike_icon = require('../assets/mylike.png');

const MyLikeButton = observer(() => {
  const [bg, setBg] = useState('');
  const {w4, space} = useWidth();

  const {list} = useLike();
  useEffect(() => {
    if (list && list.length > 0) {
      setBg(
        getPicUrl(
          list[0]?.additional?.song_tag?.album,
          list[0]?.additional?.song_tag?.album_artist,
        ),
      );
    }
  }, [list]);

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <Focusable
      style={{
        // width: w4,
        // height: w4,
        height: w4,
        flex: 1,
        marginRight: space,
      }}
      onPress={() => {
        navigation.navigate({
          name: 'List',
          params: {
            title: '我喜欢的',
            key: '__like__',
          },
        });
      }}
      radius={10}
      ani>
      {bg ? (
        <ImageBackground
          source={{
            uri: bg,
          }}
          style={{
            width: '100%',
            height: '100%',
          }}
          resizeMode="cover">
          <TitleAndDesc
            title="我喜欢的"
            desc="【点击查看详情】"
            icon={mylike_icon}
          />
        </ImageBackground>
      ) : (
        <LinearGradinet
          style={{width: '100%', height: '100%'}}
          start={{x: 1, y: 1}}
          end={{x: 0, y: 0}}
          colors={['#cacaca', '#ececec']}>
          <TitleAndDesc
            title="我喜欢的"
            desc="【点击查看详情】"
            icon={mylike_icon}
          />
        </LinearGradinet>
      )}
    </Focusable>
  );
});

export default MyLikeButton;
