import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  useWindowDimensions,
  TouchableOpacity,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {
  ToggleSoundVolume,
  RemoveSound,
  TogglePlaySound,
  ToggleStartSound,
  ToggleBookedSound,
} from '../store/actions/sounds';
import {ChangeCurrentMixPlay} from '../store/actions/favorites';
import Slider from '@react-native-community/slider';
import {Audio} from 'expo-av';
import {BoxShadow} from 'react-native-shadow';
import {UpdateSoundsBookedDB} from '../store/actions/db';
import {updateStatusSoundsBooked} from '../components/function/FirebaseFunction';
import {
  CloseItemSVG,
  CheckSVG,
  BookedSVGYes,
  BookedSVGNo,
} from '../components/ui/SVG';
import {GetURL} from './function/FirebaseFunction';
import {modalShowMessage} from '../store/actions/modalMessage';
// import {SlideButton, SlideDirection} from 'react-native-slide-button';
import {SlideButton, SlideDirection} from '../components/ui/SlideButton';
import {THEME} from '../theme';

export const SoundItems = ({item, booked}) => {
  const user = useSelector(state => state.user);
  const language = useSelector(state => state.language);
  const width = useWindowDimensions().width;
  const soundDB = useSelector(state => state.db.sounds);
  const playSoundsAll = useSelector(state => state.sound.playAll);
  const startApp = useSelector(state => state.sound.startApp);
  const [volume, setVolumeState] = useState(item.volume);
  const [sound, setSound] = useState();
  const theme = useSelector(state => state.theme);

  const dispatch = useDispatch();
  async function playSound(item) {
    const parametrs = await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: true,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DUCK_OTHERS,
      shouldDuckAndroid: true,
    });
    const {sound} = await Audio.Sound.createAsync(
      item,
      {
        isLooping: true,
      },
      parametrs,
    );

    setSound(sound);
    dispatch(
      ToggleStartSound({
        soundStart: false,
      }),
    );
    !startApp ? await sound.playAsync() : sound.pauseAsync();
  }

  async function setStatePlaying(status) {
    status ? await sound.playAsync() : await sound.pauseAsync();
  }

  async function setVolume(id, value) {
    await sound.setVolumeAsync(value);
    dispatch(
      ToggleSoundVolume({
        id: id,
        volume: value,
      }),
    );
  }

  const changePlayStatusSound = id => {
    dispatch(
      TogglePlaySound({
        id: id,
      }),
    );
    playSoundsAll && sound
      ? item.playing
        ? setStatePlaying(true)
        : setStatePlaying(false)
      : null;
  };

  const removeSound = id => {
    dispatch(
      RemoveSound({
        id: id,
      }),
    );
    dispatch(
      ChangeCurrentMixPlay({
        name: language.Messages.currentMix,
        id: 0,
      }),
    );
  };

  useEffect(() => {
    sound
      ? playSoundsAll
        ? item.playing
          ? setStatePlaying(true)
          : null
        : !item.playAll
        ? setStatePlaying(false)
        : null
      : null;
  }, [playSoundsAll]);

  useEffect(() => {
    soundDB[item.id - 1].location === 'device' ||
    soundDB[item.id - 1].location === 'app'
      ? playSound({uri: soundDB[item.id - 1].sound})
      : GetURL(soundDB[item.id - 1].storage)
          .then(url => {
            playSound({uri: url});
          })
          .catch(error => {
            removeSound(item.id);
            language.modalMessages.error.message = `${error.code}\n${error}`;
            dispatch(modalShowMessage(language.modalMessages.error));
          });
  }, []);

  React.useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const shadowOpt = {
    width: width * 0.95,
    height: 72,
    color: theme.BACKGROUNDCOLOR,
    border: 7,
    radius: 15,
    opacity: 1,
    x: 0,
    y: 0,
    style: {
      borderRadius: 15,
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      marginTop: 20,
    },
  };

  const shadowOptNo = {
    width: width * 0.95,
    height: 70,
    color: theme.BACKGROUNDCOLOR,
    border: 6,
    radius: 15,
    opacity: 1,
    x: 0,
    y: 0,
    style: {
      borderRadius: 15,
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
    },
  };

  const shadowOptYes = {
    width: width * 0.95,
    height: 70,
    color: theme.CHECK_COLOR,
    border: 6,
    radius: 15,
    opacity: 0.5,
    x: 0,
    y: 0,
    style: {
      borderRadius: 15,
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      // marginTop: 20,
    },
  };

  const ToggleBookedSounds = async (id, booked) => {
    await updateStatusSoundsBooked(!booked, id, user.uid);
    dispatch(UpdateSoundsBookedDB({id: id, booked: !booked}));
    dispatch(ToggleBookedSound({id: id, booked: !booked}));
  };

  return (
    <View style={styles.containerItem}>
      <BoxShadow setting={shadowOpt}>
        <View
          style={{
            width: '100%',
            height: 70,
            position: 'absolute',
            justifyContent: 'center',
            alignItems: 'flex-end',
            paddingRight: 10,
            borderColor: theme.borderColorRGBA,
            borderWidth: 1,
            backgroundColor: theme.BACKGROUNDCOLOR,
            borderRadius: 15,
          }}>
          <TouchableOpacity
            style={{
              width: 22,
              height: 22,
              marginRight: 10,
            }}
            onPress={() => removeSound(item.id)}>
            <CloseItemSVG width="100%" height="100%" fill={theme.ITEM_COLOR} />
          </TouchableOpacity>
        </View>
        <SlideButton
          onSlideSuccess={() => {}}
          slideDirection={SlideDirection.LEFT}
          style={{
            width: width * 0.95,
          }}>
          <BoxShadow setting={item.playing ? shadowOptYes : shadowOptNo}>
            <View
              style={[
                styles.screen,
                item.playing
                  ? {
                      borderColor: theme.borderColorRGBA2,
                      borderWidth: 1,
                      backgroundColor: theme.BACKGROUNDCOLOR,
                    }
                  : {
                      borderColor: theme.borderColorRGBA,
                      borderWidth: 1,
                      backgroundColor: theme.BACKGROUNDCOLOR,
                    },
              ]}>
              <ImageBackground
                source={{uri: soundDB[item.id - 1].img}}
                imageStyle={{borderRadius: 5}}
                style={[styles.image, {opacity: playSoundsAll ? 1 : 0.5}]}
              />
              <View
                style={{
                  width: width * 0.5,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={[
                    styles.textMessages,
                    THEME.TEXT_FONT4,
                    {color: theme.TEXT_COLOR},
                  ]}>
                  {soundDB[item.id - 1].title[language.name]}
                </Text>
                <Slider
                  style={{width: '100%', height: 30}}
                  minimumValue={0}
                  maximumValue={1.0}
                  thumbTintColor={theme.TEXT_COLOR}
                  minimumTrackTintColor="#FFFFFF"
                  maximumTrackTintColor="#000000"
                  value={volume}
                  onValueChange={setVolumeState}
                  onSlidingComplete={value => {
                    setVolume(item.id, value);
                  }}
                />
              </View>
              <View style={{opacity: item.playing ? 1 : 0.5}}>
                <TouchableOpacity
                  style={{
                    width: 40,
                    height: 40,
                  }}
                  onPress={() => changePlayStatusSound(item.id)}>
                  <CheckSVG
                    width="100%"
                    height="100%"
                    fill={theme.ITEM_COLOR}
                  />
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={styles.booked}
                onPress={() => ToggleBookedSounds(item.id, booked)}>
                {booked ? (
                  <View
                    style={{
                      width: 33,
                      height: 33,
                      opacity: item.playing ? 1 : 0.5,
                    }}>
                    <BookedSVGYes
                      width="100%"
                      height="100%"
                      fill={theme.booked}
                    />
                  </View>
                ) : (
                  <View
                    style={{
                      width: 33,
                      height: 33,
                      opacity: item.playing ? 1 : 0.5,
                    }}>
                    <BookedSVGNo
                      width="100%"
                      height="100%"
                      fill={theme.booked}
                    />
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </BoxShadow>
        </SlideButton>
      </BoxShadow>
    </View>
  );
};

const styles = StyleSheet.create({
  containerItem: {
    width: '100%',
    height: 90,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  screen: {
    width: '100%',
    height: 70,
    padding: 10,
    borderRadius: 15,
    opacity: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textMessages: {
    opacity: 0.9,
    paddingTop: 10,
    paddingLeft: 15,
    width: '100%',
  },
  image: {
    width: 40,
    height: 40,
    resizeMode: 'stretch',
  },
});
