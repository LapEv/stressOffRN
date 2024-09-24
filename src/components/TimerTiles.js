import React from 'react';
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {BoxShadow} from 'react-native-shadow';
import {individualStart} from '../store/actions/individualTimer';
import {THEME} from '../theme';
import {LabelConstants} from '../labelConstants';
import {CONST} from '../const';

export const TimerTiles = ({id, title, duration}) => {
  const theme = useSelector(state => state.theme);
  const language = useSelector(state => state.language);
  const width = useWindowDimensions().width;

  const dispatch = useDispatch();

  const timerStart = duration => {
    if (title !== language.timer.individual) {
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
    } else {
      dispatch(individualStart({individual: true}));
    }
  };

  const shadowOpt = {
    width: (width / 2) * 0.8,
    height: 60,
    color: theme.BACKGROUNDCOLOR,
    border: 5,
    radius: 15,
    opacity: 0.7,
    x: 0,
    y: 0,
    style: {
      margin: 20,
      borderRadius: 15,
      borderColor: theme.borderColor,
      borderWidth: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  };

  return (
    <BoxShadow setting={shadowOpt}>
      <TouchableOpacity
        style={[styles.container, {width: width / CONST.timer.numberColumns}]}
        onPress={() => timerStart(duration)}>
        <Text style={[{color: theme.TEXT_COLOR}, THEME.TITLE_FONT2]}>
          {title}
        </Text>
      </TouchableOpacity>
    </BoxShadow>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
});
