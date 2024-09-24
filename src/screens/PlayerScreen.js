import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Platform,
  ImageBackground,
  useWindowDimensions,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {ToggleAllSound, ToggleMusicControl} from '../store/actions/sounds';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import {SoundItems} from '../components/SoundsItems';
import {MusicItems} from '../components/MusicItems';
import {CustomHeader} from '../components/ui/CustomHeader';
import {
  PlaySVG,
  PauseSVG,
  TimerSVG,
  ArrowLeftSVG,
  LibrarySVG,
  HeartSVG,
  HeartSVGYes,
  MusicSVG,
  SoundSVG,
} from '../components/ui/SVG';
import {CheckForFavoriteContent} from '../components/function/FavoriteMixesFunction';
import {updateFavoritesDB} from '../components/function/FirebaseFunction';
import {modalShow} from '../store/actions/modal';
import {modalShowMessage} from '../store/actions/modalMessage';
import {CONST} from '../const';
import {THEME} from '../theme';
import MusicControl, {Command} from 'react-native-music-control';
import {Timer} from '../components/Timer';
import {favoritesIcon} from '../data';
import {BoxShadow} from 'react-native-shadow';

export const PlayerScreen = ({navigation}) => {
  const user = useSelector(state => state.user);
  const width = useWindowDimensions().width;
  const language = useSelector(state => state.language);
  const theme = useSelector(state => state.theme);
  const playSoundsAll = useSelector(state => state.sound.playAll);
  const [play, setPlay] = useState(playSoundsAll);
  const [disabledControl, setDisabledControl] = useState(true);
  const playingDataSound = useSelector(state => state.sound.mixedSound);
  const StateSound = useSelector(state => state.sound);
  const playingMusicId = useSelector(state => state.music.id);
  const StateMusic = useSelector(state => state.music);
  const favorites = useSelector(state => state.favorites);
  const [favorite, setFavorite] = useState(
    CheckForFavoriteContent() ? true : false,
  );
  const db = useSelector(state => state.db);

  const soundControl = play => {
    const music = db.musics[playingMusicId - 1]
      ? `${db.musics[playingMusicId - 1].title[language.name]}`
      : '';
    const mixedsounds = playingDataSound
      .map(sound => ' ' + db.sounds[sound.id - 1].title[language.name])
      .toString();
    const sounds = mixedsounds ? (music ? `,${mixedsounds}` : mixedsounds) : '';
    const text = music + sounds;

    text
      ? (MusicControl.enableControl('play', true),
        MusicControl.enableControl('pause', true),
        MusicControl.enableControl('stop', true),
        MusicControl.enableControl('closeNotification', true, {when: 'never'}),
        MusicControl.setNowPlaying({
          title: favorites.currentMix,
          artist: text,
          artwork: require('../../assets/main.png'),
          description: '',
          color: 0xdebe8f,
          colorized: false,
          notificationIcon: 'notification_icon',
          isLiveStream: true,
        }),
        dispatch(
          ToggleMusicControl({
            musicControl: true,
          }),
        ),
        play
          ? MusicControl.updatePlayback({state: MusicControl.STATE_PLAYING})
          : MusicControl.updatePlayback({state: MusicControl.STATE_PAUSED}))
      : null;
  };

  useEffect(() => {
    playSoundsAll
      ? (setPlay(true), soundControl(true))
      : (setPlay(false), soundControl(false));
  }, [playSoundsAll]);

  const dispatch = useDispatch();
  function setStatusPlay(status) {
    status ? setPlay(true) : setPlay(false);
    dispatch(
      ToggleAllSound({
        playAll: status,
      }),
    );
  }

  async function setAsyncStorageCurrentPlay() {
    const value = {
      sound: StateSound,
      music: StateMusic,
      favorites: {
        currentMix: favorites.currentMix,
        currentId: favorites.currentId,
      },
    };
    try {
      return await AsyncStorage.setItem(
        CONST.STORAGE_KEYS.currentPlay,
        JSON.stringify(value),
      );
    } catch (e) {
      console.log('SettingsItems: Error: ', e);
    }
  }

  useEffect(() => {
    setAsyncStorageCurrentPlay();
  }, [StateSound]);

  useEffect(() => {
    setAsyncStorageCurrentPlay();
  }, [StateMusic]);

  useEffect(() => {
    const result = CheckForFavoriteContent();
    result ? setFavorite(true) : setFavorite(false);
    playingDataSound.length
      ? (playSoundsAll
          ? (setStatusPlay(true), soundControl(true))
          : setPlay(false),
        setDisabledControl(false))
      : playingMusicId > 0
      ? setDisabledControl(false)
      : (setDisabledControl(true), setStatusPlay(false));
  }, [playingDataSound]);

  useEffect(() => {
    const result = CheckForFavoriteContent();
    result ? setFavorite(true) : setFavorite(false);
    playingMusicId > 0
      ? (playSoundsAll
          ? (setStatusPlay(true), soundControl(true))
          : setPlay(false),
        setDisabledControl(false))
      : playingDataSound.length
      ? setDisabledControl(false)
      : (setDisabledControl(true), setStatusPlay(false));
  }, [playingMusicId]);

  const ClearSoundList = () => {
    dispatch(modalShow(language.modalMessages.clearSoundList));
  };

  const AddFavoriteMix = () => {
    const result = CheckForFavoriteContent();
    !result
      ? dispatch(
          modalShow({
            ...language.modalMessages.addFavoriteMix,
            ...{
              category: 'mixes',
            },
          }),
        )
      : ((language.modalMessages.sameMixFound.message = `${
          language.modalMessages.sameMixFound.message1
        } "${result.trim()}"`),
        dispatch(modalShowMessage(language.modalMessages.sameMixFound)),
        setFavorite(true));
  };

  const CheckAddFavoritesFunction = () => {
    if (disabledControl) {
      navigation.navigate('SectionsTabNavigation', {
        screen: 'FavouritesTavNavigation',
      });
      return;
    }
    if (
      (playingMusicId > 0 && playingDataSound.length >= 1) ||
      playingDataSound.length > 1
    ) {
      !favorite
        ? AddFavoriteMix()
        : navigation.navigate('SectionsTabNavigation', {
            screen: 'FavouritesTavNavigation',
          });
    } else {
      navigation.navigate('SectionsTabNavigation', {
        screen: 'FavouritesTavNavigation',
      });
    }
  };

  async function setAsyncStorageFavoritePlay(favoritesValue) {
    await updateFavoritesDB(favoritesValue, user.uid);
  }

  useEffect(() => {
    const result = CheckForFavoriteContent();
    setFavorite(result ? true : false);
    setAsyncStorageCurrentPlay();
  }, [favorites]);

  useEffect(() => {
    setAsyncStorageFavoritePlay(favorites.favorites);
  }, [favorites.favorites]);

  useEffect(() => {
    MusicControl.enableBackgroundMode(true);
    Platform.OS === 'ios' && MusicControl.handleAudioInterruptions(true);
    MusicControl.on(Command.play, () => {
      setStatusPlay(true);
    });
    MusicControl.on(Command.pause, () => {
      setStatusPlay(false);
    });
    MusicControl.on(Command.stop, () => {
      setStatusPlay(false);
      dispatch(modalShow(language.modalMessages.exitApp));
      MusicControl.enableBackgroundMode(false);
    });
  });

  const renderItem = ({item}) => (
    <SoundItems item={item} booked={item.booked} />
  );

  const shadowOpt = {
    width: width * 0.95,
    height: 62,
    color: theme.BACKGROUNDCOLOR,
    border: 7,
    radius: 15,
    opacity: 0.7,
    x: 0,
    y: 0,
    style: {
      borderRadius: 15,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 15,
      opacity: 1,
    },
  };

  return (
    <View style={styles.container}>
      <CustomHeader
        navigation={navigation}
        label={language.headerTitle.player}
      />
      <LinearGradient
        colors={theme.BACKGROUNDCOLOR_LG}
        style={[
          CONST.MAIN_BACKGROUNDSTYLES,
          {justifyContent: 'space-between', alignItems: 'center'},
        ]}>
        <BoxShadow setting={shadowOpt}>
          <TouchableOpacity
            style={[
              styles.screen,
              {
                backgroundColor: theme.BACKGROUNDCOLOR,
                borderColor: theme.borderColorRGBA,
                borderWidth: 1,
              },
            ]}
            onPress={() =>
              navigation.navigate('SectionsTabNavigation', {
                screen: favorites.favorites.length
                  ? 'FavouritesTabNavigation'
                  : 'SoundsTabNavigation',
              })
            }>
            <View
              style={{
                width: 30,
                height: 30,
              }}>
              <ArrowLeftSVG
                width="100%"
                height="100%"
                fill={theme.ITEM_COLOR}
              />
            </View>
            <Text style={[THEME.TITLE_FONT, {color: theme.TEXT_COLOR}]}>
              {language.headerTitle.library}
            </Text>
            <View
              style={{
                width: 35,
                height: 35,
              }}>
              <LibrarySVG width="100%" height="100%" fill={theme.ITEM_COLOR} />
            </View>
          </TouchableOpacity>
        </BoxShadow>
        <View style={styles.pleerContainer}>
          <FlatList
            ListHeaderComponent={
              <View>
                <BoxShadow
                  setting={{
                    width: width * 0.4,
                    height: 52,
                    color: theme.BACKGROUNDCOLOR,
                    border: 7,
                    radius: 10,
                    opacity: 0.7,
                    x: 0,
                    y: 0,
                    style: {
                      borderRadius: 10,
                      // flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginTop: 15,
                      marginLeft: 15,
                      opacity: 1,
                    },
                  }}>
                  <TouchableOpacity
                    style={{
                      width: '99.5%',
                      height: '100%',
                      backgroundColor: theme.BACKGROUNDCOLOR,
                      borderColor: theme.borderColor2,
                      borderWidth: 1,
                      borderRadius: 10,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingLeft: 20,
                      paddingRight: 15,
                    }}
                    onPress={() =>
                      navigation.navigate('SectionsTabNavigation', {
                        screen: 'MusicsTabNavigation',
                      })
                    }>
                    <Text style={[THEME.TITLE_FONT, {color: theme.TEXT_COLOR}]}>
                      {language.headerTitle.music}
                    </Text>
                    <View
                      style={{
                        width: 25,
                        height: 25,
                      }}>
                      <MusicSVG
                        width="100%"
                        height="100%"
                        fill={theme.ITEM_COLOR}
                      />
                    </View>
                  </TouchableOpacity>
                </BoxShadow>
                {playingMusicId === 0 ? (
                  <Text
                    style={[
                      styles.textMessages,
                      THEME.TITLE_FONT3,
                      {color: theme.TEXT_COLOR},
                    ]}>
                    {language.Messages.emptyList}
                  </Text>
                ) : (
                  <MusicItems id={playingMusicId} booked={StateMusic.booked} />
                )}
                <View
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <View
                    style={{
                      width: width * 0.95,
                      height: 0.5,
                      backgroundColor: theme.BACKGROUNDCOLOR,
                      ...Platform.select({
                        ios: THEME.SHADOW_FOR_IOS,
                        android: {
                          elevation: 2,
                        },
                      }),
                      marginTop: 10,
                    }}
                  />
                </View>
                <BoxShadow
                  setting={{
                    width: width * 0.4,
                    height: 52,
                    color: theme.BACKGROUNDCOLOR,
                    border: 7,
                    radius: 10,
                    opacity: 0.7,
                    x: 0,
                    y: 0,
                    style: {
                      borderRadius: 10,
                      // flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginTop: 15,
                      marginLeft: 15,
                      opacity: 1,
                    },
                  }}>
                  <TouchableOpacity
                    style={{
                      width: '99.5%',
                      height: '100%',
                      backgroundColor: theme.BACKGROUNDCOLOR,
                      borderColor: theme.borderColor2,
                      borderWidth: 1,
                      borderRadius: 10,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingLeft: 20,
                      paddingRight: 15,
                    }}
                    onPress={() =>
                      navigation.navigate('SectionsTabNavigation', {
                        screen: 'SoundsTabNavigation',
                      })
                    }>
                    <Text style={[THEME.TITLE_FONT, {color: theme.TEXT_COLOR}]}>
                      {language.headerTitle.sound}
                    </Text>
                    <View
                      style={{
                        width: 25,
                        height: 25,
                      }}>
                      <SoundSVG
                        width="100%"
                        height="100%"
                        fill={theme.ITEM_COLOR}
                      />
                    </View>
                  </TouchableOpacity>
                </BoxShadow>
                {!playingDataSound.length && (
                  <View>
                    <Text
                      style={[
                        styles.textMessages,
                        THEME.TITLE_FONT3,
                        {color: theme.TEXT_COLOR},
                      ]}>
                      {language.Messages.emptyList}
                    </Text>
                  </View>
                )}
              </View>
            }
            ListFooterComponent={
              <View
                style={{
                  width: '100%',
                  height: 250,
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                }}>
                {StateSound.mixedSound.length > 0 && (
                  <BoxShadow
                    setting={{
                      width: width * 0.5,
                      height: 52,
                      color: theme.BACKGROUNDCOLOR,
                      border: 7,
                      radius: 10,
                      opacity: 0.7,
                      x: 0,
                      y: 0,
                      style: {
                        borderRadius: 10,
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: 15,
                        opacity: 1,
                      },
                    }}>
                    <TouchableOpacity
                      style={{
                        width: '99.5%',
                        height: '100%',
                        backgroundColor: theme.BACKGROUNDCOLOR,
                        borderColor: theme.borderColorRGBA,
                        borderWidth: 1,
                        borderRadius: 10,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                      onPress={ClearSoundList}>
                      <Text
                        style={[THEME.TITLE_FONT, {color: theme.TEXT_COLOR}]}>
                        {language.buttons.clear}
                      </Text>
                    </TouchableOpacity>
                  </BoxShadow>
                )}
              </View>
            }
            horizontal={false}
            style={{width: '100%', height: '100%'}}
            data={playingDataSound}
            renderItem={renderItem}
            keyExtractor={item => item.id.toString()}
          />
        </View>
        <View style={styles.controlContainer}>
          <BoxShadow
            setting={{
              width: 80,
              height: 80,
              color: theme.BACKGROUNDCOLOR,
              border: 10,
              radius: 40,
              opacity: 0.7,
              x: 0,
              y: 0,
              style: {
                borderRadius: '50%',
                justifyContent: 'center',
                alignItems: 'center',
                opacity: 1,
              },
            }}>
            <TouchableOpacity
              style={{
                width: 65,
                height: 65,
                borderRadius: 50,
                borderColor: theme.borderColorRGBA,
                borderWidth: 1,
                backgroundColor: theme.BACKGROUNDCOLOR,
                justifyContent: 'center',
                alignItems: 'center',

                opacity: disabledControl ? 0.5 : 1,
              }}
              disabled={disabledControl}
              onPress={() => navigation.navigate('TimerScreen')}>
              <View
                style={{
                  width: 45,
                  height: 45,
                }}>
                <TimerSVG width="100%" height="100%" fill={theme.ITEM_COLOR} />
                <Timer
                  screen={'Player'}
                  on={
                    StateSound.mixedSound.length || StateMusic.id > 0
                      ? true
                      : false
                  }
                />
              </View>
            </TouchableOpacity>
          </BoxShadow>
          <BoxShadow
            setting={{
              width: 95,
              height: 95,
              color: theme.BACKGROUNDCOLOR,
              border: 10,
              radius: 40,
              opacity: 0.7,
              x: 0,
              y: 0,
              style: {
                borderRadius: '50%',
                justifyContent: 'center',
                alignItems: 'center',
                opacity: 1,
              },
            }}>
            <TouchableOpacity
              style={{
                width: 85,
                height: 85,
                borderRadius: 50,
                borderWidth: 1,
                backgroundColor: theme.BACKGROUNDCOLOR,
                justifyContent: 'center',
                alignItems: 'center',
                opacity: disabledControl ? 0.5 : 1,
              }}
              disabled={disabledControl}
              onPress={() =>
                play ? setStatusPlay(false) : setStatusPlay(true)
              }>
              {!play ? (
                <View
                  style={{
                    width: '100%',
                    height: '100%',
                  }}>
                  <PlaySVG width="100%" height="100%" fill={theme.ITEM_COLOR} />
                </View>
              ) : (
                <View
                  style={{
                    width: '100%',
                    height: '100%',
                  }}>
                  <PauseSVG
                    width="100%"
                    height="100%"
                    fill={theme.ITEM_COLOR}
                  />
                </View>
              )}
            </TouchableOpacity>
          </BoxShadow>
          <BoxShadow
            setting={{
              width: 80,
              height: 80,
              color: theme.BACKGROUNDCOLOR,
              border: 10,
              radius: 40,
              opacity: 0.7,
              x: 0,
              y: 0,
              style: {
                borderRadius: '50%',
                justifyContent: 'center',
                alignItems: 'center',
                opacity: 1,
              },
            }}>
            <TouchableOpacity
              style={[
                {
                  width: 65,
                  height: 65,
                  borderRadius: 50,
                  paddingTop: 5,
                  borderColor: theme.borderColorRGBA,
                  borderWidth: 1,
                  backgroundColor: theme.BACKGROUNDCOLOR,
                  justifyContent: 'center',
                  alignItems: 'center',
                },
              ]}
              // disabled={disabledControl}
              activeOpacity={favorite ? 1 : 0.2}
              onPress={() => CheckAddFavoritesFunction()}>
              {disabledControl ? (
                <View
                  style={{
                    width: '70%',
                    height: '70%',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <ImageBackground
                    source={
                      theme.name === 'MAIN_THEME'
                        ? favoritesIcon.MAIN_THEME.toFavoritesScreen
                        : favoritesIcon.LIGHT_THEME.toFavoritesScreen
                    }
                    resizeMode={'contain'}
                    imageStyle={{
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    style={{
                      width: '100%',
                      height: '100%',
                    }}
                  />
                </View>
              ) : (playingMusicId > 0 && playingDataSound.length >= 1) ||
                playingDataSound.length > 1 ? (
                !favorite ? (
                  <View
                    style={{
                      width: 50,
                      height: 50,
                    }}>
                    <HeartSVG
                      width="100%"
                      height="100%"
                      fill={theme.ITEM_COLOR}
                    />
                  </View>
                ) : (
                  <View
                    style={{
                      width: 50,
                      height: 50,
                    }}>
                    <HeartSVGYes
                      width="100%"
                      height="100%"
                      fill={theme.CHECK_COLOR}
                    />
                  </View>
                )
              ) : (
                <View style={{width: '70%', height: '70%'}}>
                  <ImageBackground
                    source={
                      theme.name === 'MAIN_THEME'
                        ? favoritesIcon.MAIN_THEME.toFavoritesScreen
                        : favoritesIcon.LIGHT_THEME.toFavoritesScreen
                    }
                    resizeMode={'contain'}
                    style={{
                      width: '100%',
                      height: '100%',
                    }}
                  />
                </View>
              )}
            </TouchableOpacity>
          </BoxShadow>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  screen: {
    width: '100%',
    height: 60,
    padding: 15,
    paddingRight: 20,
    borderStyle: 'solid',
    borderRadius: 15,
    opacity: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pleerContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  controlContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    position: 'absolute',
    bottom: 75,
  },
  textMessages: {
    opacity: 0.8,
    paddingLeft: 30,
    paddingTop: 10,
  },
});
