import { MODAL_SHOW } from '../types';

export const modalShow = (modalInfo) => {
  return {
    type: MODAL_SHOW,
    payload: modalInfo,
  };
};
