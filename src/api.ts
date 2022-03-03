import axios from 'axios';

const API = 'http://faforever.eqistu.cn/';

export const getSid = () => {
  return axios.get('/sid', {
    baseURL: API,
  });
};

export const getCriteria = () => {
  return axios.get('/criteria', {
    baseURL: API,
  });
};

export const getSongs = () => {
  return axios.get('/songs', {
    baseURL: API,
  });
};
export const getPicUrl = (album_name: string, album_artist_name: string) => {
  return `http://magict.cn:5000/webapi/AudioStation/cover.cgi?api=SYNO.AudioStation.Cover&version=3&method=getcover&album_name=${album_name}&album_artist_name=${album_artist_name}&library=all&_sid=${global.sid}`;
};

export const getDownloadUrl = (id: string) => {
  return `https://magict.cn:5001/webapi/AudioStation/stream.cgi?api=SYNO.AudioStation.Stream&method=stream&version=1&id=${id}&_sid=${global.sid}&ext=.mp3`;
};
