import React, {useState, useEffect} from 'react';
import styled from 'styled-components/native';
import {
  ScrollView,
  RefreshControl,
  useTVEventHandler,
  ToastAndroid,
} from 'react-native';
import SplashScreen from 'react-native-splash-screen';

import {Flex, Page, Container} from '../components/Layout';
import Focusable from '../components/Focusable';
import Button from '../components/Button';
import Text from '../components/Text';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import Musicing from '../components/Musicing';
import RecommendPlaylist from '../components/RecommendPlaylist';
import {getCriteria} from '../api';
import Twitch from '../components/Twitch';
import {usePlayer} from '../hooks/useStores';
import {observer} from 'mobx-react';

const Header = styled.View`
  margin: 15px 0px;
  height: 60px;
  width: 100%;
  padding: 0px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
`;

const Logo = styled.Image`
  height: 60px;
  width: 250px;
  margin-right: auto;
`;

const Avatar = styled.View`
  height: 40px;
  width: 40px;
  border-radius: 40px;
  overflow: hidden;
`;

const Title = styled(Flex)`
  border-left-width: 4px;
  border-left-color: #e70625;
  padding-left: 8px;
  margin: 24px 4px;
  justify-content: space-between;
  align-items: center;
`;

export default observer(() => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const {current, playerState} = usePlayer();
  const [refreshing, setRefreshing] = useState(false);

  const [cruteria, setCruteria] = useState([]);

  useTVEventHandler(e => {
    if (e.eventType === 'menu') {
      onRefresh();
    }
  });
  useEffect(() => {
    SplashScreen.hide();
  }, []);

  useEffect(() => {
    onRefresh();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const {data: criteriaData} = await getCriteria();
      setCruteria(criteriaData);
      setRefreshing(false);
    } catch (error: any) {
      ToastAndroid.showWithGravity(
        error.message,
        ToastAndroid.LONG,
        ToastAndroid.CENTER,
      );
      setRefreshing(false);
    }
  };

  return (
    <Page pageId="Home">
      <ScrollView
        refreshControl={
          <RefreshControl
            tintColor="#e70625"
            colors={['#e70625']}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }>
        {/* 头部 */}
        <Header>
          <Logo resizeMode="contain" source={require('../assets/logo-w.png')} />
          {current?.title ? (
            <Focusable
              shadow={false}
              onPress={() => {
                navigation.navigate('Music');
              }}
              radius={40}
              style={{marginRight: 12}}>
              <Flex align="center">
                {playerState === 'playing' ? (
                  <Button
                    width={40}
                    height={40}
                    radius={40}
                    style={{marginRight: 6}}>
                    <Musicing width={20} height={20} />
                  </Button>
                ) : null}
                <Text
                  size={12}
                  style={{maxWidth: 180, marginRight: 24}}
                  numberOfLines={1}>
                  {current?.title}
                </Text>
              </Flex>
            </Focusable>
          ) : null}
        </Header>
        <Container>
          <Twitch />
          <Title>
            <Text size={24}>推荐歌单</Text>
          </Title>

          <RecommendPlaylist cruteria={cruteria} />
        </Container>
      </ScrollView>
    </Page>
  );
});
