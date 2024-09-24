import React, {useRef} from 'react';
import {StyleSheet, View, FlatList} from 'react-native';
import {useSelector} from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import {CONST} from '../const';
import {MusicTiles} from '../components/MusicTiles';

export const MusicScreen = ({route}) => {
  const language = useSelector(state => state.language);
  const theme = useSelector(state => state.theme);
  const playingMusicId = useSelector(state => state.music.id);
  const musicDB = useSelector(state => state.db.musics);

  const data = musicDB.filter(
    value => value.category[language.name] === route.name,
  );

  const renderItem = ({item}) => {
    return (
      <MusicTiles
        id={item.id}
        findUseMusic={playingMusicId === item.id ? true : false}
        item={musicDB[item.id - 1].sound}
        img={musicDB[item.id - 1].img}
        title={musicDB[item.id - 1].title[language.name]}
        description={musicDB[item.id - 1].description[language.name]}
        location={musicDB[item.id - 1].location}
        storage={musicDB[item.id - 1].storage}
        name={musicDB[item.id - 1].name}
        booked={musicDB[item.id - 1].booked}
        globalCategory={musicDB[item.id - 1].globalCategory}
        newSnd={musicDB[item.id - 1].new}
      />
    );
  };

  const flatlistRef = useRef();
  const scroll = () => {
    if (route.params && route.params.scrollToEnd) {
      setTimeout(() => {
        flatlistRef.current.scrollToEnd({animated: true});
      }, 1000);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={theme.BACKGROUNDCOLOR_LG}
        style={CONST.MAIN_BACKGROUNDSTYLES}>
        <FlatList
          ref={flatlistRef}
          initialScrollIndex={0}
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
    flex: 1,
  },
  screen: {
    width: '100%',
    height: '100%',
    margin: 5,
  },
  textWrap: {
    padding: 10,
  },
});
