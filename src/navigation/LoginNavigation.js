import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SignUpScreen } from '../screens/LoginScreens/SignUpScreen';
import { LoginScreen } from '../screens/LoginScreens/LoginScreen';
import { ResetPasswordScreen } from '../screens/LoginScreens/ResetPasswordScreen';

const LoginNavigator = createNativeStackNavigator();

const horizontalAnimation = {
  headerShown: false,
  cardStyleInterpolator: ({ current, layouts }) => {
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

export const LoginNavigation = () => {
  return (
    <LoginNavigator.Navigator initialRouteName="LoginScreen">
      <LoginNavigator.Screen
        name="SignUpScreen"
        component={SignUpScreen}
        options={horizontalAnimation}
      />
      <LoginNavigator.Screen
        name="LoginScreen"
        component={LoginScreen}
        options={horizontalAnimation}
      />
      <LoginNavigator.Screen
        name="ResetPasswordScreen"
        component={ResetPasswordScreen}
        options={horizontalAnimation}
      />
    </LoginNavigator.Navigator>
  );
};
