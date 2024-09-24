// import * as Font from 'expo-font';
import AsyncStorage from '@react-native-async-storage/async-storage';
import store from './store/index';
import {CONST} from './const';
import {config} from '../config';
import {AddFavoritesSound} from './store/actions/sounds';
import {ChangeStateMusic} from './store/actions/music';
import {ChangeTheme} from './store/actions/theme';
import {IntervalFeedback} from './store/actions/intervalFeedback';
import {LANGUAGE} from './language';
import {ChangeLanguage, CreateLanguageCategory} from './store/actions/language';
import {
  LoadFavoritesMixes,
  ChangeCurrentMixPlay,
} from './store/actions/favorites';
import {THEME} from './theme';
import {
  LoadSoundFromDB,
  LoadMusicFromDB,
  LoadSoundFromFB,
  LoadMusicFromFB,
  LoadSoundCategoriesFromFB,
  LoadMusicCategoriesFromFB,
  LoadSoundCategoriesFromDB,
  LoadMusicCategoriesFromDB,
  LoadNotificationsFromDB,
} from './store/actions/db';
import {
  getAuthFB,
  createUserData,
  readSoundDataFromFB,
  readMusicDataFromFB,
  readUserDatafromFB,
  readFavoritesDatafromFB,
  readDataFromFB,
  writeArrToFB,
} from './components/function/FirebaseFunction';
import {DATA_MUSIC, DATA_SOUNDS, soundCat, musicCat} from './data';
import {addUserData} from './store/actions/user';
import {PushController} from './components/PushController';
import {
  prepareCategoryForNewUser,
  checkForCategoriesImage,
  checkForImages,
  prepareSoundsForNewUser,
} from './components/function/DataFunctions';

// import {AddNewObject} from './components/function/AddNewObject';

export async function bootstrap() {
  console.log('BootStarp Load');
  try {
    const token = await PushController();

    const LoadData = async user => {
      return new Promise(async (resolve, reject) => {
        const soundCategoriesFB = await readDataFromFB(
          CONST.db.soundCategories,
        );
        await store.dispatch(LoadSoundCategoriesFromFB(soundCategoriesFB));
        const musicCategoriesFB = await readDataFromFB(
          CONST.db.musicCategories,
        );
        await store.dispatch(LoadMusicCategoriesFromFB(musicCategoriesFB));
        const soundFB = await readSoundDataFromFB(CONST.db.sounds);
        await store.dispatch(LoadSoundFromFB(soundFB));
        const musicFB = await readSoundDataFromFB(CONST.db.musics);
        await store.dispatch(LoadMusicFromFB(musicFB));

        const notificationFB = await readDataFromFB(CONST.db.notifications);

        const soundUserFB = await readUserDatafromFB(user.uid, CONST.db.sounds);
        let soundData;
        !soundUserFB || !soundUserFB?.length
          ? ((soundData = await prepareSoundsForNewUser(soundFB, DATA_SOUNDS)),
            await writeArrToFB(
              soundData,
              CONST.db.users,
              `${user.uid}`,
              CONST.db.sounds,
            ),
            await store.dispatch(LoadSoundFromDB(soundData)))
          : ((soundData = await checkForImages(
              soundUserFB,
              soundFB,
              user.uid,
              CONST.db.sounds,
            )),
            await store.dispatch(LoadSoundFromDB(soundData)));

        const musicUserFB = await readUserDatafromFB(user.uid, CONST.db.musics);
        let musicData;
        !musicUserFB || !musicUserFB?.length
          ? ((musicData = await prepareSoundsForNewUser(musicFB, DATA_MUSIC)),
            await writeArrToFB(
              musicData,
              CONST.db.users,
              `${user.uid}`,
              CONST.db.musics,
            ),
            await store.dispatch(LoadMusicFromDB(musicData)))
          : ((musicData = await checkForImages(
              musicUserFB,
              musicFB,
              user.uid,
              CONST.db.musics,
            )),
            await store.dispatch(LoadMusicFromDB(musicData)));

        const soundCategoriesUserFB = await readUserDatafromFB(
          user.uid,
          CONST.db.soundCategories,
        );
        let soundCategoriesData;
        !soundCategoriesUserFB || !soundCategoriesUserFB?.length
          ? ((soundCategoriesData = await prepareCategoryForNewUser(
              soundCategoriesFB,
            )),
            await writeArrToFB(
              soundCategoriesData,
              CONST.db.users,
              `${user.uid}`,
              CONST.db.soundCategories,
            ),
            await store.dispatch(
              LoadSoundCategoriesFromDB(soundCategoriesData),
            ))
          : ((soundCategoriesData = await checkForCategoriesImage(
              soundCategoriesUserFB,
              soundCategoriesFB,
              user.uid,
              CONST.db.soundCategories,
            )),
            await store.dispatch(
              LoadSoundCategoriesFromDB(soundCategoriesData),
            ));

        const musicCategoriesUserFB = await readUserDatafromFB(
          user.uid,
          CONST.db.musicCategories,
        );
        let musicCategoriesData;
        !musicCategoriesUserFB || !musicCategoriesUserFB?.length
          ? ((musicCategoriesData = await prepareCategoryForNewUser(
              musicCategoriesFB,
            )),
            await writeArrToFB(
              musicCategoriesData,
              CONST.db.users,
              `${user.uid}`,
              CONST.db.musicCategories,
            ),
            await store.dispatch(
              LoadMusicCategoriesFromDB(musicCategoriesData),
            ))
          : ((musicCategoriesData = await checkForCategoriesImage(
              musicCategoriesUserFB,
              musicCategoriesFB,
              user.uid,
              CONST.db.musicCategories,
            )),
            await store.dispatch(
              LoadMusicCategoriesFromDB(musicCategoriesData),
            ));

        const notificationsUserFB = await readUserDatafromFB(
          user.uid,
          CONST.db.notifications,
        );
        !notificationsUserFB || !notificationsUserFB?.length
          ? (await writeArrToFB(
              notificationFB,
              CONST.db.users,
              `${user.uid}`,
              CONST.db.notifications,
            ),
            await store.dispatch(LoadNotificationsFromDB(notificationFB)))
          : await store.dispatch(LoadNotificationsFromDB(notificationsUserFB));

        const userDataFB = await readUserDatafromFB(user.uid);
        let userData;
        !userDataFB?.personalData
          ? ((userData = await createUserData(user, token.token)),
            await store.dispatch(addUserData(userData.personalData)),
            await store.dispatch(
              ChangeLanguage({_name: userData.appData.language}),
            ),
            await store.dispatch(ChangeTheme(userData.appData.theme)))
          : (await store.dispatch(addUserData(userDataFB.personalData)),
            await store.dispatch(
              ChangeLanguage({_name: userDataFB.appData.language}),
            ),
            await store.dispatch(ChangeTheme(userDataFB.appData.theme)));

        const favoritesData = await readFavoritesDatafromFB(user.uid);
        favoritesData?.length > 0
          ? await store.dispatch(LoadFavoritesMixes(favoritesData))
          : null;
        const currentPlay = JSON.parse(
          await AsyncStorage.getItem(CONST.STORAGE_KEYS.currentPlay),
        );
        if (currentPlay) {
          if (currentPlay.sound) {
            currentPlay.sound.playAll = false;
            currentPlay.sound.startApp = true;
          }
          currentPlay.music.startApp = true;
          currentPlay.sound
            ? await store.dispatch(AddFavoritesSound(currentPlay.sound))
            : null;
          currentPlay.music
            ? await store.dispatch(ChangeStateMusic(currentPlay.music))
            : null;
          currentPlay.favorites
            ? await store.dispatch(
                ChangeCurrentMixPlay({
                  name: currentPlay.favorites.currentMix,
                  id: currentPlay.favorites.Id,
                }),
              )
            : null;
        }
        resolve(true);
      });
    };

    const fireAuth = await getAuthFB();
    if (!fireAuth) return false;
    await LoadData(fireAuth.user);

    // await Font.loadAsync({
    //   'open-bold': require('../assets/fonts/OpenSans-Bold.ttf'),
    //   'open-regular': require('../assets/fonts/OpenSans-Regular.ttf'),
    // });

    // const notificationsDB = store.getState().db.notifications;
    // let notificationsId = notificationsDB.length + 1;

    // try {
    // 	const db = getFirestore(app);
    // 	const soundsCol = collection(db, 'DATA_SOUNDS');
    // 	const soundsSnapshot = await getDocs(soundsCol);
    // 	const soundsList = soundsSnapshot.docs.map(doc => doc.data());

    // 	if (soundsList.length > sounds.length) {
    // 		soundsList.forEach(doc => {
    // 			const index = sounds.findIndex(item => item.name === doc.name);
    // 			if (index < 0) {
    // 				AddNewObject(doc, notificationsId);
    // 				notificationsId++;
    // 			}
    // 		});
    // 	}

    // 	const musicsCol = collection(db, 'DATA_MUSIC');
    // 	const musicsSnapshot = await getDocs(musicsCol);
    // 	const musicsList = musicsSnapshot.docs.map(doc => doc.data());

    // 	if (musicsList.length > musics.length) {
    // 		musicsList.forEach(doc => {
    // 			const index = musics.findIndex(item => item.name === doc.name);
    // 			if (index < 0) {
    // 				AddNewObject(doc, notificationsId);
    // 				notificationsId++;
    // 			}
    // 		});
    // 	}

    //----------------------------------------------------
    const dateFeedback = JSON.parse(
      await AsyncStorage.getItem(CONST.STORAGE_KEYS.feedbackInterval),
    );
    dateFeedback
      ? await store.dispatch(IntervalFeedback({date: dateFeedback}))
      : null;
  } catch (e) {
    console.log('Error: ', e);
  }
}
