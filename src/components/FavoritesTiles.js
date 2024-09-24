import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  useWindowDimensions,
  Platform,
  TouchableOpacity,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {CloseItemSVG, EditSVG} from './ui/SVG';
import {modalShow} from '../store/actions/modal';
import {THEME} from '../theme';
import {mixData} from '../data';
import {AddFavoritesSound} from '../store/actions/sounds';
import {ChangeStateMusic} from '../store/actions/music';
import {ChangeCurrentMixPlay} from '../store/actions/favorites';
import {BoxShadow} from 'react-native-shadow';

export const FavoritesTiles = ({item, use}) => {
  const language = useSelector(state => state.language);
  const width = useWindowDimensions().width;
  const currentMix = useSelector(state => state.favorites.currentMix);
  const [playing, setPlaying] = useState(use);
  const favorites = useSelector(state => state.favorites.favorites);
  const theme = useSelector(state => state.theme);
  const db = useSelector(state => state.db);

  const music = db.musics[item.StateMusic.id - 1]
    ? `${db.musics[item.StateMusic.id - 1].title[language.name]}`
    : '';
  const mixedsounds = item.StateSound.mixedSound
    .map(sound => ' ' + db.sounds[sound.id - 1].title[language.name])
    .toString();
  const sounds = mixedsounds ? (music ? `,${mixedsounds}` : mixedsounds) : '';
  const textMessage = music + sounds;

  const dispatch = useDispatch();
  const editMix = id => {
    const modalInfo = Object.assign(
      {id: id},
      language.modalMessages.editFavoriteMix,
    );
    dispatch(modalShow(modalInfo));
  };

  const removeMix = id => {
    const modalInfo = Object.assign(
      {id: id, name: item.name},
      language.modalMessages.removeFavoriteMix,
      {
        message: `${language.modalMessages.removeFavoriteMix.message} "${item.name}"?`,
      },
    );
    dispatch(modalShow(modalInfo));
  };

  const PlayFavorite = id => {
    favorites[id - 1].StateSound
      ? dispatch(AddFavoritesSound(favorites[id - 1].StateSound))
      : null;
    favorites[id - 1].StateMusic
      ? dispatch(ChangeStateMusic(favorites[id - 1].StateMusic))
      : null;
    dispatch(
      ChangeCurrentMixPlay({
        name: favorites[id - 1].name,
        id: favorites[id - 1].id,
      }),
    );
  };

  useEffect(() => {
    setPlaying(use ? true : false);
  }, [currentMix]);

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
      justifyContent: 'center',
      alignItems: 'center',
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
      justifyContent: 'center',
      alignItems: 'center',
    },
  };

  return (
    <View style={styles.containerItem}>
      <BoxShadow setting={playing ? shadowOptYes : shadowOptNo}>
        <View
          style={[
            styles.screen,
            playing
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
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
            onPress={() => PlayFavorite(item.id)}>
            <View
              style={{
                width: width * 0.15,
                justifyContent: 'center',
                alignItems: 'center',
                marginLeft: 5,
              }}>
              <ImageBackground
                source={mixData.img}
                imageStyle={{borderRadius: 5}}
                style={styles.image}
              />
            </View>
            <View
              style={{
                width: width * 0.5,
                height: '100%',
                justifyContent: 'space-around',
                alignItems: 'center',
                paddingTop: 5,
                paddingBottom: 5,
                paddingLeft: 5,
              }}>
              <Text
                style={[THEME.TITLE_FONT, {color: theme.TEXT_COLOR}]}
                numberOfLines={1}>
                {item.name}
              </Text>
              <Text
                style={[THEME.TEXT_FONT3, {color: theme.TEXT_COLOR}]}
                numberOfLines={2}>
                {textMessage}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              width: 40,
              height: 40,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => editMix(item.id)}>
            <EditSVG width="55%" height="55%" fill={theme.ITEM_COLOR} />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              width: 40,
              height: 40,
              marginRight: 5,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => removeMix(item.id)}>
            <CloseItemSVG width="55%" height="55%" fill={theme.ITEM_COLOR} />
          </TouchableOpacity>
        </View>
      </BoxShadow>
    </View>
  );
};

const styles = StyleSheet.create({
  containerItem: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  screen: {
    width: '99.5%',
    height: 70,
    borderRadius: 15,
    opacity: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  image: {
    width: 40,
    height: 40,
    resizeMode: 'stretch',
  },
});
