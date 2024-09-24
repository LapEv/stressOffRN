import store from '../../store/index';
import {modalShow} from '../../store/actions/modal';
import {modalShowMessage} from '../../store/actions/modalMessage';
import {UpdateSoundsDB, UpdateMusicsDB} from '../../store/actions/db.js';
import {updateSoundsLocation, updateMusicsLocation} from './FirebaseFunction';
import {CONST} from '../../const';
const RNFS = require('react-native-fs');

export const DeleteFromDevice = async (filepath, id, name, category) => {
  const language = store.getState().language;
  const user = store.getState().user;

  const updateDB = async () => {
    category === CONST.db.musics
      ? (await updateMusicsLocation('cloud', id, '', user.uid),
        store.dispatch(
          UpdateMusicsDB({name: name, sound: '', location: 'cloud'}),
        ))
      : (await updateSoundsLocation('cloud', id, '', user.uid),
        store.dispatch(
          UpdateSoundsDB({name: name, sound: '', location: 'cloud'}),
        ));
    store.dispatch(modalShow({show: false}));
    store.dispatch(modalShowMessage(language.modalMessages.endDelete));
  };

  RNFS.exists(filepath)
    .then(result => {
      if (result) {
        return (
          RNFS.unlink(filepath)
            .then(() => {
              updateDB();
            })
            // `unlink` will throw an error, if the item to unlink does not exist
            .catch(err => {
              console.log(err.message);
            })
        );
      } else {
        store.dispatch(modalShow({show: false}));
        language.modalMessages.error.message = language.Messages.fileNotFound;
        store.dispatch(modalShowMessage(language.modalMessages.error));
      }
    })
    .catch(err => {
      store.dispatch(modalShow({show: false}));
      language.modalMessages.error.message = `${err.code}\n${err}`;
      store.dispatch(modalShowMessage(language.modalMessages.error));
    });
};
