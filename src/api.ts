import axios from 'axios';

const API = 'http://faforever.eqistu.cn/';

export const getSid = () => {
  return axios.get(
    '/auth.cgi?api=SYNO.API.Auth&version=3&method=login&account=cyfwlp&passwd=5267373&session=AudioStation&format=cookie',
    {
      baseURL: 'http://magict.cn:5000/webapi',
    },
  );
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

export const getLrc = (title: string) => {
  return axios.get('/lrc', {
    baseURL: API,
    params: {
      title,
    },
  });
};

export const getLike = (uid: string) => {
  return axios.get('/like', {
    baseURL: API,
    headers: {
      useruuid: uid,
    },
  });
};

export const like = (path: string, uid: string) => {
  return axios.post(
    '/like',
    {
      path,
    },
    {
      baseURL: API,
      headers: {
        useruuid: uid,
      },
    },
  );
};

export const getRandom = () => {
  return axios.get('/random', {
    baseURL: API,
  });
};

export const getPicUrl = (album_name: string, album_artist_name: string) => {
  return `http://magict.cn:5000/webapi/AudioStation/cover.cgi?api=SYNO.AudioStation.Cover&version=3&method=getcover&album_name=${album_name}&album_artist_name=${album_artist_name}&library=all&_sid=${global.sid}`;
};

export const getDownloadUrl = (id: string) => {
  return `https://magict.cn:5001/webapi/AudioStation/stream.cgi?api=SYNO.AudioStation.Stream&method=stream&version=1&id=${id}&_sid=${global.sid}&ext=.mp3`;
};
