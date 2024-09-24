import React, {useState, useRef} from 'react';
import {
  View,
  useWindowDimensions,
  StyleSheet,
  Platform,
  FlatList,
  Animated,
  TouchableOpacity,
} from 'react-native';
import {useSelector} from 'react-redux';
import {BoxShadow} from 'react-native-shadow';
import {dataTab} from '../../data';
import {CustomHeader} from './CustomHeader';
import {MediaLink} from '../MediaLink';
import {THEME} from '../../theme';

export function CustomBottomTab({
  state,
  descriptors,
  navigation,
  label,
  position,
}) {
  const width = useWindowDimensions().width;
  const [pressButton, setPressButton] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const theme = useSelector(state => state.theme);

  const myListBottomTab = useRef();

  const scrollToIndex = index => {
    myListBottomTab.current
      ? myListBottomTab.current.scrollToIndex({
          animated: true,
          index: index,
          viewPosition: 0.5,
        })
      : null;
  };

  const Item = ({item, value, options}) => {
    const fadeAnim = useRef(new Animated.Value(0.6)).current;

    const fadeIn = () => {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    };

    const fadeOut = () => {
      Animated.timing(fadeAnim, {
        toValue: 0.6,
        duration: 500,
        useNativeDriver: true,
      }).start();
    };

    state.index === item.id - 1 ? scrollToIndex(item.id - 1) : null;
    state.index === item.id - 1 ? fadeIn() : fadeOut();

    const buttonMain = {
      width: 90,
      height: 80,
      color:
        state.index == item.id - 1 ? theme.CHECK_COLOR : theme.BACKGROUNDCOLOR,
      border: 5,
      radius: 15,
      opacity: 0.7,
      x: 0,
      y: 0,
      style: {
        margin: 12,
        borderRadius: 15,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9,
      },
    };

    const button = {
      width: 70,
      height: 60,
      color:
        state.index == item.id - 1 ? theme.CHECK_COLOR : theme.BACKGROUNDCOLOR,
      border: 5,
      radius: 15,
      opacity: 0.7,
      x: 0,
      y: 0,
      style: {
        margin: 12,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9,
      },
    };

    const touchbutton = {
      width: item.id === '1' || item.id === '4' ? 70 : 90,
      height: item.id === '1' || item.id === '4' ? 60 : 80,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 15,
      backgroundColor: theme.BACKGROUNDCOLOR,
      borderColor: state.index != item.id - 1 ? theme.borderColorRGBA : null,
      borderWidth: state.index != item.id - 1 ? 1 : null,
      zIndex: 99,
    };

    return (
      <BoxShadow
        setting={item.id === '1' || item.id === '4' ? button : buttonMain}>
        <TouchableOpacity
          title={value.routeName}
          key={value.key}
          accessibilityRole="button"
          accessibilityState={state.index === item.id ? {selected: true} : {}}
          accessibilityLabel={options.tabBarAccessibilityLabel}
          testID={options.tabBarTestID}
          onPress={() => {
            setPressButton(true);
            const event = navigation.emit({
              type: 'tabPress',
              target: value.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(value.name);
            }
          }}
          onLongPress={() => {
            setPressButton(true);
            navigation.emit({
              type: 'tabLongPress',
              target: value.key,
            });
          }}
          style={touchbutton}>
          <Animated.View style={{opacity: fadeAnim}}>
            {options.tabBarIcon}
          </Animated.View>
          <Animated.Text
            style={{
              opacity: fadeAnim,
              color: theme.TEXT_COLOR,
              paddingTop: 5,
              fontSize: item.id === '1' || item.id === '4' ? 9 : 12,
            }}>
            {options.tabBarLabel}
          </Animated.Text>
        </TouchableOpacity>
      </BoxShadow>
    );
  };

  const renderItem = ({item}) => {
    const value = state.routes[item.id - 1];
    const options = descriptors[state.routes[item.id - 1].key].options;
    return <Item item={item} value={value} options={options} />;
  };

  return (
    <View
      style={{
        width: '100%',
        height: 100,
        position: 'absolute',
        bottom: 0,
      }}>
      <FlatList
        horizontal={true}
        ref={myListBottomTab}
        initialScrollIndex={0}
        onScrollToIndexFailed={info => {
          const wait = new Promise(resolve => setTimeout(resolve, 500));
          wait.then(() => {
            myList.current?.scrollToIndex({
              index: info.index,
              animated: true,
            });
          });
        }}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          flex: 1,
          justifyContent: 'space-between',
          alignItems: 'flex-end',
        }}
        data={dataTab}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
      />
    </View>
  );
}
