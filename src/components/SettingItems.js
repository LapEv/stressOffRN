import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {StyleSheet, TouchableOpacity, Text, Switch, View} from 'react-native';
import {THEME} from '../theme';
import {ChangeTheme} from '../store/actions/theme';
import {BoxShadow} from 'react-native-shadow';
import {ArrowRightSVG} from '../components/ui/SVG';
import {modalShow} from '../store/actions/modal';
import {
  SoundSizes,
  MusicsSizes,
  BrainWavesSizes,
  FileSizeToString,
} from './function/FileFunction';
import {modalShowMessage} from '../store/actions/modalMessage';
import {updateThemeFB} from './function/FirebaseFunction';

export const SettingItems = ({
  name,
  value,
  _key,
  width,
  navigation,
  settingItemsData,
}) => {
  const user = useSelector(state => state.user);
  const language = useSelector(state => state.language);
  const theme = useSelector(state => state.theme);
  const [isEnabled, setIsEnabled] = useState(
    theme.name !== THEME.MAIN_THEME.name ? true : false,
  );

  const dispatch = useDispatch();

  const toggleSwitch = () => {
    _key === 'Theme' ? changeThemeHandler(isEnabled) : null;
    setIsEnabled(previousState => !previousState);
  };

  const changeThemeHandler = async isEnabled => {
    const newTheme = isEnabled ? THEME.MAIN_THEME : THEME.LIGHT_THEME;
    if (theme.currentTheme !== newTheme.name) {
      dispatch(ChangeTheme(newTheme.name));
      await updateThemeFB(newTheme.name, user.uid);
    }
  };

  const Press = async () => {
    if (_key === settingItemsData[0].data[1]._key) {
      navigation.navigate('LanguageScreen');
    }
    if (_key === settingItemsData[1].data[0]._key) {
      const soundSize = await SoundSizes();
      const musicSize = await MusicsSizes();
      const totalSize = soundSize + musicSize;
      const soundSizeString = FileSizeToString(soundSize);
      const musicSizeString = FileSizeToString(musicSize);
      const totalSizeString = FileSizeToString(totalSize);
      language.modalMessages.TotalSize.message = `${language.modalMessages.TotalSize.message1}${soundSizeString} \n${language.modalMessages.TotalSize.message2}${musicSizeString} \n\n${language.modalMessages.TotalSize.message4}${totalSizeString}`;
      dispatch(modalShowMessage(language.modalMessages.TotalSize));
    }
    if (_key === settingItemsData[1].data[1]._key) {
      dispatch(modalShow(language.modalMessages.deleteAllFromDevice));
    }
    if (_key === settingItemsData[1].data[2]._key) {
      navigation.navigate('FeedBackScreen');
    }
    if (_key === settingItemsData[2].data[0]._key) console.log('terms');
  };

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

  return (
    <TouchableOpacity
      disabled={_key === THEME.theme._key ? true : false}
      onPress={Press}>
      {_key === THEME.theme._key ? (
        <BoxShadow setting={shadowOpt}>
          <Text style={[THEME.TEXT_FONT, {color: theme.TEXT_COLOR}]}>
            {name}
          </Text>
          <Switch
            trackColor={{
              false: theme.BACKGROUNDCOLOR_HEADER,
              true: theme.CHECK_COLOR,
            }}
            thumbColor={isEnabled ? theme.ITEM_COLOR : theme.ITEM_COLOR}
            ios_backgroundColor={theme.BACKGROUNDCOLOR}
            onValueChange={toggleSwitch}
            value={isEnabled}
          />
        </BoxShadow>
      ) : (
        <BoxShadow setting={shadowOpt}>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              height: 50,
            }}>
            <Text
              style={[
                THEME.TEXT_FONT,
                {
                  color: theme.TEXT_COLOR,
                  textAlignVertical: 'center',
                  textAlign: 'center',
                },
              ]}>
              {name}
            </Text>
          </View>
          <TouchableOpacity
            style={{
              width: 25,
              height: 25,
            }}
            onPress={() => navigation.navigate('PlayerScreen')}>
            <ArrowRightSVG width="100%" height="100%" fill={theme.ITEM_COLOR} />
          </TouchableOpacity>
        </BoxShadow>
      )}
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    height: 60,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 5,
    paddingLeft: 30,
    paddingRight: 15,
  },
});
