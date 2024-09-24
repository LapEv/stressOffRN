import React, {useState, useEffect} from 'react';
import {
  View,
  useWindowDimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import {useSelector} from 'react-redux';
import {BackSVG, SettingsSVG, NotificationsSVG} from './SVG';
import {THEME} from '../../theme';
import {BoxShadow} from 'react-native-shadow';

export const CustomHeader = ({navigation, label}) => {
  const width = useWindowDimensions().width;
  const theme = useSelector(state => state.theme);
  const screen = navigation.getState().routes[navigation.getState().index].name;
  const dbNotifications = useSelector(state => state.db.notifications);
  const [countNotReaded, setCountNotReaded] = useState(0);

  useEffect(() => {
    const notificationsReaded = dbNotifications
      .map(value => value.unread)
      .filter(value => value).length;
    setCountNotReaded(notificationsReaded);
  }, [dbNotifications]);

  const shadowOpt = {
    width: width,
    height: 57,
    color: '#000',
    border: 10,
    radius: 0,
    opacity: 0.7,
    x: 0,
    y: 0,
    style: {
      zIndex: 199,
    },
  };

  return (
    <BoxShadow setting={shadowOpt}>
      <View
        style={[
          styles.container,
          {
            zIndex: 3,
            backgroundColor: theme.BACKGROUNDCOLOR_HEADER,
          },
        ]}>
        {screen !== 'PlayerScreen' ? (
          <View
            style={{
              height: 50,
            }}>
            <TouchableOpacity
              style={{
                width: 30,
                height: 30,
              }}
              onPress={() => navigation.goBack()}>
              <BackSVG width="100%" height="100%" fill={theme.ITEM_COLOR} />
            </TouchableOpacity>
          </View>
        ) : (
          <View></View>
        )}
        <Text
          style={[
            styles.text,
            {
              color: theme.TEXT_COLOR,
              height: 40,
            },
          ]}>
          {label}
        </Text>
        <View
          style={{
            // width: width * 0.3,
            height: 50,
            // justifyContent: 'center',
            // alignItems: 'flex-end',
          }}>
          {/* <View style={{width: 60}}>
          <TouchableOpacity
            style={{
              width: 30,
              height: 30,
            }}
            onPress={() => navigation.navigate('SettingsScreen')}>
            <SettingsSVG width="100%" height="100%" fill={theme.ITEM_COLOR} />
          </TouchableOpacity>
        </View> */}
          <TouchableOpacity
            style={{
              width: 30,
              height: 30,
            }}
            onPress={() => navigation.navigate('NotificationsScreen')}>
            <NotificationsSVG
              width="100%"
              height="100%"
              fill={theme.ITEM_COLOR}
            />
            {countNotReaded > 0 && (
              <View
                style={{
                  position: 'absolute',
                  width: '70%',
                  height: '70%',
                  borderRadius: 70,
                  right: -12,
                  top: -8,
                  opacity: 0.9,
                  backgroundColor: theme.CHECK_COLOR,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text style={[THEME.TEXT_FONT2, {color: theme.TEXT_COLOR}]}>
                  {countNotReaded}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </BoxShadow>
  );
};

const styles = StyleSheet.create({
  container: {
    // width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 40,
    padding: 20,
    height: 50,
    zIndex: 99,
  },
  text: THEME.TITLE_FONT,
});
