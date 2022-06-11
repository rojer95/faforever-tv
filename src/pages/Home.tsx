import React, {useState, useEffect} from 'react';
import styled from 'styled-components/native';
import {ScrollView, RefreshControl, useTVEventHandler} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import CodePush from 'react-native-code-push';

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
import {useGlobal} from '../hooks/useGlobal';
import FmButton from '../components/FmButton';
import MyLikeButton from '../components/MyLikeButton';
import RankButton from '../components/RankButton';

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
  const {setCruteria: setGlobalCruteria} = useGlobal();
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

  const checkUpdate = async () => {
    try {
      const updateMessage = await CodePush.checkForUpdate();
      if (!updateMessage) {
        console.log('updateMessage empty');
        return;
      }

      console.log('updateMessage', updateMessage);

      // 执行更新
      await CodePush.sync(
        // 第一个参数吗，是个对象，可定义更新的动作
        {
          // 安装模式 'IMMEDIATE' 立刻安装， ON_NEXT_RESUME 下次启动安装
          installMode: CodePush.InstallMode.ON_NEXT_RESUME,

          // 强制更新模式下的安装，默认是IMMEDIATE 直接安装
          mandatoryInstallMode: CodePush.InstallMode.IMMEDIATE,

          //更新确认弹窗设置，设置系统自带弹窗中的内容
          updateDialog: {
            mandatoryUpdateMessage: '版本号: ' + updateMessage?.appVersion,
            mandatoryContinueButtonLabel: '强制更新/确认',
            optionalIgnoreButtonLabel: '取消',
            optionalInstallButtonLabel: '安装',
            optionalUpdateMessage: '版本号: ' + updateMessage?.appVersion,
            title: '发现新版本',
          },
        },
        // 第二个参数，更新状态检测，返回数字
        //0 已经是最新，1 安装完成、等待生效，2 忽略更新，3 未知错误，4 已经在下载了，5 查询更新，6 弹出了更新确认界面，7 下载中，8下载完成
        status => {
          switch (status) {
            case 0:
              // alert('已经是最新版本');
              break;
            case 1:
              !updateMessage.isMandatory &&
                alert('更新完成, 再启动APP更新即生效');
              break;
            case 3:
              alert('出错了，未知错误');
              break;
            case 7:
              // this.setState({showProcess: true});
              alert('下载中');
              break;
            case 8:
              // this.setState({showProcess: false});
              alert('下载完成');
              break;
          }
        },
        // 第三个参数，检测下载过程
        ({receivedBytes, totalBytes}) => {
          console.log('DownloadProgress: ', receivedBytes, totalBytes);
        },
      );
    } catch (error: any) {
      console.log(error);
      alert('网络错误');
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    checkUpdate();
    try {
      const {data: criteriaData} = await getCriteria();
      setCruteria(criteriaData);
      setGlobalCruteria(criteriaData);
      setRefreshing(false);
    } catch (error: any) {
      global.alert(error.message);
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
          <Flex style={{width: '100%'}} justify="space-between">
            <FmButton />
            <MyLikeButton />
            {/* <RankButton /> */}
          </Flex>

          {/* <Twitch /> */}
          <Title>
            <Text size={24}>推荐歌单</Text>
          </Title>

          <RecommendPlaylist cruteria={cruteria} />

          <Flex justify="center" align="center">
            <Text color="#9a9a9a" style={{marginBottom: 18}}>
              当前版本号：v1.0.2
            </Text>
          </Flex>
        </Container>
      </ScrollView>
    </Page>
  );
});
