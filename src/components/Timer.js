import React, {useEffect, useState} from 'react';
import {NativeModules} from 'react-native';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  useWindowDimensions,
  BackHandler,
  Switch,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {BoxShadow} from 'react-native-shadow';
import {timerStop} from '../store/actions/timer';
import {THEME} from '../theme';
import {CONST} from '../const';

export const Timer = ({screen, on}) => {
  const [time, setTime] = useState(0);
  const [show, setShow] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const timer = useSelector(state => state.timer);
  const language = useSelector(state => state.language);
  const width = useWindowDimensions().width;

  function format(time, showMsecs) {
    let msecs = time % 1000;

    if (msecs < 10) {
      msecs = `00${msecs}`;
    } else if (msecs < 100) {
      msecs = `0${msecs}`;
    }

    let seconds = Math.floor(time / 1000);
    let minutes = Math.floor(time / 60000);
    let hours = Math.floor(time / 3600000);
    seconds = seconds - minutes * 60;
    minutes = minutes - hours * 60;
    let formatted;
    if (showMsecs) {
      formatted = `${hours < 10 ? 0 : ''}${hours}:${
        minutes < 10 ? 0 : ''
      }${minutes}:${seconds < 10 ? 0 : ''}${seconds}:${msecs}`;
    } else {
      formatted = `${hours < 10 ? 0 : ''}${hours}:${
        minutes < 10 ? 0 : ''
      }${minutes}:${seconds < 10 ? 0 : ''}${seconds}`;
    }

    return formatted;
  }

  useEffect(() => {
    timer.isOn && !on ? StopTimer() : null;
  }, [on]);

  useEffect(() => {
    setTime(format(timer.time, false));
    setShow(timer.isOn);
    if (timer.time <= 0 && timer.isOn) {
      StopTimer();
      isEnabled ? NativeModules.RNExitApp.exitApp() : null;
    }
  }, [timer]);

  const dispatch = useDispatch();
  const StopTimer = () => {
    dispatch(
      timerStop({
        type: 'TIMER_STOP',
      }),
    );
  };

  const theme = useSelector(state => state.theme);

  const shadowOpt = {
    width: (width / 2) * 0.8,
    height: 60,
    color: theme.BACKGROUNDCOLOR,
    border: 5,
    radius: 15,
    opacity: 0.5,
    x: 0,
    y: 0,
    style: {
      margin: 30,
      borderRadius: 15,
      justifyContent: 'center',
      alignItems: 'center',
      borderColor: theme.borderColor,
      borderWidth: 1,
      borderRadius: 15,
    },
  };

  if (screen === 'Player') {
    return (
      show && (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 10,
          }}>
          <View style={styles.container}>
            <Text style={[THEME.TEXT_FONT3, {color: theme.TEXT_COLOR}]}>
              {time}
            </Text>
          </View>
        </View>
      )
    );
  }

  if (screen !== 'Player') {
    return (
      show && (
        <View
          style={{
            marginTop: 10,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={[
              styles.container2,
              {
                backgroundColor: theme.BACKGROUNDCOLOR,
                borderColor: theme.TEXT_COLOR,
              },
            ]}>
            <Text style={[styles.text2, {color: theme.TEXT_COLOR}]}>
              {time}
            </Text>
          </View>
          <View style={[styles.item, {width: width}]}>
            <Text style={[THEME.TEXT_FONT4, {color: theme.TEXT_COLOR}]}>
              {language.timer.timerExitApp}
            </Text>
            <Switch
              trackColor={{
                false: theme.BACKGROUNDCOLOR,
                true: theme.CHECK_COLOR,
              }}
              thumbColor={isEnabled ? theme.ITEM_COLOR : theme.ITEM_COLOR}
              ios_backgroundColor={theme.BACKGROUNDCOLOR}
              onValueChange={() =>
                setIsEnabled(previousState => !previousState)
              }
              value={isEnabled}
            />
          </View>
          <TouchableOpacity
            style={{
              alignItems: 'center',
              justifyContent: 'flex-start',
              width: width / CONST.timer.numberColumns,
            }}
            onPress={StopTimer}>
            <BoxShadow setting={shadowOpt}>
              <Text style={[{color: theme.TEXT_COLOR}, THEME.TITLE_FONT2]}>
                {language.timer.stopTimerTitle}
              </Text>
            </BoxShadow>
          </TouchableOpacity>
        </View>
      )
    );
  }
};

const styles = StyleSheet.create({
  container: {
    width: 100,
    marginTop: 10,
    alignItems: 'center',
  },
  container2: {
    padding: 15,
    borderRadius: 15,
    width: 200,
    alignItems: 'center',
    borderColor: 'white',
    borderWidth: 1,
  },
  text2: {
    fontSize: 25,
    marginLeft: 7,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 25,
    paddingLeft: 15,
    paddingRight: 15,
  },
});
