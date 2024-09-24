import {config} from '../../../config';
import {CONST} from '../../const';
import {DATA_SOUNDS, DATA_MUSIC, soundCat, musicCat} from '../../data';
import {NativeModules, Platform} from 'react-native';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import {LANGUAGE} from '../../language';
import {THEME} from '../../theme';

export const setEnableNetworkFB = status => {
  status ? firestore().enableNetwork() : firestore().disableNetwork();
};

export const getLocalIdent = () => {
  return Platform.OS === 'ios'
    ? NativeModules.SettingsManager.settings.AppleLocale ||
        NativeModules.SettingsManager.settings.AppleLanguages[0]
    : NativeModules.I18nManager.localeIdentifier;
};

export async function writeArrToFB(arr, col1, doc1, col2) {
  return new Promise(async (resolve, reject) => {
    for (const item of arr) {
      await firestore()
        .collection(col1)
        .doc(doc1)
        .collection(col2)
        .doc(`${item.id}`)
        .set(item);
    }
    console.log('Done!');
    resolve(true);
  });
}

export const createUserData = async (user, token) => {
  return new Promise(async (resolve, reject) => {
    const userData = {
      uid: user.uid,
      token: token.token,
      os: token.os,
      createdAt: new Date(),
      name: user.displayName,
      email: user.email,
      isAnonymous: user.isAnonymous,
      phoneNumber: user.phoneNumber,
      status: 'newUser',
    };

    const appData = {
      language:
        CONST.RU_LANGS.findIndex(rulang => getLocalIdent().includes(rulang)) ===
        -1
          ? LANGUAGE.ENG.name
          : LANGUAGE.RUS.name,
      theme: THEME.MAIN_THEME.name,
    };

    const value = {
      [CONST.db.personalData]: userData,
      [CONST.db.appData]: appData,
    };
    await firestore().collection(CONST.db.users).doc(`${user.uid}`).set(value);
    resolve(value);
  });
};

export const getAuthFB = async () => {
  return new Promise((resolve, reject) => {
    const user = auth().currentUser;

    // auth()
    //   .signOut()
    //   .then(() => console.log('User signed out!'));

    if (!user) {
      auth()
        .signInAnonymously()
        .then(result => {
          resolve({
            user: result.user,
            status: 'newUser',
          });
        })
        .catch(error => {
          if (error.code === 'auth/email-already-in-use') {
            console.log('That email address is already in use!');
          }

          if (error.code === 'auth/invalid-email') {
            console.log('That email address is invalid!');
          }
          console.error(error);
          resolve(false);
        });
    } else {
      user.uid && user.isAnonymous
        ? resolve({user: user, status: CONST.accountStatuses._free})
        : null;
      user.uid && !user.isAnonymous
        ? resolve({user: user, status: CONST.accountStatuses._premium})
        : null;
    }
  });
};

export const CheckSize = async path => {
  return new Promise((resolve, reject) => {
    storage()
      .ref(path)
      .getMetadata()
      .then(metadata => {
        const size =
          metadata.size / 1000 < 1000
            ? `${Math.trunc(metadata.size / 1000)} Kb.`
            : `${(metadata.size / 1000000).toFixed(2)} Mb.`;
        resolve(size);
      })
      .catch(err => reject(err));
  });
};

export const GetURL = async path => {
  return new Promise((resolve, reject) => {
    storage()
      .ref(path)
      .getDownloadURL()
      .then(url => resolve(url))
      .catch(error => {
        console.log('error get URL = ', error);
        reject(error);
      });
  });
};

export const AddFeedBackToFB = async value => {
  let result = {
    error: '',
    request: '',
  };
  try {
    const appDoc = await firestore().collection(CONST.db.requests).get();
    const docList = appDoc.docs.map(doc => doc.data());
    const index = docList.length + 1;

    const indexStr = () => {
      if (index < 10) return '00000' + index;
      if (index < 100) return '0000' + index;
      if (index < 1000) return '000' + index;
      if (index < 10000) return '0' + index;
      if (index < 100000) return index;
    };

    const html = `<html>
	    <body>
	      <h3>Requests № MS${indexStr()}</h3>
	      <b>from: </b> ${value.name}
	      <p/>
	      <b>email: </b> ${value.email}
	      <p/>
	      <b>topic: </b> ${value.topic}
	      <p/>
	      <b>description: </b> ${value.description}
	      <p/>
	    </body>
	  </html>`;

    const number = `MS${indexStr()}`;
    value.message.number = number;
    value.message.html = html;
    value.message.subject = CONST.request.message.subject + '№ ' + number;

    console.log('add data');

    await firestore().collection(CONST.db.requests).doc(`${index}`).set(value);

    // await setDoc(doc(db, collectionName, `${index}`), value);
    result.request = indexStr();
    return result;
  } catch (e) {
    result.error = e;
    return result;
  }
};

export const readSoundDataFromFB = async db => {
  try {
    const sounds = await firestore().collection(db).get();
    const soundsList = sounds.docs
      .map(doc => doc.data())
      .sort((prev, next) => prev.id - next.id)
      .map(value => ({...value, globalCategory: db}));
    return soundsList;
  } catch (err) {
    console.log('readSoundDataFromFB: Read from Firebase error = ', err);
  }
  return null;
};

export const readDataFromFB = async db => {
  try {
    const col = await firestore().collection(db).get();
    const colList = col.docs.map(doc => doc.data());
    return colList;
  } catch (err) {
    console.log('readCategoriesDataFromFB: Read from Firebase error = ', err);
  }
  return null;
};

export const readUserDatafromFB = async (uid, col) => {
  try {
    if (
      col === CONST.db.sounds ||
      col === CONST.db.musics ||
      col === CONST.db.notifications
    ) {
      const data = await firestore()
        .collection(CONST.db.users)
        .doc(`${uid}`)
        .collection(col)
        .get();
      return data.docs
        .map(doc => doc.data())
        .sort((prev, next) => prev.id - next.id);
    }

    if (col === CONST.db.soundCategories || col === CONST.db.musicCategories) {
      const dataCategories = await firestore()
        .collection(CONST.db.users)
        .doc(`${uid}`)
        .collection(col)
        .get();
      return dataCategories.docs.map(doc => doc.data());
    }

    const userDoc = await firestore()
      .collection(CONST.db.users)
      .doc(`${uid}`)
      .get();

    return userDoc.data();
  } catch (err) {
    console.log('readUserDatafromFB: Read from Firebase error = ', err);
  }
  return null;
};

export const readFavoritesDatafromFB = async uid => {
  try {
    const favorites = await firestore()
      .collection(CONST.db.users)
      .doc(`${uid}`)
      .collection(CONST.db.favoritesPlay)
      .get();
    const favoritesList = favorites.docs.map(doc => doc.data());
    return favoritesList;
  } catch (err) {
    console.log('readUserDatafromFB: Read from Firebase error = ', err);
  }
  return null;
};

export const updateSoundsLocation = async (location, id, uri, uid) => {
  await firestore()
    .collection(CONST.db.users)
    .doc(`${uid}`)
    .collection(CONST.db.sounds)
    .doc(`${id}`)
    .update({
      location: location,
      sound: uri,
    });
};

export const updateMusicsLocation = async (location, id, uri, uid) => {
  await firestore()
    .collection(CONST.db.users)
    .doc(`${uid}`)
    .collection(CONST.db.musics)
    .doc(`${id}`)
    .update({
      location: location,
      sound: uri,
    });
};

export const updateStatusSoundsBooked = async (booked, id, uid) => {
  await firestore()
    .collection(CONST.db.users)
    .doc(`${uid}`)
    .collection(CONST.db.sounds)
    .doc(`${id}`)
    .update({
      booked: booked,
    });
};

export const updateStatusMusicsBooked = async (booked, id, uid) => {
  await firestore()
    .collection(CONST.db.users)
    .doc(`${uid}`)
    .collection(CONST.db.musics)
    .doc(`${id}`)
    .update({
      booked: booked,
    });
};

export const updateStatusNewSounds = async (newSound, id, uid) => {
  await firestore()
    .collection(CONST.db.users)
    .doc(`${uid}`)
    .collection(CONST.db.sounds)
    .doc(`${id}`)
    .update({
      newSound: newSound,
    });
};

export const updateStatusNewMusics = async (newSound, id, uid) => {
  await firestore()
    .collection(CONST.db.users)
    .doc(`${uid}`)
    .collection(CONST.db.musics)
    .doc(`${id}`)
    .update({
      newSound: newSound,
    });
};

export const updateImgDB = async (db, img, img_lt, id, uid) => {
  await firestore()
    .collection(CONST.db.users)
    .doc(`${uid}`)
    .collection(db)
    .doc(`${id}`)
    .update({
      img: img,
      img_lt: img_lt,
    });
};

export const updateSoundPath = async (db, sound, id, uid) => {
  await firestore()
    .collection(CONST.db.users)
    .doc(`${uid}`)
    .collection(db)
    .doc(`${id}`)
    .update({
      sound: sound,
    });
};

export const deleteDocument = async (col, col2, uid) => {
  const usersQuerySnapshot = await firestore()
    .collection(col)
    .doc(`${uid}`)
    .collection(col2)
    .get();
  const batch = firestore().batch();
  usersQuerySnapshot.forEach(documentSnapshot => {
    batch.delete(documentSnapshot.ref);
  });
  return batch.commit();
};

export const updateFavoritesDB = async (favoritesDB, uid, changeNameMix) => {
  const favoritesData = await readFavoritesDatafromFB(uid);
  const resulLength =
    favoritesData.length === favoritesDB.length ? false : true;

  if (resulLength || changeNameMix) {
    deleteDocument(CONST.db.users, CONST.db.favoritesPlay, uid).then(() => {
      favoritesDB.forEach(async (value, id) => {
        await firestore()
          .collection(CONST.db.users)
          .doc(`${uid}`)
          .collection(CONST.db.favoritesPlay)
          .doc(`${id}`)
          .set(value);
      });
    });
  }
};

export const updateLanguageFB = async (lang, uid) => {
  const userDataFB = await readUserDatafromFB(uid);
  userDataFB.appData.language = lang;
  await firestore().collection(CONST.db.users).doc(`${uid}`).update({
    appData: userDataFB.appData,
  });
};

export const updateThemeFB = async (theme, uid) => {
  const userDataFB = await readUserDatafromFB(uid);
  userDataFB.appData.theme = theme;
  await firestore().collection(CONST.db.users).doc(`${uid}`).update({
    appData: userDataFB.appData,
  });
};

export const updateStatusUnreadNotification = async (id, uid) => {
  await firestore()
    .collection(CONST.db.users)
    .doc(`${uid}`)
    .collection(CONST.db.notifications)
    .doc(`${id}`)
    .update({
      unread: false,
    });
};
