import React from 'react';
import {useSelector} from 'react-redux';
import {
  StyleSheet,
  Text,
  View,
  SectionList,
  useWindowDimensions,
  TouchableOpacity,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {THEME} from '../theme';
import {CustomHeader} from '../components/ui/CustomHeader';
import {SettingItems} from '../components/SettingItems';
import {BoxShadow} from 'react-native-shadow';
import {CONST} from '../const';

export const SettingsScreen = ({navigation}) => {
  const theme = useSelector(state => state.theme);
  const language = useSelector(state => state.language);
  const width = useWindowDimensions().width;

  const settingItemsData = [
    {
      id: 1,
      title: language.settings.titleDecoration,
      data: [
        {
          name: language.settings.nameTheme,
          value: CONST.settings.theme.value,
          _key: CONST.settings.theme._key,
        },
        {
          name: language.settings.nameLanguage,
          value: CONST.settings.language.value,
          _key: CONST.settings.language._key,
        },
      ],
    },
    {
      id: 2,
      title: language.settings.titleService,
      data: [
        {
          name: language.settings.nameAllSizesFile,
          value: CONST.settings.allSizes.value,
          _key: CONST.settings.allSizes._key,
        },
        {
          name: language.settings.nameDeleteAllFiles,
          value: CONST.settings.deleteAllFiles.value,
          _key: CONST.settings.deleteAllFiles._key,
        },
        {
          name: language.settings.nameToSupport,
          value: CONST.settings.toSupport.value,
          _key: CONST.settings.toSupport._key,
        },
      ],
    },
    {
      id: 3,
      title: language.settings.titleInformation,
      data: [
        {
          name: language.settings.nameTermsOfService,
          value: CONST.settings.termOfService.value,
          _key: CONST.settings.termOfService._key,
        },
      ],
    },
  ];

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

  const renderItem = ({item}) => {
    return (
      <SettingItems
        name={item.name}
        value={item.value}
        _key={item._key}
        width={width}
        navigation={navigation}
        settingItemsData={settingItemsData}
      />
    );
  };

  return (
    <View style={styles.container}>
      <CustomHeader
        navigation={navigation}
        label={language.headerTitle.settings}
      />
      <LinearGradient
        colors={theme.BACKGROUNDCOLOR_LG}
        style={THEME.MAIN_BACKGROUNDSTYLES}>
        <TouchableOpacity
          style={{
            alignItems: 'center',
            justifyContent: 'flex-start',
            width: width / CONST.timer.numberColumns,
          }}
          onPress={() =>
            navigation.navigate('LoginNavigation', {
              screen: 'LoginScreen',
            })
          }>
          <BoxShadow setting={shadowOpt}>
            <Text style={[{color: theme.TEXT_COLOR}, THEME.TITLE_FONT2]}>
              {language.buttons.signIn}
            </Text>
          </BoxShadow>
        </TouchableOpacity>

        <SectionList
          style={{
            width: '100%',
          }}
          contentContainerStyle={{
            justifyContent: 'center',
            alignItems: 'center',
          }}
          sections={settingItemsData}
          keyExtractor={(item, index) => item + index}
          renderItem={renderItem}
          renderSectionHeader={({section: {title, id}}) => (
            <View style={[styles.header, {width: width}]}>
              {id > 1 && (
                <View
                  style={{
                    width: '100%',
                    height: 0.5,
                    backgroundColor: theme.BACKGROUNDCOLOR,
                    ...Platform.select({
                      ios: THEME.SHADOW_FOR_IOS,
                      android: {
                        elevation: 2,
                      },
                    }),
                    borderColor: theme.CHECK_COLOR,
                    borderWidth: 1,
                  }}></View>
              )}
              <Text
                style={[
                  styles.headerText,
                  {color: theme.TEXT_COLOR},
                  THEME.TITLE_FONT,
                ]}>
                {title}
              </Text>
            </View>
          )}
          ListFooterComponent={
            <View
              style={{
                width: '100%',
                height: 180,
              }}></View>
          }
        />
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingLeft: 20,
    paddingRight: 20,
  },
  headerText: {
    paddingTop: 25,
    width: '100%',
    alignSelf: 'stretch',
  },
});
