import {makeAutoObservable} from 'mobx';
import {getRandom} from '../api';
type Song = {
  [key: string]: any;
};

class PlayerStore {
  player: any;
  paused: boolean = false;
  current?: Song = undefined;
  currentList: Song[] = [];
  playerState: 'playing' | 'stoped' = 'stoped';
  loop: 'list' | 'signal' | 'random' = 'list';
  lyric: string = '';
  progress: {currentTime: number; seekableDuration: number} = {
    currentTime: 0,
    seekableDuration: 0,
  };
  isGlobalRandom: boolean = false;
  random?: Song = undefined;

  constructor() {
    makeAutoObservable(this, {}, {autoBind: true});
  }

  startGlobalRandom() {
    this.isGlobalRandom = true;
    this.current = this.random;
  }

  *loadRandom() {
    const {data} = yield getRandom();
    this.random = data;
    return data;
  }

  *playNext() {
    if (this.isGlobalRandom) {
      const song: Song = yield this.loadRandom();
      this.current = song;
      return;
    }

    if (this.loop === 'signal') {
      return;
    }

    if (this.loop === 'random') {
      // 随机
      const index = Math.floor(Math.random() * this.currentList.length);
      const song = {...this.currentList[index]};
      this.current = song;
      return;
    }

    let index = this.currentList.findIndex(value => {
      if (value.id === this.current?.id) {
        return true;
      }
      return false;
    });

    index += 1;
    index = index < this.currentList.length ? index : 0;
    const song = {...this.currentList[index]};
    this.current = song;
  }

  *playPre() {
    if (this.isGlobalRandom) {
      const song: Song = yield this.loadRandom();
      this.current = song;
      return;
    }
    if (this.loop === 'signal') {
      return;
    }

    if (this.loop === 'random') {
      // 随机
      const index = Math.floor(Math.random() * this.currentList.length);
      const song = {...this.currentList[index]};
      this.current = song;
      return;
    }

    let index = this.currentList.findIndex(value => {
      if (value.id === this.current?.id) {
        return true;
      }
      return false;
    });

    index -= 1;
    index = index < 0 ? this.currentList.length - 1 : index;
    const song = {...this.currentList[index]};
    this.current = song;
  }

  pause() {
    this.paused = true;
    this.playerState = 'stoped';
  }

  play() {
    this.paused = false;
    this.playerState = 'playing';
  }

  seekTo(t: number) {
    this.player?.seek(t);
  }

  playList(music: any, list: any[]) {
    this.isGlobalRandom = false;
    this.current = music;
    this.currentList = list;
  }

  setPlayer(o: any) {
    this.player = o;
  }

  setLyric(lrc: string) {
    this.lyric = lrc;
  }

  setPlayerState(state: 'playing' | 'stoped') {
    this.playerState = state;
  }

  setLoop(lp: 'list' | 'signal' | 'random' = 'list') {
    this.loop = lp;
  }

  setProgress(o: any) {
    this.progress = o;
  }
}

const store = new PlayerStore();

export default store;
