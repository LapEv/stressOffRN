import React, {useRef} from 'react';
import {StyleSheet, View, FlatList, Text} from 'react-native';
import {useSelector} from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import {CONST} from '../const';
import {THEME} from '../theme.js';
import {SoundsTiles} from '../components/SoundsTiles';

export const BookedScreenSounds = ({route}) => {
  const language = useSelector(state => state.language);
  const theme = useSelector(state => state.theme);
  const soundDB = useSelector(state => state.db.sounds);
  const playingDataSound = useSelector(state => state.sound.mixedSound).map(
    value => (value.id ? value.id : ''),
  );

  // console.log('soundDB = ', soundDB[0]);

  const data = soundDB.filter(value => value.booked);

  const flatlistRef = useRef();
  const scroll = () => {
    if (route.params && route.params.scrollToEnd) {
      setTimeout(() => {
        flatlistRef.current.scrollToEnd({animated: true});
        route.params.scrollToEnd = false;
      }, 1000);
    }
  };
  // const scrollToTop = () => {
  //   setTimeout(() => {
  //     flatlistRef.current.scrollToIndex({index: 0, animated: true});
  //   }, 1000);
  // };

  const renderItem = ({item}) => {
    const findUseSound = playingDataSound.findIndex(value => value === item.id);
    return (
      <SoundsTiles
        id={item.id}
        findUseSound={findUseSound < 0 ? false : true}
        item={item.sound}
        img={soundDB[item.id - 1].img}
        title={soundDB[item.id - 1].title[language.name]}
        description={soundDB[item.id - 1].description[language.name]}
        location={soundDB[item.id - 1].location}
        storage={soundDB[item.id - 1].storage}
        name={soundDB[item.id - 1].name}
        booked={soundDB[item.id - 1].booked}
        globalCategory={soundDB[item.id - 1].globalCategory}
        newSnd={soundDB[item.id - 1].new}
      />
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={theme.BACKGROUNDCOLOR_LG}
        style={CONST.MAIN_BACKGROUNDSTYLES}>
        {data.length ? (
          <FlatList
            initialScrollIndex={0}
            ref={flatlistRef}
            horizontal={false}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            numColumns={CONST.FLATLIST.numberColumns}
            style={styles.screen}
            onFocus={scroll()}
            data={data}
            renderItem={renderItem}
            keyExtractor={item => item.id.toString()}
            getItemLayout={(data, index) => ({
              length: 150,
              offset: 150 * index,
              index,
            })}
            ListHeaderComponent={<View style={{height: 20}}></View>}
            ListFooterComponent={<View style={{height: 70}}></View>}
          />
        ) : (
          <View
            style={{
              width: '100%',
              height: '100%',
              justifyContent: 'flex-start',
              alignItems: 'center',
              paddingTop: 20,
            }}>
            <Text
              style={[
                THEME.TITLE_FONT3,
                {color: theme.TEXT_COLOR, opacity: 0.9},
              ]}>
              {language.Messages.emptyBookedList}
            </Text>
          </View>
        )}
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  screen: {
    width: '100%',
    height: '100%',
  },
});
