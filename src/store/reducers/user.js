import {ADD_USER_DATA, UPDATE_USER_DATA} from '../types';

const initialState = {
  status: '',
  name: '',
};

export const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_USER_DATA:
      return {
        ...state,
        ...action.payload,
      };

    case UPDATE_USER_DATA:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};
