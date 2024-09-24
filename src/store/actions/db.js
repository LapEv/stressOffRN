import {DB} from '../../db';
import {
  ADD_SOUND_DB,
  ADD_MUSIC_DB,
  ADD_NOTIFICATIONS_DB,
  LOAD_SOUND_FB,
  LOAD_MUSIC_FB,
  LOAD_SOUND_CATEGORIES_FB,
  LOAD_MUSIC_CATEGORIES_FB,
  LOAD_SOUND_CATEGORIES_DB,
  LOAD_MUSIC_CATEGORIES_DB,
  LOAD_SOUND_DB,
  LOAD_MUSIC_DB,
  LOAD_NOTIFICATIONS_DB,
  UPDATE_SOUND_DB,
  UPDATE_MUSIC_DB,
  UPDATE_NOTIFICATIONS_DB,
  UPDATE_SOUND_STATUS_NEW,
  UPDATE_MUSIC_STATUS_NEW,
  UPDATE_SOUND_BOOKED,
  UPDATE_MUSIC_BOOKED,
} from '../types';

export const AddSoundsDB = data => {
  return {
    type: ADD_SOUND_DB,
    payload: data,
  };
};

export const AddMusicsDB = data => {
  return {
    type: ADD_MUSIC_DB,
    payload: data,
  };
};

// export const AddNotificationsDB = data => {
//   return {
//     type: ADD_NOTIFICATIONS_DB,
//     payload: data,
//   };
// };

export const LoadSoundFromFB = soundDB => {
  return async dispatch => {
    dispatch({
      type: LOAD_SOUND_FB,
      payload: soundDB,
    });
  };
};

export const LoadMusicFromFB = musicDB => {
  return async dispatch => {
    dispatch({
      type: LOAD_MUSIC_FB,
      payload: musicDB,
    });
  };
};

export const LoadSoundCategoriesFromFB = soundCategoriesDB => {
  return async dispatch => {
    dispatch({
      type: LOAD_SOUND_CATEGORIES_FB,
      payload: soundCategoriesDB,
    });
  };
};

export const LoadMusicCategoriesFromFB = musicCategoriesDB => {
  return async dispatch => {
    dispatch({
      type: LOAD_MUSIC_CATEGORIES_FB,
      payload: musicCategoriesDB,
    });
  };
};

export const LoadSoundFromDB = soundDB => {
  return async dispatch => {
    dispatch({
      type: LOAD_SOUND_DB,
      payload: soundDB,
    });
  };
};

export const LoadMusicFromDB = musicDB => {
  return async dispatch => {
    dispatch({
      type: LOAD_MUSIC_DB,
      payload: musicDB,
    });
  };
};

export const LoadSoundCategoriesFromDB = soundCategoriesDB => {
  return async dispatch => {
    dispatch({
      type: LOAD_SOUND_CATEGORIES_DB,
      payload: soundCategoriesDB,
    });
  };
};

export const LoadMusicCategoriesFromDB = musicCategoriesDB => {
  return async dispatch => {
    dispatch({
      type: LOAD_MUSIC_CATEGORIES_DB,
      payload: musicCategoriesDB,
    });
  };
};

export const LoadNotificationsFromDB = notificationsDB => {
  return async dispatch => {
    dispatch({
      type: LOAD_NOTIFICATIONS_DB,
      payload: notificationsDB,
    });
  };
};

export const UpdateSoundsDB = data => {
  return {
    type: UPDATE_SOUND_DB,
    payload: data,
  };
};

export const UpdateMusicsDB = data => {
  return {
    type: UPDATE_MUSIC_DB,
    payload: data,
  };
};

export const UpdateNotificationsDB = data => {
  return {
    type: UPDATE_NOTIFICATIONS_DB,
    payload: data,
  };
};

export const UpdateSoundsStatusDB = data => {
  return {
    type: UPDATE_SOUND_STATUS_NEW,
    payload: data,
  };
};

export const UpdateMusicsStatusDB = data => {
  return {
    type: UPDATE_MUSIC_STATUS_NEW,
    payload: data,
  };
};

export const UpdateSoundsBookedDB = data => {
  return {
    type: UPDATE_SOUND_BOOKED,
    payload: data,
  };
};

export const UpdateMusicsBookedDB = data => {
  return {
    type: UPDATE_MUSIC_BOOKED,
    payload: data,
  };
};
