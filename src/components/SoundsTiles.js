import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {AddSound, RemoveSound, ToggleAllSound} from '../store/actions/sounds';
import {ChangeCurrentMixPlay} from '../store/actions/favorites';
import {CONST} from '../const';
import {modalShow} from '../store/actions/modal';
import {UpdateSoundsDB, UpdateSoundsStatusDB} from '../store/actions/db';
import {modalShowMessage} from '../store/actions/modalMessage';
import {BoxShadow} from 'react-native-shadow';
import FastImage from 'react-native-fast-image';
import {
  CheckSize,
  updateSoundsLocation,
  updateStatusNewSounds,
  updateStatusSoundsBooked,
} from '../components/function/FirebaseFunction';
import {
  CheckFile,
  CheckFileSize,
  FileSizeToString,
} from '../components/function/FileFunction';
import {icons} from '../data';
import {UpdateSoundsBookedDB} from '../store/actions/db';
import {Cloud, Mobile, BookedSVGYes, BookedSVGNo} from '../components/ui/SVG';
import {THEME} from '../theme';

import {getMaxMemory, getTotalMemory} from 'react-native-device-info';

export const SoundsTiles = ({
  id,
  findUseSound,
  item,
  img,
  title,
  description,
  location,
  storage,
  name,
  booked,
  globalCategory,
  newSnd,
}) => {
  const user = useSelector(state => state.user);
  const language = useSelector(state => state.language);
  const [playing, setPlaying] = useState(findUseSound);
  const soundStart = useSelector(state => state.sound.soundStart);
  const playAll = useSelector(state => state.sound.playAll);
  const [disabled, setDisabled] = useState(false);
  const width = useWindowDimensions().width;
  const playingDataSound = useSelector(state => state.sound.mixedSound);
  const theme = useSelector(state => state.theme);
  const [newSound, setNewSound] = useState(newSnd);

  useEffect(() => {
    setPlaying(findUseSound);
  }, [playingDataSound]);

  useEffect(() => {
    !soundStart ? setDisabled(false) : null;
  }, [soundStart]);

  const dispatch = useDispatch();
  const addSound = async (id, findUseSound) => {
    if (playingDataSound.length + 1 >= CONST.maxSounds) {
      dispatch(modalShowMessage(language.modalMessages.maxSounds));
      return;
    }
    updateStatusNewSounds(false, id, user.uid);
    dispatch(UpdateSoundsStatusDB({name: name, new: false}));
    setNewSound(false);
    const check = location === 'device' ? await CheckFile(item) : true;
    check || location !== 'device'
      ? !findUseSound
        ? (setPlaying(previousState => !previousState),
          dispatch(
            ToggleAllSound({
              playAll: true,
            }),
          ),
          dispatch(
            AddSound({
              id: id,
              playing: true,
              volume: 1.0,
              booked: booked,
            }),
          ),
          dispatch(
            ChangeCurrentMixPlay({
              name: language.Messages.currentMix,
              id: 0,
            }),
          ),
          setDisabled(true))
        : (setPlaying(previousState => !previousState),
          dispatch(
            RemoveSound({
              id: id,
            }),
          ),
          dispatch(
            ChangeCurrentMixPlay({
              name: language.Messages.currentMix,
              id: 0,
            }),
          ))
      : ((language.modalMessages.error.message = `${language.Messages.fileNotFound} ${language.Messages.switchToCloud}`),
        await updateSoundsLocation('cloud', id, '', user.uid),
        dispatch(UpdateSoundsDB({name: name, sound: '', location: 'cloud'})),
        dispatch(modalShowMessage(language.modalMessages.error)));
  };

  const shadowOpt = {
    width: 55,
    height: 55,
    color: theme.CHECK_COLOR,
    border: 7,
    radius: 10,
    opacity: 0.8,
    x: 0,
    y: 0,
    style: {marginVertical: 0},
  };

  const findPlaySound = playingDataSound.find(value => value.id === id);
  const playSound = findPlaySound ? findPlaySound.playing : undefined;

  const OpenDescription = (description, title) => {
    language.modalMessages.OpenDescription.title = title;
    language.modalMessages.OpenDescription.message = description;
    dispatch(modalShowMessage(language.modalMessages.OpenDescription));
  };

  const downloadFromCloud = async (storage, name, globalCategory) => {
    const size = await CheckSize(storage);
    language.modalMessages.downloadFromCloud.message = `${language.modalMessages.downloadFromCloud.message1} "${title}" ${language.modalMessages.downloadFromCloud.message2} \n${language.modalMessages.downloadFromCloud.size} ${size}`;
    language.modalMessages.downloadFromCloud.storage = storage;
    language.modalMessages.downloadFromCloud.name = name;
    language.modalMessages.downloadFromCloud.category = globalCategory;
    language.modalMessages.downloadFromCloud.id = id;
    dispatch(modalShow(language.modalMessages.downloadFromCloud));
  };

  const deleteFromDevice = async (item, name, id, globalCategory) => {
    const sizeFile = await CheckFileSize(item);
    const size = FileSizeToString(sizeFile);
    language.modalMessages.deleteFromDevice.message = `${language.modalMessages.deleteFromDevice.message1} "${title}" ${language.modalMessages.deleteFromDevice.message2} \n${language.modalMessages.deleteFromDevice.size} ${size}`;
    language.modalMessages.deleteFromDevice.sound = item;
    language.modalMessages.deleteFromDevice.name = name;
    language.modalMessages.deleteFromDevice.id = id;
    language.modalMessages.deleteFromDevice.category = globalCategory;
    dispatch(modalShow(language.modalMessages.deleteFromDevice));
  };

  const ToggleBookedSounds = async (id, booked) => {
    await updateStatusSoundsBooked(!booked, id, user.uid);
    dispatch(UpdateSoundsBookedDB({id: id, booked: !booked}));
  };

  return (
    <View
      style={[styles.container, {width: width / CONST.FLATLIST.numberColumns}]}>
      {newSound ? (
        <View style={styles.new}>
          <Text
            style={[
              styles.newText,
              THEME.TITLE_FONT3,
              {color: theme.CHECK_COLOR},
            ]}>
            {language.newSound}
          </Text>
        </View>
      ) : null}
      {playing > 0 && playSound && playAll && (
        <View style={styles.check}>
          <FastImage
            style={{width: '80%', height: '100%'}}
            source={icons.eqGif}
            resizeMode={FastImage.resizeMode.contain}
          />
        </View>
      )}
      {playing > 0 && playSound && !playAll && (
        <View style={styles.check}>
          <FastImage
            style={{width: '80%', height: '100%'}}
            source={icons.eqPng}
            resizeMode={FastImage.resizeMode.contain}
          />
        </View>
      )}
      {location === 'cloud' && (
        <TouchableOpacity
          style={styles.location}
          onPressIn={() => downloadFromCloud(storage, name, globalCategory)}>
          <Cloud width="60%" height="60%" fill={theme.CHECK_COLOR} />
        </TouchableOpacity>
      )}
      {location === 'device' && (
        <TouchableOpacity
          style={styles.location}
          onPressIn={() => deleteFromDevice(item, name, id, globalCategory)}>
          <Mobile width="60%" height="60%" fill={theme.CHECK_COLOR} />
        </TouchableOpacity>
      )}
      {booked ? (
        <TouchableOpacity
          style={styles.booked}
          onPressIn={() => ToggleBookedSounds(id, booked)}>
          <BookedSVGYes width="60%" height="60%" fill={theme.booked} />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.booked}
          onPressIn={() => ToggleBookedSounds(id, booked)}>
          <BookedSVGNo width="60%" height="60%" fill={theme.booked} />
        </TouchableOpacity>
      )}
      {description.length > 0 && (
        <View
          style={{
            position: 'absolute',
            right: 25,
            bottom: 75,
            borderRadius: 10,
            borderWidth: 1,
            width: 10,
            height: 10,
            borderColor: theme.CHECK_COLOR,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              width: 3,
              height: 3,
              borderColor: theme.CHECK_COLOR,
              borderWidth: 1,
              borderRadius: 10,
            }}></View>
        </View>
      )}
      {playing > 0 && (
        <TouchableOpacity
          style={styles.touchContainer}
          onPress={() => addSound(id, findUseSound, item)}
          onLongPress={() =>
            description.length > 0 ? OpenDescription(description, title) : null
          }>
          <BoxShadow setting={shadowOpt}>
            <ImageBackground
              source={{uri: img}}
              imageStyle={{
                borderRadius: 5,
                resizeMode: 'stretch',
                overflow: 'visible',
              }}
              style={{width: 55, height: 55}}
            />
          </BoxShadow>
        </TouchableOpacity>
      )}
      {playing <= 0 && (
        <TouchableOpacity
          style={styles.touchContainer}
          onPress={() => addSound(id, findUseSound, item)}
          onLongPress={() =>
            description.length > 0 ? OpenDescription(description, title) : null
          }>
          <ImageBackground
            source={{uri: img}}
            imageStyle={{
              borderRadius: 5,
              resizeMode: 'stretch',
              overflow: 'visible',
            }}
            style={{width: 55, height: 55}}
          />
        </TouchableOpacity>
      )}
      <Text style={[styles.title, THEME.TEXT_FONT4, {color: theme.TEXT_COLOR}]}>
        {title}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 10,
    borderRadius: 15,
    width: 110,
    height: 140,
    justifyContent: 'flex-start',
    alignItems: 'center',
    zIndex: 1,
  },
  touchContainer: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: 55,
    height: 55,
    zIndex: 1,
  },
  title: {
    paddingTop: 10,
    textAlign: 'center',
  },
  check: {
    position: 'absolute',
    left: 20,
    top: -10,
    width: 30,
    height: 40,
    zIndex: 99,
  },
  new: {
    position: 'absolute',
    left: 20,
    top: -10,
    width: 40,
    height: 40,
    zIndex: 999,
    transform: [{rotateX: '-45deg'}, {rotateZ: '-45deg'}],
  },
  newText: {
    fontFamily: 'open-bold',
    paddingTop: 5,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  location: {
    position: 'absolute',
    right: 2,
    top: -10,
    width: 35,
    height: 35,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 15,
    zIndex: 999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  booked: {
    position: 'absolute',
    left: 2,
    top: 40,
    width: 35,
    height: 35,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 15,
    zIndex: 999,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
