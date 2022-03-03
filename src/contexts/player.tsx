import React, {PropsWithChildren, useRef, useState} from 'react';

type PlayerContextType = {
  current?: any;
  playList?: (music: any, list: any[]) => void;
  playerState?: 'playing' | 'stoped';
  setPlayerState?: (state: 'playing' | 'stoped') => void;
  loop?: 'list' | 'signal' | 'random';
  setLoop?: (loop: 'list' | 'signal' | 'random') => void;
  lyric?: string;
  setLyric?: (p: string) => void;
  playNext?: any;
  playPre?: any;
  paused?: boolean;
  pause?: any;
  play?: any;
  setPlayer?: any;
  seekTo?: any;
};
const PlayerContext = React.createContext<PlayerContextType>({});

export default PlayerContext;

const PlayerProvider = ({children}: PropsWithChildren<{}>) => {
  const player = useRef<any>(null);
  const [paused, setPaused] = useState(false);
  const [current, setCurrent] = useState<any>(null);
  const [currentList, setCurrentList] = useState<any[]>([]);
  const [playerState, setPlayerState] = useState<'playing' | 'stoped'>(
    'stoped',
  );

  const [loop, setLoop] = useState<'list' | 'signal' | 'random'>('list');
  const [lyric, setLyric] = useState<string>('');

  const playNext = () => {
    if (loop === 'signal') {
      return;
    }

    if (loop === 'random') {
      // 随机
      const index = Math.floor(Math.random() * currentList.length);
      const song = {...currentList[index]};
      setCurrent(song);
      return;
    }

    let index = currentList.findIndex(value => {
      if (value.id === current.id) {
        return true;
      }
      return false;
    });

    index += 1;
    index = index < currentList.length ? index : 0;
    const song = {...currentList[index]};
    setCurrent(song);
  };

  const playPre = () => {
    if (loop === 'signal') {
      return;
    }

    if (loop === 'random') {
      // 随机
      const index = Math.floor(Math.random() * currentList.length);
      const song = {...currentList[index]};
      setCurrent(song);
      return;
    }

    let index = currentList.findIndex(value => {
      if (value.id === current.id) {
        return true;
      }
      return false;
    });

    index -= 1;
    index = index < 0 ? currentList.length - 1 : index;
    const song = {...currentList[index]};
    setCurrent(song);
  };

  const pause = () => {
    setPaused(true);
    setPlayerState('stoped');
  };

  const play = () => {
    setPaused(false);
    setPlayerState('playing');
  };

  const seekTo = (t: number) => {
    player.current?.seek(t);
  };
  return (
    <PlayerContext.Provider
      value={{
        current,
        playList: (music, list) => {
          setCurrent(music);
          setCurrentList(list);
        },
        playNext,
        playPre,
        setPlayer: (o: any) => (player.current = o),
        paused,
        pause,
        play,
        playerState,
        setPlayerState,
        loop,
        setLoop,
        lyric,
        setLyric,
        seekTo,
      }}>
      {children}
    </PlayerContext.Provider>
  );
};

export {PlayerProvider};
