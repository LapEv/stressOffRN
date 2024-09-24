import React, {useEffect} from 'react';
import {BackHandler, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
// import { createStackNavigator } from '@react-navigation/stack';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import {SettingsScreen} from '../screens/SettingsScreen';
import {TimerScreen} from '../screens/TimerScreen';
import {NotificationsScreen} from '../screens/NotificationsScreen';
import {SectionsTabNavigation} from './SectionsTabNavigation';
import {LoginNavigation} from './LoginNavigation';
import {PlayerScreen} from '../screens/PlayerScreen';
import {FeedBackScreen} from '../screens/FeedBackScreen';
import {LanguageScreen} from '../screens/LanguageScreen';
import {ModalAlert} from '../components/Modal';
import {ModalMessage} from '../components/ModalMessage';
import {modalShow} from '../store/actions/modal';
import {DownloadFromCloud} from '../components/DownloadFromCloud';
import {DeleteAllFromDevice} from '../components/DeleteAllFromDevice';

// const Stack = createNativeStackNavigator();
const Stack = createStackNavigator();

const verticalAnimationDownUp = {
  headerShown: false,
  cardStyleInterpolator: ({current, layouts}) => {
    return {
      cardStyle: {
        transform: [
          {
            translateX: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [layouts.screen.width, 0],
            }),
          },
        ],
      },
    };
  },
};

export const AppNavigation = () => {
  const language = useSelector(state => state.language);

  const navigationRef = React.createRef();

  const dispatch = useDispatch();
  const backAction = () => {
    if (navigationRef.current.getRootState().index <= 0) {
      dispatch(modalShow(language.modalMessages.exitApp));
    } else {
      navigationRef.current.goBack();
    }
    return true;
  };

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', backAction);

    return () =>
      BackHandler.removeEventListener('hardwareBackPress', backAction);
  }, []);

  return (
    <NavigationContainer ref={navigationRef}>
      <View>
        <ModalAlert />
      </View>
      <View>
        <ModalMessage />
      </View>
      <View>
        <DownloadFromCloud />
      </View>
      <View>
        <DeleteAllFromDevice />
      </View>
      <Stack.Navigator
        initialRouteName="PlayerScreen"
        backBehavior="initialRoute">
        <Stack.Screen
          name="SectionsTabNavigation"
          component={SectionsTabNavigation}
          options={verticalAnimationDownUp}
        />
        <Stack.Screen
          name="LoginNavigation"
          component={LoginNavigation}
          // options={verticalAnimationDownUp}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="PlayerScreen"
          component={PlayerScreen}
          options={{
            headerShown: false,
            cardStyleInterpolator: ({current, layouts}) => {
              return {
                cardStyle: {
                  transform: [
                    {
                      translateX: current.progress.interpolate({
                        inputRange: [0, 1],
                        outputRange: [layouts.screen.width, 0],
                      }),
                    },
                  ],
                },
              };
            },
            title: language.headerTitle.player,
          }}
        />
        <Stack.Screen
          name="SettingsScreen"
          component={SettingsScreen}
          options={{
            headerShown: false,
            cardStyleInterpolator: ({current, layouts}) => {
              return {
                cardStyle: {
                  transform: [
                    {
                      translateX: current.progress.interpolate({
                        inputRange: [0, 1],
                        outputRange: [layouts.screen.width, 0],
                      }),
                    },
                  ],
                },
              };
            },
            title: language.headerTitle.settings,
          }}
        />
        <Stack.Screen
          name="FeedBackScreen"
          component={FeedBackScreen}
          options={{
            headerShown: false,
            // cardStyleInterpolator: ({current, layouts}) => {
            //   return {
            //     cardStyle: {
            //       transform: [
            //         {
            //           translateX: current.progress.interpolate({
            //             inputRange: [0, 1],
            //             outputRange: [layouts.screen.width, 0],
            //           }),
            //         },
            //       ],
            //     },
            //   };
            // },
            title: language.headerTitle.feedback,
          }}
        />
        <Stack.Screen
          name="LanguageScreen"
          component={LanguageScreen}
          options={{
            headerShown: false,
            // cardStyleInterpolator: ({current, layouts}) => {
            //   return {
            //     cardStyle: {
            //       transform: [
            //         {
            //           translateX: current.progress.interpolate({
            //             inputRange: [0, 1],
            //             outputRange: [layouts.screen.width, 0],
            //           }),
            //         },
            //       ],
            //     },
            //   };
            // },
            title: language.headerTitle.language,
          }}
        />
        <Stack.Screen
          name="TimerScreen"
          component={TimerScreen}
          options={{
            headerShown: false,
            // cardStyleInterpolator: ({current, layouts}) => {
            //   return {
            //     cardStyle: {
            //       transform: [
            //         {
            //           translateX: current.progress.interpolate({
            //             inputRange: [0, 1],
            //             outputRange: [layouts.screen.width, 0],
            //           }),
            //         },
            //       ],
            //     },
            //   };
            // },
            title: language.headerTitle.timer,
          }}
        />
        <Stack.Screen
          name="NotificationsScreen"
          component={NotificationsScreen}
          options={{
            headerShown: false,
            // cardStyleInterpolator: ({current, layouts}) => {
            //   return {
            //     cardStyle: {
            //       transform: [
            //         {
            //           translateX: current.progress.interpolate({
            //             inputRange: [0, 1],
            //             outputRange: [layouts.screen.width, 0],
            //           }),
            //         },
            //       ],
            //     },
            //   };
            // },
            title: language.headerTitle.notifications,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
