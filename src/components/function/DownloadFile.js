const RNFS = require('react-native-fs');
import {CONST} from '../../const';
import {GetURL} from './FirebaseFunction';

export const DownloadFile = async (storage, name, extension) => {
  return new Promise(async (resolve, reject) => {
    const url = await GetURL(storage);

    const DEST = RNFS.DocumentDirectoryPath;
    const fileName = '/' + name + extension;
    const uri = DEST + fileName;
    RNFS.downloadFile({
      fromUrl: url,
      toFile: uri,
      headers: {
        Accept: 'application/json',
      },
      progressDivider: 10,
      // progress: downloadProgress,
    })
      .promise.then(response => {
        if (response.statusCode == 200) {
          console.log('uri = ', CONST.file + uri);
          resolve(CONST.file + uri);
        } else {
          console.log('SERVER ERROR');
        }
      })
      .catch(err => {
        console.log('Error download file: ', err);
        resolve('');
      });
  });
};
