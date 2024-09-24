import { PROGRESS_BAR_SHOW } from '../types';

export const progressBarShow = (progressBarInfo) => {
  return {
    type: PROGRESS_BAR_SHOW,
    payload: progressBarInfo,
  };
};
