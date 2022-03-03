import React, {useContext, useEffect, useState} from 'react';
import {Lrc} from '@rojer/react-native-lrc';
import {ImageBackground, View} from 'react-native';
import Slider from '@react-native-community/slider';
import styled from 'styled-components/native';
import debounce from 'lodash.debounce';
import useWidth from '../hooks/useWidth';
import {Container, Flex, Page} from '../components/Layout';
import Text from '../components/Text';
import Poster from '../components/Poster';
import Focusable from '../components/Focusable';
import Button from '../components/Button';
import {getPicUrl} from '../api';
import {usePlayer} from '../hooks/useStores';
import {observer} from 'mobx-react';
import {useGlobal} from '../hooks/useGlobal';

const LrcBox = styled.View<{height: number; width: number}>`
  height: ${props => `${props.height}px`};
  width: 100%;
`;

const ControlerBox = styled(Flex)`
  height: 100px;
  width: 100%;
  padding-bottom: 20px;
`;

const Icon = styled.Image<{size?: number}>`
  height: ${props => (props.size ? `${props.size}px` : '23px')};
  width: ${props => (props.size ? `${props.size}px` : '23px')};
`;
interface Props {}

const loops: any = {
  list: require('../assets/icon_loop_list.png'),
  random: require('../assets/icon_loop_random.png'),
  signal: require('../assets/icon_loop_signal.png'),
};

const SliderBar = observer(({onValueChange}: {onValueChange: any}) => {
  const {w1} = useWidth();
  const {progress} = usePlayer();

  return (
    <Slider
      style={{width: w1, height: 40}}
      minimumValue={0}
      maximumValue={progress?.seekableDuration}
      thumbTintColor="#FFFFFF"
      minimumTrackTintColor="#FFFFFF"
      maximumTrackTintColor="#FFFFFF"
      value={progress?.currentTime}
      onValueChange={onValueChange}
    />
  );
});

const LrcBar = observer(({lyric, height}: {lyric: string; height: number}) => {
  const {progress} = usePlayer();
  const lineRenderer = React.useCallback(
    ({lrcLine: {content}, active}) => (
      <Text
        color={active ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.7)'}
        size={active ? 28 : 18}
        numberOfLines={1}
        style={{textAlign: 'center'}}>
        {content}
      </Text>
    ),
    [],
  );

  return (
    <Lrc
      height={height * 0.5}
      lrc={lyric}
      currentTime={parseInt(`${progress?.currentTime * 1000}`, 0)}
      lineHeight={38}
      activeLineHeight={58}
      lineRenderer={lineRenderer}
      scrollEnabled={false}
    />
  );
});

const Music = observer(() => {
  const {
    current,
    playerState,
    setLoop,
    loop,
    lyric,
    pause,
    play,
    playNext,
    playPre,
    seekTo,
  } = usePlayer();

  // const {likelist, likeMusic} = useGlobal();
  const slideing = React.useRef<boolean>(false);
  const {height, w1, w5, w3} = useWidth();
  const [liked, setLiked] = React.useState(false);
  const [uri, setUri] = useState<string>('');
  const {cruteria} = useGlobal();

  const toggleLoop = () => {
    const next: any = {
      list: 'random',
      random: 'signal',
      signal: 'list',
    };
    setLoop?.(next[loop ?? 'list']);
  };

  useEffect(() => {
    // 随机封面，避免一直是用一个背景
    if (cruteria) {
      const index = Math.floor(Math.random() * cruteria?.length);
      setUri(
        getPicUrl(cruteria?.[index]?.name, cruteria?.[index]?.album_artist),
      );
    }
  }, [current]);

  const slideTime = debounce((time: number) => {
    seekTo(parseInt(`${time}`, 0));
    slideing.current = false;
  }, 1000);

  return (
    <Page pageId="Music">
      <View
        style={{
          position: 'relative',
        }}>
        {current?.additional ? (
          <ImageBackground
            source={{
              uri,
            }}
            blurRadius={18}
            style={{
              height: '100%',
              width: '100%',
              opacity: 0.5,
              position: 'absolute',
              zIndex: 1,
            }}
          />
        ) : null}

        <Flex
          direction="column"
          style={{
            height: '100%',
            width: '100%',
            position: 'relative',
            zIndex: 998,
          }}>
          <Flex style={{flex: 1}} align="center" justify="center">
            <Poster />
            <View style={{marginLeft: 24, width: w3 * 2}}>
              <Flex
                style={{marginBottom: 12}}
                direction="column"
                justify="center"
                align="center">
                <Text
                  size={36}
                  numberOfLines={1}
                  style={{
                    textAlign: 'center',
                    width: '100%',
                    marginBottom: 12,
                  }}>
                  {current?.title}
                </Text>

                <Flex justify="center" align="center">
                  <Text
                    color="rgba(255,255,255, 0.4)"
                    style={{marginRight: 10}}>
                    专辑：{current?.additional?.song_tag?.album}
                  </Text>

                  <Text color="rgba(255,255,255, 0.4)" style={{marginLeft: 10}}>
                    歌手：{current?.additional?.song_tag?.album_artist}
                  </Text>
                </Flex>
              </Flex>

              <LrcBox height={height * 0.5} width={w3 * 2}>
                <LrcBar height={height} lyric={lyric || ''} />
              </LrcBox>
            </View>
          </Flex>

          <Container>
            <SliderBar
              onValueChange={(time: any) => {
                slideing.current = true;
                slideTime(time);
              }}
            />
          </Container>

          <ControlerBox justify="center" align="center" direction="column">
            <Flex align="center">
              {/* 循环模式 */}
              <Focusable
                shadow={false}
                radius={40}
                onPress={toggleLoop}
                style={{marginRight: 24}}>
                <Button height={40} width={40} radius={40}>
                  <Icon source={loops[loop ?? 'list']} resizeMode="contain" />
                </Button>
              </Focusable>

              {/* 不喜欢 */}
              {/* {mode === 'fm' ? (
              <Focusable
                shadow={false}
                radius={40}
                onPress={async () => {
                  await fmTrash(current?.id);
                }}
                style={{marginRight: 24}}>
                <Button height={40} width={40} radius={40}>
                  <Icon
                    source={require('../assets/icon_dislike.png')}
                    resizeMode="contain"
                  />
                </Button>
              </Focusable>
            ) : null} */}

              {/* 上一首 */}
              <Focusable
                shadow={false}
                radius={40}
                onPress={async () => {
                  // skipToPrevious();
                  playPre?.();
                }}
                style={{marginRight: 24}}>
                <Button height={40} width={40} radius={40}>
                  <Icon
                    source={require('../assets/icon_pre.png')}
                    resizeMode="contain"
                  />
                </Button>
              </Focusable>

              {/* {mode === 'fm' ? (
              <View style={{marginRight: 24, borderRadius: 40, opacity: 0.4}}>
                <Button height={40} width={40} radius={40}>
                  <Icon
                    source={require('../assets/icon_pre.png')}
                    resizeMode="contain"
                  />
                </Button>
              </View>
            ) : null} */}

              {/* 播放 / 暂停 */}
              <Focusable
                shadow={false}
                radius={50}
                onPress={() => {
                  if (playerState === 'playing') {
                    pause?.();
                  }
                  if (playerState === 'stoped') {
                    play?.();
                  }
                }}
                defaultFocus>
                <Button height={50} width={50} radius={50}>
                  <Icon
                    source={
                      playerState === 'playing'
                        ? require('../assets/icon_pause.png')
                        : require('../assets/icon_play.png')
                    }
                    resizeMode="contain"
                  />
                </Button>
              </Focusable>

              {/* 下一首 */}
              <Focusable
                shadow={false}
                radius={40}
                onPress={async () => {
                  playNext?.();
                }}
                style={{marginLeft: 24}}>
                <Button height={40} width={40} radius={40}>
                  <Icon
                    source={require('../assets/icon_next.png')}
                    resizeMode="contain"
                  />
                </Button>
              </Focusable>

              {/* 喜欢 */}
              {/* <Focusable
                shadow={false}
                radius={40}
                onPress={() => {
                  // likeMusic(current?.id, !liked);
                }}
                style={{marginLeft: 24}}>
                <Button height={40} width={40} radius={40}>
                  <Icon
                    source={
                      liked
                        ? require('../assets/icon_liked.png')
                        : require('../assets/icon_like.png')
                    }
                    resizeMode="contain"
                  />
                </Button>
              </Focusable> */}
            </Flex>
          </ControlerBox>
        </Flex>
      </View>
    </Page>
  );
});

export default Music;
