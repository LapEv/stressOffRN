import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  useWindowDimensions,
  TouchableOpacity,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {FloatLabelInput} from './ui/FloatLabelInput';
import {
  AddFavoriteMix,
  EditFavoriteMix,
  RemoveFavoriteMix,
  RemoveFavoriteAllMix,
} from './function/FavoriteMixesFunction';
import {DeleteFromDevice} from './function/DeleteFromDevice';
import {ClearSoundList} from './function/PlayerFunction';
import {modalShow} from '../store/actions/modal';
import {ToggleMusicControl} from '../store/actions/sounds';
import {THEME} from '../theme';
import {progressBarShow} from '../store/actions/progressBar';
import RNExitApp from 'react-native-exit-app';
import MusicControl from 'react-native-music-control';

export const ModalAlert = () => {
  const language = useSelector(state => state.language);
  const theme = useSelector(state => state.theme);
  const width = useWindowDimensions().width;
  const height = useWindowDimensions().height;
  const modal = useSelector(state => state.modal);
  const favorites = useSelector(state => state.favorites);
  const [modalVisible, setModalVisible] = useState(false);
  const [input, setInput] = useState('');
  const musicControl = useSelector(state => state.sound.musicControl);

  const dispatch = useDispatch();
  const response = value => {
    !value
      ? dispatch(modalShow({show: false}))
      : (modal.typeMessage === language.modalMessages.clearSoundList.typeMessage
          ? ClearSoundList()
          : null,
        modal.typeMessage === language.modalMessages.addFavoriteMix.typeMessage
          ? AddFavoriteMix(
              favorites.favorites.length + 1,
              input,
              modal.category,
            )
          : null,
        modal.typeMessage === language.modalMessages.editFavoriteMix.typeMessage
          ? EditFavoriteMix(modal.id, input)
          : null,
        modal.typeMessage ===
        language.modalMessages.removeFavoriteMix.typeMessage
          ? RemoveFavoriteMix(modal.id, modal.name)
          : null,
        modal.typeMessage ===
        language.modalMessages.removeFavoriteAllMix.typeMessage
          ? RemoveFavoriteAllMix(modal.id)
          : null,
        modal.typeMessage ===
        language.modalMessages.downloadFromCloud.typeMessage
          ? (dispatch(
              progressBarShow({
                showDownload: true,
                storage: modal.storage,
                name: modal.name,
                category: modal.category,
                id: modal.id,
              }),
            ),
            dispatch(modalShow({show: false})))
          : null,
        modal.typeMessage ===
        language.modalMessages.deleteFromDevice.typeMessage
          ? DeleteFromDevice(modal.sound, modal.id, modal.name, modal.category)
          : null,
        modal.typeMessage ===
        language.modalMessages.deleteAllFromDevice.typeMessage
          ? (dispatch(
              progressBarShow({
                showDeleteAll: true,
              }),
            ),
            dispatch(modalShow({show: false})))
          : null,
        modal.typeMessage === language.modalMessages.exitApp.typeMessage
          ? (dispatch(modalShow({show: false})),
            musicControl ? MusicControl.stopControl() : null,
            dispatch(ToggleMusicControl({musicControl: true})),
            RNExitApp.exitApp())
          : null);
  };

  useEffect(() => {
    modal.show !== modalVisible ? setModalVisible(modal.show) : false;
  }, [modal]);

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
            width: width,
            height: height,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}>
          <View
            style={{
              width: width * 0.9,
              height: 350,
              top: height / 2 - 350 / 2,
              left: (width * 0.1) / 2,
              position: 'absolute',
            }}>
            <LinearGradient
              colors={theme.BACKGROUNDCOLOR_LG}
              style={[
                styles.modalView,
                {backgroundColor: theme.BACKGROUNDCOLOR},
              ]}>
              <View
                style={[
                  styles.modalTitleContainer,
                  {backgroundColor: theme.BACKGROUNDCOLOR},
                ]}>
                <Text style={[THEME.TITLE_FONT, {color: theme.TEXT_COLOR}]}>
                  {modal.title}
                </Text>
              </View>
              {modal.typeMessage ===
                language.modalMessages.addFavoriteMix.typeMessage ||
              modal.typeMessage ===
                language.modalMessages.editFavoriteMix.typeMessage ? (
                <View
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <View style={styles.floatingItem}>
                    <FloatLabelInput
                      isPassword={false}
                      label={modal.message}
                      value={input}
                      hintTextColor={theme.NO_ACTIVE}
                      containerStyles={{
                        borderWidth: 1,
                        paddingHorizontal: 10,
                        height: 60,
                        borderColor: theme.CHECK_COLOR,
                        borderRadius: 12,
                      }}
                      onChangeText={setInput}
                    />
                  </View>
                </View>
              ) : (
                <View style={styles.modalTextContainer}>
                  <Text
                    style={[
                      THEME.TEXT_FONT4,
                      {color: theme.TEXT_COLOR, textAlign: 'center'},
                    ]}>
                    {modal.message}
                  </Text>
                </View>
              )}
              <View style={styles.modalBottomContainer}>
                <View style={styles.modalButtonContainer}>
                  {modal.typeMessage !==
                  language.modalMessages.sameNameFound.typeMessage ? (
                    <TouchableOpacity
                      style={[
                        styles.controlItemAddContainer,
                        {backgroundColor: theme.BACKGROUNDCOLOR},
                      ]}
                      onPress={() => response(false)}>
                      <Text
                        style={[
                          THEME.TITLE_FONT2,
                          {color: theme.TEXT_COLOR, textAlign: 'center'},
                        ]}>
                        {modal.buttonCancel}
                      </Text>
                    </TouchableOpacity>
                  ) : null}
                  <TouchableOpacity
                    style={[
                      styles.controlItemAddContainer,
                      {backgroundColor: theme.BACKGROUNDCOLOR},
                    ]}
                    onPress={() => response(true)}>
                    <Text
                      style={[
                        THEME.TITLE_FONT2,
                        {color: theme.TEXT_COLOR, textAlign: 'center'},
                      ]}>
                      {modal.buttonYes}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </LinearGradient>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    position: 'absolute',
  },
  modalView: {
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 10,
    paddingBottom: 15,
  },
  modalTitleContainer: {
    minHeight: 50,
    width: '100%',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 10,
  },
  floatingItem: {
    width: '95%',
    height: 60,
    marginTop: 20,
    marginVertical: 30,
  },
  modalTextContainer: {
    minHeight: 50,
    width: '100%',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalText: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalBottomContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
  },
  modalButtonContainer: {
    width: '60%',
    minHeight: 50,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  controlItemAddContainer: {
    minWidth: 70,
    minHeight: 50,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: THEME.SHADOW_FOR_IOS,
      android: {
        elevation: 15,
      },
    }),
    padding: 10,
  },
});
