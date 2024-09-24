import {
  ADD_SOUND,
  REMOVE_SOUND,
  TOGGLE_ALL_SOUND,
  TOGGLE_PLAY_SOUND,
  TOGGLE_SOUND_VOLUME,
  CLEAR_SOUND,
  TOGGLE_START_SOUND,
  TOGGLE_MUSIC_CONTROL,
  ADD_FAVORITES_SOUND,
  TOOGLE_BOOKED_SOUND,
} from '../types';

export const AddFavoritesSound = sound => {
  return {
    type: ADD_FAVORITES_SOUND,
    payload: sound,
  };
};

export const AddSound = sound => {
  return {
    type: ADD_SOUND,
    payload: sound,
  };
};

export const RemoveSound = sound => {
  return {
    type: REMOVE_SOUND,
    payload: sound,
  };
};

export const ToggleAllSound = sound => {
  return {
    type: TOGGLE_ALL_SOUND,
    payload: sound,
  };
};

export const TogglePlaySound = sound => {
  return {
    type: TOGGLE_PLAY_SOUND,
    payload: sound,
  };
};

export const ToggleSoundVolume = sound => {
  return {
    type: TOGGLE_SOUND_VOLUME,
    payload: sound,
  };
};

export const ClearSound = sound => {
  return {
    type: CLEAR_SOUND,
    payload: sound,
  };
};

export const ToggleStartSound = sound => {
  return {
    type: TOGGLE_START_SOUND,
    payload: sound,
  };
};

export const ToggleMusicControl = sound => {
  return {
    type: TOGGLE_MUSIC_CONTROL,
    payload: sound,
  };
};

export const ToggleBookedSound = sound => {
  return {
    type: TOOGLE_BOOKED_SOUND,
    payload: sound,
  };
};
