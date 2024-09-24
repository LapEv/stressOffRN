import React from 'react';
import {ImageBackground} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {useSelector} from 'react-redux';
import {MusicScreen} from '../screens/MusicScreen';
import {CustomTab} from '../components/ui/CustomTab';

import {musicCat} from '../data';

const MusicsTab = createMaterialTopTabNavigator();

export const MusicsTabNavigation = ({navigation}) => {
  const headerTitle = useSelector(state => state.language.headerTitle);
  const language = useSelector(state => state.language.name);
  const categories = useSelector(state => state.db.musicCategories);
  const theme = useSelector(state => state.theme);

  function CategoriesScreens() {
    return categories.map(value => {
      return (
        <MusicsTab.Screen
          name={value.title[language]}
          key={value.id}
          component={MusicScreen}
          options={{
            tabBarLabel: value.title[language],
            tabBarIcon: (
              <ImageBackground
                source={
                  theme.name === 'MAIN_THEME'
                    ? {uri: value.img}
                    : {uri: value.img_lt}
                }
                style={{
                  width: 45,
                  height: 35,
                  resizeMode: 'stretch',
                }}
              />
            ),
            title: value.title[language],
          }}
        />
      );
    });
  }

  return (
    <MusicsTab.Navigator
      initialRouteName="MusicScreen"
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
      {(() => CategoriesScreens())()}
    </MusicsTab.Navigator>
  );
};
