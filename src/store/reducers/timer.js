import { TIMER_START, TIMER_STOP, TICK } from '../types';

const initialState = {
  isOn: false,
  time: 0,
  selectedTime: 0,
};

export const timerReducer = (state = initialState, action) => {
  switch (action.type) {
    case TIMER_START:
      // console.log('TIMER_START reducer = ', action);
      return {
        ...state,
        isOn: true,
        offset: action.offset,
        time: action.offset - action.time,
        interval: action.interval,
      };

    case TIMER_STOP:
      // console.log('TIMER_STOP reducer = ', action);
      // console.log('====================');
      clearInterval(state.interval);
      return {
        ...initialState,
      };

    case TICK:
      // console.log('TICK reducer = ', action);
      return {
        ...state,
        time: state.offset - action.time,
        // offset: action.time,
      };
    default:
      return state;
  }
};
