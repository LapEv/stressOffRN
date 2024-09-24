import store from '../../store/index';
import {ChangeStateMusic} from '../../store/actions/music';
import {ClearSound} from '../../store/actions/sounds';
import {ChangeCurrentMixPlay} from '../../store/actions/favorites';
import {ToggleMusicControl} from '../../store/actions/sounds';
import {modalShow} from '../../store/actions/modal';
import MusicControl from 'react-native-music-control';

export function ClearSoundList() {
  const language = store.getState().language;
  store.dispatch(
    ChangeCurrentMixPlay({
      name: language.Messages.currentMix,
      id: 0,
    }),
  ),
    store.dispatch(ClearSound({})),
    store.dispatch(
      ChangeStateMusic({
        id: 0,
        playing: false,
        use: false,
        startApp: false,
      }),
    ),
    store.dispatch(modalShow({show: false}));
  store.getState().sound.musicControl ? MusicControl.stopControl() : null;
  store.dispatch(ToggleMusicControl({musicControl: true}));
}
