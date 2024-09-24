import {
  ADD_SOUND,
  REMOVE_SOUND,
  TOGGLE_ALL_SOUND,
  TOGGLE_PLAY_SOUND,
  CLEAR_SOUND,
  TOGGLE_START_SOUND,
  TOGGLE_SOUND_VOLUME,
  ADD_FAVORITES_SOUND,
  TOGGLE_MUSIC_CONTROL,
  TOOGLE_BOOKED_SOUND,
} from '../types';

const initialState = {
  mixedSound: [],
  playAll: true,
  soundStart: false,
  startApp: true,
  musicControl: false,
};

export const soundReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_SOUND:
      return {
        ...state,
        mixedSound: [{...action.payload}, ...state.mixedSound],
        soundStart: true,
        startApp: false,
      };
    case TOGGLE_ALL_SOUND:
      const playAll = action.payload.playAll;
      return {
        ...state,
        playAll,
        startApp: false,
      };
    case TOGGLE_PLAY_SOUND:
      let playItems = 0;
      const mixedSound = state.mixedSound.map(sound => {
        if (sound.id === action.payload.id) {
          sound.playing = !sound.playing;
        }

        if (sound.playing) playItems++;
        return sound;
      });
      return {
        ...state,
        mixedSound,
        startApp: false,
      };
    case TOGGLE_SOUND_VOLUME:
      const mixedSoundVolume = state.mixedSound.map(sound => {
        if (sound.id === action.payload.id) {
          sound.volume = action.payload.volume;
        }
        return sound;
      });
      return {
        ...state,
        mixedSoundVolume,
        startApp: false,
      };

    case REMOVE_SOUND:
      return {
        ...state,
        mixedSound: state.mixedSound.filter(
          value => value.id !== action.payload.id,
        ),
      };
    case CLEAR_SOUND:
      return {
        ...state,
        mixedSound: [],
        playAll: true,
        startApp: false,
      };
    case TOGGLE_START_SOUND:
      const soundStart = action.payload.soundStart;
      return {
        ...state,
        soundStart,
      };
    case ADD_FAVORITES_SOUND:
      return {
        ...state,
        ...action.payload,
      };
    case TOGGLE_MUSIC_CONTROL:
      return {
        ...state,
        ...action.payload,
      };
    case TOOGLE_BOOKED_SOUND:
      const mixedSoundBooked = state.mixedSound.map(value => {
        if (value.id === action.payload.id) {
          value.booked = action.payload.booked;
          return value;
        }
      });
      return {
        ...state,
        mixedSoundBooked,
      };
    default:
      return state;
  }
};
