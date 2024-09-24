import React from 'react';
import {StyleSheet, Text, View, FlatList} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import {CustomHeader} from '../components/ui/CustomHeader';
import {NotificationTiles} from '../components/NotificationTiles';
import {CONST} from '../const';
import {UpdateNotificationsDB} from '../store/actions/db';
import {THEME} from '../theme';

export const NotificationsScreen = ({navigation}) => {
  const language = useSelector(state => state.language);
  const theme = useSelector(state => state.theme);
  const notificationsDB = useSelector(state => state.db.notifications);

  const formatDate = date => {
    const localDate = new Date(date).toLocaleDateString().split('/').join('.');
    const localTime = new Date(date).toLocaleTimeString();
    return `${localDate} ${localTime}`;
  };
  const renderItem = ({item}) => {
    return (
      <NotificationTiles
        id={item.id}
        date={formatDate(item.date)}
        title={item.title[language.name]}
        body={item.body[language.name]}
        unread={item.unread}
        screen={item.category}
        section={item.navigation}
        languageName={language.name}
        navigation={navigation}
      />
    );
  };

  const dispatch = useDispatch();
  const handleViewableItemsChanged = React.useRef(viewableItems => {
    viewableItems.changed.forEach(value => {
      if (value.isViewable && value.item.unread) {
        dispatch(
          UpdateNotificationsDB({
            id: value.item.id,
          }),
        );
      }
    });
  });

  return (
    <View style={styles.container}>
      <CustomHeader
        navigation={navigation}
        label={language.headerTitle.notifications}
      />
      <LinearGradient
        colors={theme.BACKGROUNDCOLOR_LG}
        style={[
          CONST.MAIN_BACKGROUNDSTYLES,
          {justifyContent: 'flex-start', alignItems: 'center'},
        ]}>
        {!notificationsDB.length && (
          <View style={{marginTop: 20}}>
            <Text
              style={[
                THEME.TEXT_FONT4,
                {
                  color: theme.TEXT_COLOR,
                },
              ]}>
              {language.notifications.noNotifications}
            </Text>
          </View>
        )}
        {notificationsDB.length > 0 && (
          <View style={[styles.screen, {marginTop: 20}]}>
            <FlatList
              contentContainerStyle={{
                justifyContent: 'center',
                alignItems: 'center',
              }}
              data={notificationsDB}
              viewabilityConfig={{
                minimumViewTime: 1500,
                viewAreaCoveragePercentThreshold: 60,
              }}
              onViewableItemsChanged={handleViewableItemsChanged.current}
              renderItem={renderItem}
              keyExtractor={item => item.id.toString()}
              ListFooterComponent={
                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                  <View
                    style={{
                      width: '100%',
                      height: 120,
                    }}></View>
                </View>
              }
            />
          </View>
        )}
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  screen: {
    width: '100%',
  },
});
