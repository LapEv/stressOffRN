import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
  TouchableOpacity,
} from 'react-native';
import {useSelector} from 'react-redux';
import {THEME} from '../theme';
import {updateStatusUnreadNotification} from './function/FirebaseFunction';

export const NotificationTiles = ({
  id,
  date,
  title,
  body,
  unread,
  screen,
  section,
  languageName,
  navigation,
}) => {
  const user = useSelector(state => state.user);
  const theme = useSelector(state => state.theme);
  const dbNotifications = useSelector(state => state.db.notifications);
  const width = useWindowDimensions().width;
  const [isUnread, setReaded] = useState(unread);

  useEffect(() => {
    const status = dbNotifications.find(value => value.id === id).unread;
    isUnread && !status
      ? (setReaded(unread), updateStatusUnreadNotification(id, user.uid))
      : null;
  }, [dbNotifications]);

  const redirectToScreen = () => {
    if (screen) {
      navigation.navigate('SectionsTabNavigation', {
        screen: section,
        params: {
          screen: screen[languageName],
          scrollToEnd: true,
        },
      });
    }
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={redirectToScreen}
      disabled={screen ? false : true}>
      <Text
        style={[
          styles.title,
          {color: theme.TEXT_COLOR, marginLeft: 30},
          THEME.TEXT_FONT2,
        ]}>
        {date}
      </Text>
      <View
        style={{
          width: width * 0.9,
          minHeight: 80,
          borderRadius: 10,
          backgroundColor: theme.BACKGROUNDCOLOR,
          padding: 15,
          marginTop: 10,
          marginBottom: 30,
        }}>
        <Text
          style={[
            styles.title,
            {color: theme.TEXT_COLOR},
            !isUnread ? THEME.TEXT_FONT2 : THEME.TITLE_FONT2,
          ]}>
          {title}
        </Text>
        <Text
          style={[
            styles.title,
            {color: theme.TEXT_COLOR, marginTop: 10},
            !isUnread ? THEME.TEXT_FONT3 : THEME.TEXT_FONT2,
          ]}>
          {body}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
});
