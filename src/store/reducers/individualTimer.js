import { INDIVIDUAL } from '../types';

const initialState = {
  individual: false,
};

export const individualTimerReducer = (state = initialState, action) => {
  switch (action.type) {
    case INDIVIDUAL:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};
