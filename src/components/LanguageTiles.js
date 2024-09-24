import React, {useEffect, useState} from 'react';
import {Text, View, TouchableOpacity, useWindowDimensions} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {CheckSVG} from './ui/SVG';
import {BoxShadow} from 'react-native-shadow';
import {
  ChangeLanguage,
  CreateLanguageCategory,
} from '../store/actions/language';
import {THEME} from '../theme';
import {LANGUAGE} from '../language';
import {ChangeCurrentMixPlay} from '../store/actions/favorites';
import {updateLanguageFB} from '../components/function/FirebaseFunction';

export const LanguageTiles = ({title, name}) => {
  const user = useSelector(state => state.user);
  const width = useWindowDimensions().width;
  const theme = useSelector(state => state.theme);
  const language = useSelector(state => state.language);
  const [active, setActive] = useState(name === language.name ? true : false);
  const currentMix = useSelector(state => state.favorites.currentMix);
  const soundDB = useSelector(state => state.db.sounds);
  const musicDB = useSelector(state => state.db.musics);

  const dispatch = useDispatch();

  const shadowOpt = {
    width: width * 0.9,
    height: 70,
    color: theme.BACKGROUNDCOLOR,
    border: 4,
    radius: 15,
    opacity: 0.7,
    x: 0,
    y: 0,
    style: {
      padding: 20,
      paddingRight: 10,
      margin: 20,
      borderRadius: 15,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderColor: theme.borderColor,
      borderWidth: 1,
    },
  };

  useEffect(() => {
    language.name !== name && active ? setActive(false) : null;
  }, [language.name]);

  // async function setAsyncStorageValueFor(key, value) {
  //   try {
  //     return await AsyncStorage.setItem(key, JSON.stringify(value));
  //   } catch (e) {
  //     console.log('SettingsItems: Error: ', e);
  //   }
  // }

  const ChangeNameOfMediaLink = name => {
    Object.keys(LANGUAGE).find(key => {
      if (LANGUAGE[key].currentMix === currentMix) {
        dispatch(
          ChangeCurrentMixPlay({
            name: LANGUAGE[name].currentMix,
          }),
        );
      }
    });
  };

  const getCategoriesSounds = _key => {
    return soundDB
      .map(value => value.category[_key])
      .filter((item, index, arr) => arr.indexOf(item) === index)
      .map((value, index) => ({
        ['id']: index + 1,
        ['name']: value,
      }));
  };

  const getCategoriesMusics = _key => {
    return musicDB
      .map(value => value.category[_key])
      .filter((item, index, arr) => arr.indexOf(item) === index)
      .map((value, index) => ({
        ['id']: index + 1,
        ['name']: value,
      }));
  };

  const ChangeLanguauge = async () => {
    const categorySounds = getCategoriesSounds(name);
    const categoriesMusic = getCategoriesMusics(name);
    setActive(true);
    // setAsyncStorageValueFor(CONST.language.key, name);
    ChangeNameOfMediaLink(name);
    dispatch(
      ChangeLanguage({
        _name: name,
        _categorySounds: categorySounds,
        _categoriesMusic: categoriesMusic,
        _categoryFavorites: LANGUAGE[name].categoryFavorites,
      }),
    );
    await updateLanguageFB(name, user.uid);
  };

  return (
    <TouchableOpacity onPress={() => ChangeLanguauge()}>
      <BoxShadow setting={shadowOpt}>
        <Text
          style={[
            THEME.TEXT_FONT,
            {
              color: theme.TEXT_COLOR,
              width: '50%',
              height: 60,
              textAlign: 'left',
              paddingLeft: 20,
              textAlignVertical: 'center',
            },
          ]}>
          {title}
        </Text>
        <View
          style={{
            width: '50%',
            height: 60,
            alignItems: 'flex-end',
            justifyContent: 'center',
          }}>
          <CheckSVG
            width={active ? '70%' : '0'}
            height={active ? '70%' : '0'}
            fill={theme.ITEM_COLOR}
          />
        </View>
      </BoxShadow>
    </TouchableOpacity>
  );
};
