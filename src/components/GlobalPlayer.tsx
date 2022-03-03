import React, {useContext, useEffect, useState} from 'react';
import Video from 'react-native-video';
import RNFS from 'react-native-fs';
import throttle from 'lodash.throttle';

import {getDownloadUrl} from '../api';
import {ToastAndroid} from 'react-native';
import axios from 'axios';
import {usePlayer} from '../hooks/useStores';
import {observer} from 'mobx-react';

export default observer(() => {
  const {
    current,
    setLyric,
    setPlayer,
    setPlayerState,
    loop,
    paused,
    playNext,
    pause,
    play,
    playerState,
    setProgress,
  } = usePlayer();
  const [uri, setUri] = useState<string>('');

  useEffect(() => {
    if (current) {
      playFromDs(current);
    }
  }, [current]);

  const loadLrc = async (item: any) => {
    setLyric?.('[00:00.00]歌词加载中..');
    try {
      const lrcurl = `https://bitbucket.org/rojerchen95/faforever-lrc/raw/master/${
        item.title
      }.lrc?_t=${new Date().valueOf()}`;
      const {data: lrc} = await axios.get(lrcurl);
      setLyric?.(lrc);
    } catch (error) {
      setLyric?.('[00:00.00]暂无歌词');
    }
  };

  const updateProgress = throttle((e: any) => {
    setProgress(e);
  }, 400);

  const playFromDs = async (item: any) => {
    setProgress({currentTime: 0, seekableDuration: 0});
    pause();
    const cacheKey = item.path.replace(/\/|\s/g, '_');
    const filepath = RNFS.DocumentDirectoryPath + cacheKey;
    const is = await RNFS.exists(filepath);
    console.log('filepath', filepath, 'is', is);
    await loadLrc(item);

    if (!is) {
      try {
        ToastAndroid.showWithGravity(
          '下载歌曲中...',
          ToastAndroid.LONG,
          ToastAndroid.CENTER,
        );
        const url = getDownloadUrl(item.id);
        const ret = RNFS.downloadFile({
          fromUrl: url,
          toFile: filepath,
          background: true,
        });
        await ret.promise;
      } catch (error) {
        console.log('下载失败');
        ToastAndroid.showWithGravity(
          '下载失败',
          ToastAndroid.LONG,
          ToastAndroid.CENTER,
        );
      }
    }

    setUri(`file:///${filepath}`);
    play();
  };

  return uri ? (
    <Video
      source={{uri: uri}}
      ref={(ref: any) => setPlayer(ref)}
      onLoad={() => {
        setPlayerState?.('playing');
      }}
      onProgress={(e: any) => {
        if (playerState === 'playing') {
          updateProgress(e);
        }
      }}
      onEnd={() => {
        console.log('onEnd');
        playNext();
      }}
      repeat={loop === 'signal'}
      paused={paused}
      audioOnly
      // playInBackground
    />
  ) : null;
});
