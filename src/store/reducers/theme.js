import {THEME_CURRENT} from '../types';
import {THEME} from '../../theme';

const initialState = THEME.MAIN_THEME;

export const themeReducer = (state = initialState, action) => {
  switch (action.type) {
    case THEME_CURRENT:
      return {
        ...state,
        ...THEME[action.payload],
      };
    default:
      return state;
  }
};
