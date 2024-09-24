import React from 'react';
import {ImageBackground} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {useSelector} from 'react-redux';
import {SoundsScreen} from '../screens/SoundsScreen';
import {CustomTab} from '../components/ui/CustomTab';
import {soundCat} from '../data';

const SoundsTab = createMaterialTopTabNavigator();

export const SoundsTabNavigation = ({navigation}) => {
  const headerTitle = useSelector(state => state.language.headerTitle);
  const language = useSelector(state => state.language.name);
  const categories = useSelector(state => state.db.soundCategories);
  const theme = useSelector(state => state.theme);

  function CategoriesScreens() {
    const temp = categories.map(value => {
      return (
        <SoundsTab.Screen
          name={value.title[language]}
          key={value.id}
          component={SoundsScreen}
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
    return temp;
  }

  return (
    <SoundsTab.Navigator
      initialRouteName="SoundsScreen"
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
    </SoundsTab.Navigator>
  );
};
