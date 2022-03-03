import React, {useEffect, useRef, useState} from 'react';
import {View, Alert} from 'react-native';
import {RecyclerListView, DataProvider} from 'recyclerlistview';
import {GridLayoutProvider} from 'recyclerlistview-gridlayoutprovider';
import styled from 'styled-components/native';

import useWidth from '../hooks/useWidth';
import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';

import {Flex, Page} from '../components/Layout';
import Focusable from '../components/Focusable';
import Text from '../components/Text';
import Musicing from '../components/Musicing';
import {useGlobal} from '../hooks/useGlobal';
import {getPicUrl} from '../api';
import {usePlayer} from '../hooks/useStores';
import {observer} from 'mobx-react';

interface Props {
  detail: any;
}

const Container = styled.View`
  height: 100%;
  width: 100%;
`;

const SongBox = styled.View`
  height: 80px;
  width: 100%;
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const ITEM_HEIGHT = 80 + 20;

const Song = styled(Flex)`
  width: 100%;
  height: 80px;
  background-color: rgba(0, 0, 0, 0.3);
  padding-right: 24px;
`;

const SongPic = styled.Image`
  height: 80px;
  width: 80px;
  margin-right: 12px;
`;

const Empty = styled(Flex)`
  height: 60px;
  width: 100%;
`;

interface ItemProps {
  item: any;
  onPress: any;
  width: number;
  index: number;
}

const confirm = (title: string, msg: string, ok: string, cancel: string) => {
  return new Promise(resolve => {
    Alert.alert(title, msg, [
      {
        text: cancel,
        onPress: () => {
          resolve(false);
        },
        style: 'cancel',
      },
      {text: ok, onPress: () => resolve(true)},
    ]);
  });
};

class LayoutProvider extends GridLayoutProvider {
  constructor(props: any) {
    super(
      2,
      index => {
        return index;
      },
      index => {
        return 1;
      },
      index => {
        return ITEM_HEIGHT;
      },
    );
  }
}

const Item = observer(({item, onPress, width, index}: ItemProps) => {
  const {additional: {song_tag = {}} = {}} = item;

  const {current} = usePlayer();

  return (
    <SongBox>
      <Focusable
        style={{width}}
        onPress={onPress}
        defaultFocus={index === 0}
        ani>
        <Song align="center" justify="space-between">
          <SongPic
            source={{
              uri: getPicUrl(song_tag?.album, song_tag?.album_artist),
            }}
            resizeMode="cover"
          />
          <Flex
            direction="column"
            justify="space-evenly"
            style={{
              flex: 1,
            }}>
            <Text numberOfLines={1} ellipsizeMode="tail" size={24}>
              {item.search_key ?? item.title}
            </Text>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              color="rgba(255,255,255, 0.6)">
              {song_tag?.artist}
            </Text>
          </Flex>
          {current?.id === item?.id ? (
            <View style={{marginLeft: 12}}>
              <Musicing width={18} height={18} />
            </View>
          ) : null}
        </Song>
      </Focusable>
    </SongBox>
  );
});

const List = observer(() => {
  const {w2} = useWidth();
  const {playList} = usePlayer();

  const changeFunc = (r1: any, r2: any) => r1.id !== r2.id;
  const [list, setList] = useState<any>(
    new DataProvider(changeFunc).cloneWithRows([]),
  );
  const [layoutProvider, setLayoutProvider] = useState<any>(
    new LayoutProvider(list),
  );
  const [loaded, setLoaded] = useState(false);

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const {songs} = useGlobal();

  const route = useRoute<RouteProp<{detail: any}>>();
  const {params} = route;

  useEffect(() => {
    if (params?.detail) {
      setTitle();
      load();
    }
  }, [params?.detail]);

  const setTitle = () => {
    navigation.setOptions({
      title: params?.detail?.name,
    });
  };

  const load = () => {
    if (songs && params?.detail?.name in songs) {
      const dataProvider = new DataProvider(changeFunc).cloneWithRows(
        songs[params?.detail?.name],
      );
      setList(dataProvider);
      setLayoutProvider(new LayoutProvider(dataProvider));
      setLoaded(true);
    }
  };

  const renderItem = (index: any, item: any) => {
    return (
      <Item
        index={index}
        item={item}
        onPress={async () => {
          const ok = await confirm(
            '提示',
            '替换当前播放列表，是否继续？如歌单过长可能需要比较久时间',
            '继续',
            '不了',
          );
          if (ok) {
            playList?.(item, songs?.[params?.detail?.name] ?? []);
            navigation.navigate('Music');
          } else {
            return false;
          }

          // navigation.navigate('Music');
        }}
        width={w2}
      />
    );
  };

  return (
    <Page pageId="List">
      <Container>
        <RecyclerListView
          rowRenderer={renderItem}
          dataProvider={list}
          layoutProvider={layoutProvider}
          renderFooter={() => (
            <Empty align="center" justify="center">
              <Text color="rgba(255,255,255,0.6)">
                {!loaded ? '加载中...' : '没有更多歌曲了~'}
              </Text>
            </Empty>
          )}
        />
      </Container>
    </Page>
  );
});

export default List;
