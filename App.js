import 'react-native-gesture-handler';
import React, {useState} from 'react';
import {Provider} from 'react-redux';
import {bootstrap} from './src/bootstrap';
import {AppNavigation} from './src/navigation/AppNavigation';
import store from './src/store';
import {View, Text} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {CONST} from './src/const';
import FastImage from 'react-native-fast-image';
import Logo from './assets/lotus.gif';
import NetInfo from '@react-native-community/netinfo';
import {setEnableNetworkFB} from './src/components/function/FirebaseFunction';

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const [isBootReady, setIsBootReady] = useState(false);

  const setStateReady = response => {
    response ? setIsReady(true) : setIsReady(false);
  };

  if (!isReady || !isBootReady) {
    return (
      <View style={{flex: 1}}>
        <LinearGradient
          colors={CONST.THEME.BACKGROUNDCOLOR_LG}
          style={CONST.MAIN_BACKGROUNDSTYLES}>
          <FastImage
            style={{width: '50%', height: '50%'}}
            source={Logo}
            resizeMode={FastImage.resizeMode.contain}
            onLoad={() => {
              NetInfo.fetch().then(state => {
                setEnableNetworkFB(state.isConnected);
                bootstrap().then(() => {
                  setStateReady(true);
                  setEnableNetworkFB(true);
                });
              }),
                setTimeout(() => {
                  setIsBootReady(true);
                }, 3000);
            }}
          />
          <Text
            style={{
              color: CONST.THEME.TEXT_COLOR,
              fontSize: CONST.THEME.TITLE_FONT_SIZE,
            }}>
            {CONST.loading}
          </Text>
        </LinearGradient>
      </View>
    );
  }

  return (
    <Provider store={store}>
      <AppNavigation />
    </Provider>
  );
}
