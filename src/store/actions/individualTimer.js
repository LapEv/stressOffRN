import { INDIVIDUAL } from '../types';

export const individualStart = (timerInfo) => {
  return {
    type: INDIVIDUAL,
    payload: timerInfo,
  };
};
