import React, {useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  useWindowDimensions,
  TouchableOpacity,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {modalShow} from '../store/actions/modal';
import LinearGradient from 'react-native-linear-gradient';
import {FavoritesTiles} from '../components/FavoritesTiles';
import {BoxShadow} from 'react-native-shadow';
import {THEME} from '../theme';

export const MixesScreen = ({route}) => {
  const language = useSelector(state => state.language);
  const theme = useSelector(state => state.theme);
  const favorites = useSelector(state => state.favorites);
  const width = useWindowDimensions().width;

  useEffect(() => {}, [favorites]);

  const data = favorites.favorites;

  const dispatch = useDispatch();
  const ClearMixesList = () => {
    console.log('ClearMixesList');
    dispatch(modalShow(language.modalMessages.removeFavoriteAllMix));
  };

  const renderItem = ({item}) => (
    <FavoritesTiles item={item} use={item.name === favorites.currentMix} />
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={theme.BACKGROUNDCOLOR_LG}
        style={{height: '100%'}}>
        <View style={styles.screen}>
          {favorites.favorites.length > 0 ? (
            <FlatList
              horizontal={false}
              style={{width: '100%', height: '100%'}}
              data={data}
              renderItem={renderItem}
              keyExtractor={item => item.id.toString()}
              ListFooterComponent={
                <View
                  style={{
                    width: '100%',
                    height: 200,
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    marginTop: 10,
                  }}>
                  <BoxShadow
                    setting={{
                      width: width * 0.5,
                      height: 52,
                      color: theme.BACKGROUNDCOLOR,
                      border: 7,
                      radius: 10,
                      opacity: 0.7,
                      x: 0,
                      y: 0,
                      style: {
                        borderRadius: 10,
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: 15,
                        opacity: 1,
                        marginTop: 15,
                      },
                    }}>
                    <TouchableOpacity
                      style={{
                        width: '99.5%',
                        height: '100%',
                        backgroundColor: theme.BACKGROUNDCOLOR,
                        borderColor: theme.borderColorRGBA,
                        borderWidth: 1,
                        borderRadius: 10,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                      onPress={ClearMixesList}>
                      <Text
                        style={[THEME.TITLE_FONT, {color: theme.TEXT_COLOR}]}>
                        {language.buttons.clear}
                      </Text>
                    </TouchableOpacity>
                  </BoxShadow>
                </View>
              }
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
                {language.Messages.emptyOwnMixes}
              </Text>
            </View>
          )}
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  screen: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
