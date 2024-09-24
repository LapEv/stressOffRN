import {
  ADD_FAVORITES_MIXES,
  LOAD_FAVORITES_MIXES,
  EDIT_FAVORITES_MIXES,
  REMOVE_FAVORITES_MIXES,
  REMOVE_FAVORITES_ALL_MIXES,
  CHANGE_CURRENT_MIX_PLAY,
} from '../types';

export const AddFavoritesMixes = mix => {
  return {
    type: ADD_FAVORITES_MIXES,
    payload: mix,
  };
};

export const LoadFavoritesMixes = mix => {
  return {
    type: LOAD_FAVORITES_MIXES,
    payload: mix,
  };
};

export const EditFavoritesMixes = mix => {
  return {
    type: EDIT_FAVORITES_MIXES,
    payload: mix,
  };
};

export const RemoveFavoritesMixes = mix => {
  return {
    type: REMOVE_FAVORITES_MIXES,
    payload: mix,
  };
};

export const RemoveFavoritesAllMixes = mix => {
  return {
    type: REMOVE_FAVORITES_ALL_MIXES,
    payload: mix,
  };
};

export const ChangeCurrentMixPlay = mix => {
  return {
    type: CHANGE_CURRENT_MIX_PLAY,
    payload: mix,
  };
};
