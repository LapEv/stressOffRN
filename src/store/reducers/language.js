import {LANGUAGE_CURRENT, CREATE_LANGUAGE_CATEGORY} from '../types';
import {LANGUAGE} from '../../language';

const initialState = [];

export const languageReducer = (state = initialState, action) => {
  switch (action.type) {
    case LANGUAGE_CURRENT:
      let currentLanguage;
      Object.keys(LANGUAGE).find(key => {
        if (key === action.payload._name) {
          currentLanguage = LANGUAGE[key];
        }
      });
      action.payload._categorySounds
        ? (currentLanguage.categorySounds = action.payload._categorySounds)
        : null;
      action.payload._categoriesMusic
        ? (currentLanguage.categoryMusics = action.payload._categoriesMusic)
        : null;
      action.payload._categoryFavorites
        ? (currentLanguage.categoryFavorites =
            action.payload._categoryFavorites)
        : null;
      return {
        ...state,
        ...currentLanguage,
      };
    case CREATE_LANGUAGE_CATEGORY:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};
