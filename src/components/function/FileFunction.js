import store from '../../store/index';
const RNFS = require('react-native-fs');

export const CheckFile = async item => {
  return new Promise((resolve, reject) => {
    RNFS.exists(item)
      .then(result => resolve(result))
      .catch(err => reject(err));
  });
};

export const CheckFileSize = async item => {
  return new Promise((resolve, reject) => {
    RNFS.stat(item)
      .then(result => {
        resolve(result.size);
      })
      .catch(err => {
        console.log('err = ', err);
        resolve(false);
      });
  });
};

export const FileSizeToString = item => {
  return item / 1000 < 1000
    ? `${Math.trunc(item / 1000)} Kb.`
    : item / 1000 < 1000000
    ? `${(item / 1000000).toFixed(2)} Mb.`
    : `${(item / 1000000000).toFixed(2)} Gb.`;
};

export const SoundSizes = async () => {
  const soundDB = store.getState().db.sounds;
  const arrSoundsOnDevice = soundDB.filter(
    value => value.location === 'device',
  );
  let total = 0;
  await Promise.all(
    arrSoundsOnDevice.map(async file => {
      total += await CheckFileSize(file.sound);
    }),
  );
  return total;
};

export const MusicsSizes = async () => {
  const musicsDB = store.getState().db.musics;
  const arrMusicsOnDevice = musicsDB.filter(
    value => value.location === 'device',
  );
  let total = 0;
  await Promise.all(
    arrMusicsOnDevice.map(async file => {
      total += await CheckFileSize(file.sound);
    }),
  );
  return total;
};
