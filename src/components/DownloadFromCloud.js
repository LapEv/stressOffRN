import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  Modal,
  Animated,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {THEME} from '../theme';
import {progressBarShow} from '../store/actions/progressBar';
import {modalShowMessage} from '../store/actions/modalMessage';
import {UpdateSoundsDB, UpdateMusicsDB} from '../store/actions/db';
import {
  GetURL,
  updateMusicsLocation,
  updateSoundsLocation,
} from './function/FirebaseFunction';
import {CONST} from '../const';

const RNFS = require('react-native-fs');

export const DownloadFromCloud = () => {
  const user = useSelector(state => state.user);
  const language = useSelector(state => state.language);
  const widthDevice = useWindowDimensions().width;
  const height = useWindowDimensions().height;
  const theme = useSelector(state => state.theme);
  const progressBar = useSelector(state => state.progressBar);
  const [modalVisible, setModalVisible] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  const dispatch = useDispatch();

  useEffect(() => {
    progressBar.showDownload !== modalVisible
      ? setModalVisible(progressBar.showDownload)
      : false;
    progressBar.showDownload
      ? DownloadFile(
          progressBar.storage,
          progressBar.name,
          progressBar.category,
          progressBar.id,
        )
      : null;
  }, [progressBar.showDownload]);

  const DownloadFile = async (storage, name, category, id) => {
    const url = await GetURL(storage);

    const DEST = RNFS.DocumentDirectoryPath;
    const fileName = '/' + name + '.aac';
    const uri = DEST + fileName;

    const downloadProgress = response => {
      var percentage = Math.trunc(
        (response.bytesWritten / response.contentLength) * 100,
      );
      setDownloadProgress(percentage);
    };

    RNFS.downloadFile({
      fromUrl: url,
      toFile: uri,
      headers: {
        Accept: 'application/json',
      },
      progressDivider: 10,
      progress: downloadProgress,
    })
      .promise.then(response => {
        if (response.statusCode == 200) {
          setDownloadProgress(100);
        } else {
          console.log('SERVER ERROR');
        }
      })
      .catch(err => {
        console.log('Error download file: ', err);
      });

    category === CONST.db.musics
      ? (await updateMusicsLocation('device', id, uri, user.uid),
        dispatch(UpdateMusicsDB({name: name, sound: uri, location: 'device'})))
      : (await updateSoundsLocation('device', id, uri, user.uid),
        dispatch(UpdateSoundsDB({name: name, sound: uri, location: 'device'})));

    dispatch(
      progressBarShow({
        showDownload: false,
        storage: '',
        name: '',
        category: '',
        id: '',
        title: '',
      }),
    );
    setDownloadProgress(0);
    dispatch(modalShowMessage(language.modalMessages.endDownload));
  };

  return (
    <View
      style={{
        flex: 1,
      }}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View
          style={{
            flex: 1,
            width: widthDevice,
            height: height,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}>
          <View
            style={{
              width: widthDevice * 0.9,
              height: 300,
              top: height / 2 - 350 / 2,
              left: (widthDevice * 0.1) / 2,
              position: 'absolute',
              justifyContent: 'center',
            }}>
            <LinearGradient
              colors={theme.BACKGROUNDCOLOR_LG}
              style={[
                styles.modalView,
                {backgroundColor: theme.BACKGROUNDCOLOR},
              ]}>
              <Text style={[THEME.TITLE_FONT, {color: theme.TEXT_COLOR}]}>
                {language.loading}
              </Text>
              <View style={styles.progressBar}>
                <Animated.View
                  style={
                    ([StyleSheet.absoluteFill],
                    {
                      backgroundColor: theme.CHECK_COLOR,
                      width: `${downloadProgress}%`,
                      height: '100%',
                      borderRadius: 8,
                    })
                  }></Animated.View>
              </View>

              <Text style={[THEME.TEXT_FONT, {color: theme.TEXT_COLOR}]}>
                {downloadProgress}%
              </Text>
            </LinearGradient>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  progressBar: {
    height: 30,
    flexDirection: 'row',
    width: '100%',
    borderWidth: 2,
    borderRadius: 10,
    margin: 20,
  },
  modalView: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 10,
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
