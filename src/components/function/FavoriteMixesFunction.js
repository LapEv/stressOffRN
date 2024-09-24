import store from '../../store/index';
import {modalShowMessage} from '../../store/actions/modalMessage';
import {modalShow} from '../../store/actions/modal';
import {ChangeStateMusic} from '../../store/actions/music';
import {ClearSound} from '../../store/actions/sounds';
import {
  AddFavoritesMixes,
  EditFavoritesMixes,
  RemoveFavoritesMixes,
  RemoveFavoritesAllMixes,
} from '../../store/actions/favorites.js';
import {updateFavoritesDB} from './FirebaseFunction';

const CheckForFavoritesName = name => {
  const favorites = store.getState().favorites.favorites;
  const findName = favorites.findIndex(
    value => value.name.trim().toLowerCase() === name.trim().toLowerCase(),
  );
  return findName >= 0 ? true : false;
};

export const CheckForFavoriteContent = () => {
  const StateSound = store.getState().sound;
  const StateMusic = store.getState().music;
  const favorites = store.getState().favorites.favorites;

  const favMusicIdent = favorites.filter(
    value => value.StateMusic.id == StateMusic.id,
  );

  if (favMusicIdent.length <= 0) return false;

  const currentSoundsId = StateSound.mixedSound.map(value => value.id).sort();

  const result = favMusicIdent.find(value => {
    const arrId = value.StateSound.mixedSound.map(id => id.id).sort();
    return JSON.stringify(arrId) === JSON.stringify(currentSoundsId)
      ? value
      : null;
  });
  return result?.name;
};

const dispatchAddFavoritesMix = (id, name, category) => {
  const StateSound = store.getState().sound;
  const StateMusic = store.getState().music;
  StateSound.playAll = true;
  store.dispatch(
    AddFavoritesMixes({
      id: id,
      name: name,
      StateSound,
      StateMusic,
      category: category,
    }),
  );
  store.dispatch(modalShow({show: false}));
};

const dispatchEditFavoritesMix = async (id, name) => {
  store.dispatch(
    EditFavoritesMixes({
      id: id,
      name: name,
    }),
  );
  const favorites = store.getState().favorites.favorites;
  const uid = store.getState().user.uid;
  await updateFavoritesDB(favorites, uid, true);
  store.dispatch(modalShow({show: false}));
};

const dispatchRemoveFavoritesMix = id => {
  const currentId = store.getState().favorites.currentId;
  const _emptyMixName = store.getState().language.Messages.currentMix;
  store.dispatch(
    RemoveFavoritesMixes({
      id: id,
      emptyMixName: _emptyMixName,
    }),
  );
  store.dispatch(modalShow({show: false}));
  currentId === id
    ? (store.dispatch(ClearSound({})),
      store.dispatch(
        ChangeStateMusic({
          id: 0,
          playing: false,
          use: false,
          startApp: false,
        }),
      ))
    : null;
};

const dispatchRemoveFavoritesAllMix = id => {
  const _emptyMixName = store.getState().language.Messages.currentMix;
  store.dispatch(
    RemoveFavoritesAllMixes({
      id: id,
      emptyMixName: _emptyMixName,
    }),
  );
  store.dispatch(modalShow({show: false}));
  store.dispatch(ClearSound({}));
  store.dispatch(
    ChangeStateMusic({
      id: 0,
      playing: false,
      use: false,
      startApp: false,
    }),
  );
};

const dispatchModalMessage = object => {
  store.dispatch(modalShowMessage(object));
};

export function AddFavoriteMix(id, name, category) {
  const language = store.getState().language;
  const result = CheckForFavoritesName(name);
  !result
    ? name.length
      ? dispatchAddFavoritesMix(id, name, category)
      : dispatchModalMessage(language.modalMessages.emptyName)
    : dispatchModalMessage(language.modalMessages.sameNameFound);
}

export function EditFavoriteMix(id, name) {
  const language = store.getState().language;
  const result = CheckForFavoritesName(name);
  !result
    ? name.length
      ? dispatchEditFavoritesMix(id, name)
      : dispatchModalMessage(language.modalMessages.emptyName)
    : dispatchModalMessage(language.modalMessages.sameNameFound);
}

export function RemoveFavoriteMix(id) {
  dispatchRemoveFavoritesMix(id);
}

export function RemoveFavoriteAllMix(id) {
  dispatchRemoveFavoritesAllMix(id);
}
