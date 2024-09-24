import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
  Modal,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import {THEME} from '../theme';
import {individualStart} from '../store/actions/individualTimer';
import DateTimePicker from '@react-native-community/datetimepicker';

export const TimePicker = () => {
  const [show, setShow] = useState(false);
  const [time, setTime] = useState(new Date('2021-10-22T00:00:00'));
  const theme = useSelector(state => state.theme);
  const language = useSelector(state => state.language);
  const individualTimer = useSelector(state => state.individualTimer);
  const dispatch = useDispatch();

  useEffect(() => {
    individualTimer.individual
      ? (setShow(true), dispatch(individualStart({individual: false})))
      : null;
  }, [individualTimer.individual]);

  const timerStart = duration => {
    const interval = setInterval(() => {
      dispatch({
        type: 'TICK',
        time: Date.now(),
      });
    }, 1000);
    dispatch({
      type: 'TIMER_START',
      offset: Date.now() + duration,
      time: Date.now() + 1000,
      interval,
    });
  };

  const onChange = (event, selectedTime) => {
    const offsetHours = selectedTime
      ? Math.abs(selectedTime.getTimezoneOffset() / 60)
      : null;
    selectedTime
      ? (setShow(Platform.OS === 'ios'),
        timerStart(
          (selectedTime.getHours() - offsetHours) * 3600000 +
            selectedTime.getMinutes() * 60000,
        ))
      : setShow(Platform.OS === 'ios');
  };

  const onChangeIos = (event, selectedTime) => {
    selectedTime ? setTime(selectedTime) : null;
  };

  const SetTimerIos = () => {
    timerStart(time.getHours() * 3600000 + time.getMinutes() * 60000);
    setShow(false);
  };

  return (
    <View>
      {show && Platform.OS === 'android' && (
        <DateTimePicker
          testID="dateTimePicker"
          value={time}
          mode={'time'}
          timeZoneOffsetInMinutes={0}
          is24Hour={true}
          display="default"
          onChange={onChange}
        />
      )}
      {show && Platform.OS === 'ios' && (
        <Modal
          animationType="fade"
          transparent={true}
          visible={show}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}>
          <View
            style={{
              width: '100%',
              height: '100%',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
            }}>
            <LinearGradient
              colors={theme.BACKGROUNDCOLOR_LG}
              style={[
                styles.modalView,
                {
                  backgroundColor: theme.BACKGROUNDCOLOR,
                  justifyContent: 'center',
                  alignItems: 'center',
                  textAlign: 'center',
                },
              ]}>
              <DateTimePicker
                testID="dateTimePicker"
                value={time}
                mode={'time'}
                is24Hour={true}
                display="spinner"
                onChange={onChangeIos}
                textColor="white"
                style={{
                  width: 250,
                  height: 180,
                }}
              />
              <View style={styles.BottomContainer}>
                <View style={styles.ButtonContainer}>
                  <TouchableOpacity
                    style={[
                      styles.controlItemAddContainer,
                      {backgroundColor: theme.BACKGROUNDCOLOR},
                    ]}
                    onPress={() => setShow(false)}>
                    <Text
                      style={[
                        THEME.TITLE_FONT2,
                        {color: theme.TEXT_COLOR, textAlign: 'center'},
                      ]}>
                      {language.timer.buttonNo}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.controlItemAddContainer,
                      {backgroundColor: theme.BACKGROUNDCOLOR},
                    ]}
                    onPress={SetTimerIos}>
                    <Text
                      style={[
                        THEME.TITLE_FONT2,
                        {color: theme.TEXT_COLOR, textAlign: 'center'},
                      ]}>
                      {language.timer.buttonYes}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </LinearGradient>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
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
  BottomContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  ButtonContainer: {
    width: '80%',
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
