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
import {UpdateMusicsDB, UpdateMusicsStatusDB} from '../store/actions/db';
import {ChangeStateMusic} from '../store/actions/music';
import {ToggleAllSound} from '../store/actions/sounds';
import {ChangeCurrentMixPlay} from '../store/actions/favorites';
import {CONST} from '../const';
import {modalShow} from '../store/actions/modal';
import {modalShowMessage} from '../store/actions/modalMessage';
import {BoxShadow} from 'react-native-shadow';
import FastImage from 'react-native-fast-image';
import {
  CheckSize,
  updateMusicsLocation,
  updateStatusNewMusics,
  updateStatusMusicsBooked,
} from '../components/function/FirebaseFunction';
import {
  CheckFile,
  CheckFileSize,
  FileSizeToString,
} from '../components/function/FileFunction';
import {icons} from '../data';
import {UpdateMusicsBookedDB} from '../store/actions/db';
import {Cloud, Mobile, BookedSVGYes, BookedSVGNo} from '../components/ui/SVG';
import {THEME} from '../theme';

export const MusicTiles = ({
  id,
  findUseMusic,
  img,
  item,
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
  const [playing, setPlaying] = useState(findUseMusic);
  const musicStart = useSelector(state => state.music.musicStart);
  const playAll = useSelector(state => state.sound.playAll);
  const [disabled, setDisabled] = useState(false);
  const width = useWindowDimensions().width;
  const currentPlayingMusicId = useSelector(state => state.music.id);
  const theme = useSelector(state => state.theme);
  const [newSound, setNewSound] = useState(newSnd);

  useEffect(() => {
    !musicStart ? setDisabled(false) : null;
  }, [musicStart]);

  const dispatch = useDispatch();

  const addMusic = async id => {
    updateStatusNewMusics(false, id, user.uid);
    dispatch(UpdateMusicsStatusDB({name: name, new: false}));
    setNewSound(false);
    const check = location === 'device' ? await CheckFile(item) : true;
    check || location !== 'device'
      ? !playing
        ? (setPlaying(previousState => !previousState),
          dispatch(
            ChangeStateMusic({
              id: id,
              playing: true,
              volume: 1.0,
              musicStart: true,
              startApp: false,
              booked: booked,
            }),
          ),
          dispatch(
            ToggleAllSound({
              playAll: true,
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
            ChangeStateMusic({
              id: 0,
              playing: false,
              startApp: false,
            }),
          ),
          dispatch(
            ChangeCurrentMixPlay({
              name: language.Messages.currentMix,
              id: 0,
            }),
          ))
      : ((language.modalMessages.error.message = `${language.Messages.fileNotFound} ${language.Messages.switchToCloud}`),
        await updateMusicsLocation('cloud', id, '', user.uid),
        dispatch(UpdateMusicsDB({name: name, sound: '', location: 'cloud'})),
        dispatch(modalShowMessage(language.modalMessages.error)));
  };

  useEffect(() => {
    currentPlayingMusicId !== id ? setPlaying(false) : setPlaying(true);
  }, [currentPlayingMusicId]);

  const shadowOpt = {
    width: 55,
    height: 55,
    color: '#15a522',
    border: 7,
    radius: 10,
    opacity: 0.8,
    x: 0,
    y: 0,
    style: {marginVertical: 0},
  };

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

  const ToggleBookedMusics = async (id, booked) => {
    await updateStatusMusicsBooked(!booked, id, user.uid);
    dispatch(UpdateMusicsBookedDB({id: id, booked: !booked}));
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
      {playing > 0 && playAll && (
        <View style={styles.check}>
          <FastImage
            style={{width: '80%', height: '100%'}}
            source={icons.eqGif}
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
          onPressIn={() => ToggleBookedMusics(id, booked)}>
          <BookedSVGYes width="60%" height="60%" fill={theme.booked} />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.booked}
          onPressIn={() => ToggleBookedMusics(id, booked)}>
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
      {playing > 0 && !playAll && (
        <View style={styles.check}>
          <FastImage
            style={{width: '80%', height: '100%'}}
            source={icons.eqPng}
            resizeMode={FastImage.resizeMode.contain}
          />
        </View>
      )}
      {playing > 0 && (
        <TouchableOpacity
          style={styles.touchContainer}
          onPress={() => addMusic(id)}
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
          onPress={() => addMusic(id)}
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
    fontFamily: 'open-regular',
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
