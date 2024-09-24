import React from 'react';
import {View} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useSelector} from 'react-redux';
import {SoundsTabNavigation} from './SoundsTabNavigation';
import {MusicsTabNavigation} from './MusicsTabNavigation';
import {FavouritesTabNavigation} from './FavouritesTabNavigation';
import {SettingsScreen} from '../screens/SettingsScreen';
import {CustomBottomTab} from '../components/ui/CustomBottomTab';
import {
  MusicSVG,
  SoundSVG,
  SettingsSVG,
  HeartSVGforSection,
} from '../components/ui/SVG';

const SectionsTab = createBottomTabNavigator();

export const SectionsTabNavigation = ({navigation}) => {
  const language = useSelector(state => state.language);
  const theme = useSelector(state => state.theme);
  return (
    <SectionsTab.Navigator
      initialRouteName="SoundsTabNavigation"
      backBehavior="initialRoute"
      tabBar={props => {
        return (
          <CustomBottomTab {...props} label={language.headerTitle.library} />
        );
      }}>
      <SectionsTab.Screen
        name="FavouritesTabNavigation"
        component={FavouritesTabNavigation}
        options={{
          tabBarLabel: language.section.favoriteMix,
          tabBarIcon: (
            <View
              style={{
                width: 25,
                height: 25,
              }}>
              <HeartSVGforSection
                width="100%"
                height="100%"
                fill={theme.ITEM_COLOR}
              />
            </View>
          ),
          headerShown: false,
        }}
      />

      <SectionsTab.Screen
        name="SoundsTabNavigation"
        component={SoundsTabNavigation}
        options={{
          tabBarLabel: language.section.sounds,
          tabBarIcon: (
            <View
              style={{
                width: 30,
                height: 30,
              }}>
              <SoundSVG width="100%" height="100%" fill={theme.ITEM_COLOR} />
            </View>
          ),
          headerShown: false,
        }}
      />
      <SectionsTab.Screen
        name="MusicsTabNavigation"
        component={MusicsTabNavigation}
        options={{
          tabBarLabel: language.section.musics,
          tabBarIcon: (
            <View
              style={{
                width: 30,
                height: 30,
              }}>
              <MusicSVG width="100%" height="100%" fill={theme.ITEM_COLOR} />
            </View>
          ),
          headerShown: false,
        }}
      />
      <SectionsTab.Screen
        name="SettingsScreen"
        component={SettingsScreen}
        options={{
          tabBarLabel: language.section.settings,
          tabBarIcon: (
            <View
              style={{
                width: 25,
                height: 25,
              }}>
              <SettingsSVG width="100%" height="100%" fill={theme.ITEM_COLOR} />
            </View>
          ),
          headerShown: false,
        }}
      />
    </SectionsTab.Navigator>
  );
};
