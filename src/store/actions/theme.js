import { THEME_CURRENT } from '../types';

export const ChangeTheme = (theme) => {
  return async (dispatch) => {
    dispatch({
      type: THEME_CURRENT,
      payload: theme,
    });
  };
};
