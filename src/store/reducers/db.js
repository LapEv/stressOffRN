import {
  ADD_SOUND_DB,
  ADD_MUSIC_DB,
  ADD_NOTIFICATIONS_DB,
  LOAD_SOUND_FB,
  LOAD_MUSIC_FB,
  LOAD_SOUND_CATEGORIES_FB,
  LOAD_MUSIC_CATEGORIES_FB,
  LOAD_SOUND_DB,
  LOAD_MUSIC_DB,
  LOAD_SOUND_CATEGORIES_DB,
  LOAD_MUSIC_CATEGORIES_DB,
  LOAD_NOTIFICATIONS_DB,
  UPDATE_SOUND_DB,
  UPDATE_MUSIC_DB,
  UPDATE_NOTIFICATIONS_DB,
  UPDATE_SOUND_STATUS_NEW,
  UPDATE_MUSIC_STATUS_NEW,
  UPDATE_SOUND_BOOKED,
  UPDATE_MUSIC_BOOKED,
} from '../types';

const initialState = {
  sounds: [],
  musics: [],
  soundCategories: [],
  musicCategories: [],
  notifications: [],
};

export const DBReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_SOUND_DB:
      return {
        ...state,
        sounds: [...state.sounds, {...action.payload}],
      };
    case ADD_MUSIC_DB:
      return {
        ...state,
        musics: [...state.musics, {...action.payload}],
      };
    case ADD_NOTIFICATIONS_DB:
      return {
        ...state,
        notifications: [...state.notifications, {...action.payload}],
      };
    case LOAD_SOUND_FB:
      return {
        ...state,
        sounds: action.payload,
      };
    case LOAD_MUSIC_FB:
      return {
        ...state,
        musics: action.payload,
      };
    case LOAD_SOUND_CATEGORIES_FB:
      return {
        ...state,
        soundCategories: action.payload,
      };
    case LOAD_MUSIC_CATEGORIES_FB:
      return {
        ...state,
        musicCategories: action.payload,
      };
    case LOAD_SOUND_DB:
      state.sounds.map(_sound => {
        const updateSound = action.payload.find(
          value => value.name === _sound.name,
        );
        _sound.img = updateSound.img;
        _sound.sound = updateSound.sound;
        _sound.location = updateSound.location;
        _sound.new = updateSound.new;
        _sound.booked = updateSound.booked;
      });
      return {
        ...state,
        sounds: state.sounds,
      };
    case LOAD_MUSIC_DB:
      state.musics.map(_music => {
        const updateMusic = action.payload.find(
          value => value.name === _music.name,
        );
        _music.img = updateMusic.img;
        _music.sound = updateMusic.sound;
        _music.location = updateMusic.location;
        _music.new = updateMusic.new;
        _music.booked = updateMusic.booked;
      });
      return {
        ...state,
        musics: state.musics,
      };
    case LOAD_SOUND_CATEGORIES_DB:
      state.soundCategories.map(_soundCategories => {
        const updateSoundCategories = action.payload.find(
          value => value.name === _soundCategories.category,
        );
        _soundCategories.img = updateSoundCategories.img;
        _soundCategories.img_lt = updateSoundCategories.img_lt;
      });
      return {
        ...state,
        soundCategories: state.soundCategories,
      };
    case LOAD_MUSIC_CATEGORIES_DB:
      state.musicCategories.map(_musicCategories => {
        const updateMusicCategories = action.payload.find(
          value => value.name === _musicCategories.category,
        );
        _musicCategories.img = updateMusicCategories.img;
        _musicCategories.img_lt = updateMusicCategories.img_lt;
      });
      return {
        ...state,
        musicCategories: state.musicCategories,
      };
    case LOAD_NOTIFICATIONS_DB:
      return {
        ...state,
        notifications: action.payload,
      };
    case UPDATE_SOUND_DB:
      const dbSound = state.sounds.map(value => {
        if (value.name === action.payload.name) {
          value.sound = action.payload.sound;
          value.location = action.payload.location;
        }
        return value;
      });
      return {
        ...state,
        sounds: dbSound,
      };
    case UPDATE_MUSIC_DB:
      const dbMusic = state.musics.map(value => {
        if (value.name === action.payload.name) {
          value.sound = action.payload.sound;
          value.location = action.payload.location;
        }
        return value;
      });
      return {
        ...state,
        musics: dbMusic,
      };
    case UPDATE_NOTIFICATIONS_DB:
      const dbNotifications = state.notifications.map(value => {
        if (value.id === action.payload.id) {
          value.unread = false;
        }
        return value;
      });
      return {
        ...state,
        notifications: dbNotifications,
      };
    case UPDATE_SOUND_STATUS_NEW:
      const dbStatusNewSounds = state.sounds.map(value => {
        if (value.name === action.payload.name) {
          value.new = action.payload.new;
        }
        return value;
      });
      return {
        ...state,
        sounds: dbStatusNewSounds,
      };
    case UPDATE_MUSIC_STATUS_NEW:
      const dbStatusNewMusics = state.musics.map(value => {
        if (value.name === action.payload.name) {
          value.new = action.payload.new;
        }
        return value;
      });
      return {
        ...state,
        musics: dbStatusNewMusics,
      };
    case UPDATE_SOUND_BOOKED:
      const dbStatusSoundsBooked = state.sounds.map(value => {
        if (value.id === action.payload.id) {
          value.booked = action.payload.booked;
        }
        return value;
      });
      return {
        ...state,
        sounds: dbStatusSoundsBooked,
      };
    case UPDATE_MUSIC_BOOKED:
      const dbStatusMusicsBooked = state.musics.map(value => {
        if (value.id === action.payload.id) {
          value.booked = action.payload.booked;
        }
        return value;
      });
      return {
        ...state,
        musics: dbStatusMusicsBooked,
      };
    default:
      return state;
  }
};
