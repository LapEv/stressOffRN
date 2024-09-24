import { TIMER_START, TIMER_STOP, TICK } from '../types';

export const timerStart = (timerInfo) => {
  // console.log('timerStart = ', timerInfo);
  return {
    type: TIMER_START,
    payload: timerInfo,
  };
};

export const timerStop = (timerInfo) => {
  // console.log('timerStop = ', timerInfo);
  return {
    type: TIMER_STOP,
    payload: timerInfo,
  };
};

export const tick = (timerInfo) => {
  // console.log('tick = ', timerInfo);
  return {
    type: TICK,
    payload: timerInfo,
  };
};
