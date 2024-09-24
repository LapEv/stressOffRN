import React, {useState, useRef} from 'react';
import {StyleSheet, View, FlatList} from 'react-native';
import {useSelector} from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import {CONST} from '../const';
import {SoundsTiles} from '../components/SoundsTiles';
import {THEME} from '../theme';

export const SoundsScreen = ({route}) => {
  const language = useSelector(state => state.language);
  const theme = useSelector(state => state.theme);
  const soundDB = useSelector(state => state.db.sounds);
  const playingDataSound = useSelector(state => state.sound.mixedSound).map(
    value => (value.id ? value.id : ''),
  );

  const data = soundDB.filter(
    value => value.category[language.name] === route.name,
  );

  const flatlistRef = useRef();
  const scroll = () => {
    if (route.params && route.params.scrollToEnd) {
      setTimeout(() => {
        flatlistRef.current.scrollToEnd({animated: true});
        route.params.scrollToEnd = false;
      }, 1000);
    }
  };

  const scrollToTop = () => {
    setTimeout(() => {
      flatlistRef.current.scrollToIndex({index: 0, animated: true});
    }, 1000);
  };

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
        <FlatList
          initialScrollIndex={0}
          ref={flatlistRef}
          horizontal={false}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          numColumns={CONST.FLATLIST.numberColumns}
          style={styles.screen}
          data={data}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          onFocus={scroll()}
          getItemLayout={(data, index) => ({
            length: 150,
            offset: 150 * index,
            index,
          })}
          ListHeaderComponent={<View style={{height: 20}}></View>}
          ListFooterComponent={<View style={{height: 70}}></View>}
        />
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
  },
  screen: {
    width: '100%',
    height: '100%',
  },
});
