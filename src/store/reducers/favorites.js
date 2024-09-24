import {
  ADD_FAVORITES_MIXES,
  LOAD_FAVORITES_MIXES,
  EDIT_FAVORITES_MIXES,
  REMOVE_FAVORITES_MIXES,
  CHANGE_CURRENT_MIX_PLAY,
  REMOVE_FAVORITES_ALL_MIXES,
} from '../types';

import {LANGUAGE} from '../../language';

const initialState = {
  currentMix: LANGUAGE.RUS.currentMix,
  currentId: 0,
  favorites: [],
};

export const favoritesReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_FAVORITES_MIXES:
      return {
        ...state,
        favorites: [...state.favorites, {...action.payload}],
        currentMix: action.payload.name,
        currentId: action.payload.id,
      };
    case LOAD_FAVORITES_MIXES:
      return {
        ...state,
        favorites: action.payload,
      };
    case EDIT_FAVORITES_MIXES:
      const favoritesMixes = state.favorites.map(mixes => {
        if (mixes.id === action.payload.id) {
          mixes.name = action.payload.name;
        }
        return mixes;
      });
      return {
        ...state,
        favoritesMixes,
        currentMix:
          state.currentId === action.payload.id
            ? action.payload.name
            : state.currentMix,
      };
    case REMOVE_FAVORITES_MIXES:
      const favoritesFilter = state.favorites.filter(
        value => value.id !== action.payload.id,
      );
      let i = 1;
      const reindex = favoritesFilter.map(value => {
        value.id = i;
        i++;
        return value;
      });
      return {
        ...state,
        favorites: reindex,
        currentMix:
          state.currentId === action.payload.id
            ? action.payload.emptyMixName
            : state.currentMix,
      };
    case REMOVE_FAVORITES_ALL_MIXES:
      return {
        ...state,
        favorites: [],
        currentMix: action.payload.emptyMixName,
      };

    case CHANGE_CURRENT_MIX_PLAY:
      return {
        ...state,
        currentMix: action.payload.name,
        currentId: action.payload.id,
      };

    default:
      return state;
  }
};
