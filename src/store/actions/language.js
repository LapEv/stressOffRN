import {LANGUAGE_CURRENT, CREATE_LANGUAGE_CATEGORY} from '../types';

export const ChangeLanguage = language => {
  return async dispatch => {
    dispatch({
      type: LANGUAGE_CURRENT,
      payload: language,
    });
  };
};

export const CreateLanguageCategory = data => {
  // console.log('data = ', data);
  return async dispatch => {
    dispatch({
      type: CREATE_LANGUAGE_CATEGORY,
      payload: data,
    });
  };
};
