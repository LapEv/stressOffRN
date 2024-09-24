import React from 'react';
import {ImageBackground} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {useSelector} from 'react-redux';
import {MixesScreen} from '../screens/MixesScreen';
import {CustomTab} from '../components/ui/CustomTab';
import {BookedScreenSounds} from '../screens/BookedScreenSounds';
import {BookedScreenMusics} from '../screens/BookedScreenMusics';
import {favoritesCat} from '../data';

const FavouritesTab = createMaterialTopTabNavigator();

export const FavouritesTabNavigation = ({navigation}) => {
  const headerTitle = useSelector(state => state.language.headerTitle);
  const categories = useSelector(state => state.language.categoryFavorites);
  const theme = useSelector(state => state.theme);
  const arrIcons =
    theme.name === 'MAIN_THEME'
      ? favoritesCat.MAIN_THEME
      : favoritesCat.LIGHT_THEME;

  return (
    <FavouritesTab.Navigator
      initialRouteName="MixesScreen"
      backBehavior="initialRoute"
      tabBar={props => {
        return (
          <CustomTab
            {...props}
            label={headerTitle.library}
            categories={categories}
          />
        );
      }}>
      <FavouritesTab.Screen
        name="MixesScreen"
        component={MixesScreen}
        options={{
          tabBarLabel: categories[0].name,
          tabBarIcon: (
            <ImageBackground
              source={arrIcons[0]}
              style={{
                width: 45,
                height: 35,
                resizeMode: 'stretch',
              }}
            />
          ),
          title: categories[0].name,
        }}
      />
      <FavouritesTab.Screen
        name="BookedScreenSounds"
        component={BookedScreenSounds}
        options={{
          tabBarLabel: categories[1].name,
          tabBarIcon: (
            <ImageBackground
              source={arrIcons[1]}
              style={{
                width: 45,
                height: 35,
                resizeMode: 'stretch',
              }}
            />
          ),
          title: categories[1].name,
        }}
      />
      <FavouritesTab.Screen
        name="BookedScreenMusics"
        component={BookedScreenMusics}
        options={{
          tabBarLabel: categories[2].name,
          tabBarIcon: (
            <ImageBackground
              source={arrIcons[2]}
              style={{
                width: 45,
                height: 35,
                resizeMode: 'stretch',
              }}
            />
          ),
          title: categories[2].name,
        }}
      />
    </FavouritesTab.Navigator>
  );
};
