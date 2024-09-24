import {ADD_USER_DATA, UPDATE_USER_DATA} from '../types';

export const addUserData = data => {
  return {
    type: ADD_USER_DATA,
    payload: data,
  };
};

export const updateUserData = data => {
  return {
    type: UPDATE_USER_DATA,
    payload: data,
  };
};
