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
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {modalShowMessage} from '../store/actions/modalMessage';
import {THEME} from '../theme';

export const ModalMessage = () => {
  const width = useWindowDimensions().width;
  const height = useWindowDimensions().height;
  const modal = useSelector(state => state.modalMessage);
  const [modalVisible, setModalVisible] = useState(false);
  const theme = useSelector(state => state.theme);

  const dispatch = useDispatch();
  const response = () => {
    dispatch(modalShowMessage({show: false}));
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
              minHeight: 350,
              maxHeight: height * 0.5,
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
              <ScrollView
                style={styles.modalTextContainer}
                contentContainerStyle={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingBottom: 15,
                }}>
                <Text
                  style={[
                    THEME.TEXT_FONT4,
                    {color: theme.TEXT_COLOR, textAlign: 'center'},
                  ]}>
                  {modal.message}
                </Text>
              </ScrollView>
              <View style={styles.modalBottomContainer}>
                <View style={styles.modalButtonContainer}>
                  <TouchableOpacity
                    style={[
                      styles.controlItemAddContainer,
                      {backgroundColor: theme.BACKGROUNDCOLOR},
                    ]}
                    onPress={response}>
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
    paddingTop: 15,
    paddingLeft: 15,
    paddingRight: 15,
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
    marginTop: 10,
    marginBottom: 20,
  },
});
