import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {ToggleAllSound} from '../store/actions/sounds';
import {BoxShadow} from 'react-native-shadow';
import {ArrowRightSVG, PlaySVG, PauseSVG} from '../components/ui/SVG';
import {THEME} from '../theme';

export const MediaLink = ({navigation}) => {
  const theme = useSelector(state => state.theme);
  const language = useSelector(state => state.language);
  const width = useWindowDimensions().width;
  const [play, setPlay] = useState(false);
  const playSoundsAll = useSelector(state => state.sound.playAll);
  const currentMix = useSelector(state => state.favorites.currentMix);

  useEffect(() => {
    !playSoundsAll ? setPlay(false) : setPlay(true);
  }, [playSoundsAll]);

  const dispatch = useDispatch();
  const setStatusPlay = () => {
    dispatch(
      ToggleAllSound({
        playAll: !play,
      }),
    );
    setPlay(previousState => !previousState);
  };

  const playingDataSound = useSelector(state => state.sound.mixedSound);
  const playingMusicId = useSelector(state => state.music.id);

  const quantity = playingDataSound.length + (playingMusicId > 0 ? 1 : 0);
  const quantityMessage = `${language.Messages.element}: ${quantity}`;

  const shadowOpt = {
    width: width * 0.95,
    height: 62,
    color: theme.BACKGROUNDCOLOR,
    border: 4,
    radius: 15,
    opacity: 0.7,
    x: 0,
    y: 0,
    style: {
      borderRadius: 15,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.BACKGROUNDCOLOR_TILES,
        },
      ]}>
      <BoxShadow setting={shadowOpt}>
        <View
          style={[
            styles.screen,
            {
              backgroundColor: theme.BACKGROUNDCOLOR,
              borderColor: theme.borderColorRGBA,
              borderWidth: 1,
            },
          ]}>
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <TouchableOpacity
              style={{
                width: 30,
                height: 30,
              }}
              onPress={() => navigation.navigate('PlayerScreen')}>
              <ArrowRightSVG
                width="100%"
                height="100%"
                fill={theme.ITEM_COLOR}
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={{
              flex: 1,
              height: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => navigation.navigate('PlayerScreen')}>
            <Text
              style={[THEME.TEXT_FONT4, {color: theme.TEXT_COLOR}]}
              numberOfLines={1}>
              {currentMix}
            </Text>
            <Text style={[THEME.TEXT_FONT4, {color: theme.TEXT_COLOR}]}>
              {quantityMessage}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{justifyContent: 'center', alignItems: 'center'}}
            onPress={() => setStatusPlay()}>
            {!play || quantity === 0 ? (
              <View
                style={{
                  width: 30,
                  height: 30,
                }}>
                <PlaySVG width="100%" height="100%" fill={theme.ITEM_COLOR} />
              </View>
            ) : (
              <View
                style={{
                  width: 30,
                  height: 30,
                }}>
                <PauseSVG width="100%" height="100%" fill={theme.ITEM_COLOR} />
              </View>
            )}
          </TouchableOpacity>
        </View>
      </BoxShadow>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 90,
    justifyContent: 'center',
    alignItems: 'center',
  },
  screen: {
    width: '99.5%',
    height: 60,
    padding: 15,
    paddingRight: 20,
    borderStyle: 'solid',
    borderRadius: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // margin: 10,
  },
});
