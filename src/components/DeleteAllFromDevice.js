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
import {
  updateSoundsLocation,
  updateMusicsLocation,
} from './function/FirebaseFunction';
import {UpdateSoundsDB, UpdateMusicsDB} from '../store/actions/db.js';
import {CheckFileSize, FileSizeToString} from './function/FileFunction';
const RNFS = require('react-native-fs');
import {CONST} from '../const';
import store from '../store/index';

export const DeleteAllFromDevice = () => {
  const user = store.getState().user;
  const language = useSelector(state => state.language);
  const widthDevice = useWindowDimensions().width;
  const height = useWindowDimensions().height;
  const theme = useSelector(state => state.theme);
  const progressBar = useSelector(state => state.progressBar);
  const [modalVisible, setModalVisible] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const soundDB = useSelector(state => state.db.sounds);
  const musicDB = useSelector(state => state.db.musics);

  const dispatch = useDispatch();

  useEffect(() => {
    progressBar.showDeleteAll !== modalVisible
      ? setModalVisible(progressBar.showDeleteAll)
      : false;
    progressBar.showDeleteAll ? DeleteAllFiles() : null;
  }, [progressBar.showDeleteAll]);

  const CheckDB = async (name, id, category) => {
    category === CONST.db.musics
      ? (await updateMusicsLocation('cloud', id, '', user.uid),
        store.dispatch(
          UpdateMusicsDB({name: name, sound: '', location: 'cloud'}),
        ))
      : (await updateSoundsLocation('cloud', id, '', user.uid),
        store.dispatch(
          UpdateSoundsDB({name: name, sound: '', location: 'cloud'}),
        ));
  };

  const endDelete = async (countFiles, total) => {
    dispatch(
      progressBarShow({
        showDeleteAll: false,
      }),
    );
    const sizeFiles = FileSizeToString(total);
    language.modalMessages.endDeleteAll.message =
      language.modalMessages.endDeleteAll.message2 +
      countFiles +
      language.modalMessages.endDeleteAll.message3 +
      sizeFiles;
    dispatch(modalShowMessage(language.modalMessages.endDeleteAll));
    setDownloadProgress(0);
  };

  const DeleteFunction = async (value, countFiles, allCount, total) => {
    try {
      RNFS.unlink(value.sound)
        .then(() => {
          CheckDB(value.name, value.id, value.status);
          // countFiles >= allCount ? endDelete(countFiles, total) : null;
          // setDownloadProgress(Math.ceil((countFiles / allCount) * 100));
          return true;
        })
        .catch(err => {
          console.log(err.message);
          return false;
        });
    } catch (e) {
      console.error(e);
    }
  };

  const DeleteAllFiles = async () => {
    const arrSoundsToDelete = soundDB.filter(
      value => value.location === 'device',
    );
    const arrMusicsToDelete = musicDB
      .filter(value => value.location === 'device')
      .map(value => {
        value.status = CONST.db.musics;
        return value;
      });
    const arrAllSounds = arrSoundsToDelete.concat(arrMusicsToDelete);

    if (arrAllSounds.length <= 0) {
      dispatch(
        progressBarShow({
          showDeleteAll: false,
        }),
      );
      dispatch(modalShowMessage(language.modalMessages.noFilesToDelete));
      setDownloadProgress(0);
      return;
    }

    let countFiles = 1;
    let total = 0;
    arrAllSounds.forEach(async value => {
      const size = await CheckFileSize(value.sound);
      size
        ? ((total += size),
          DeleteFunction(value, countFiles, arrAllSounds.length, total))
        : CheckDB(value.name, value.id, value.status);
      setDownloadProgress(Math.ceil((countFiles / arrAllSounds.length) * 100));
      countFiles >= arrAllSounds.length
        ? endDelete(countFiles, total)
        : countFiles++;
    });
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
