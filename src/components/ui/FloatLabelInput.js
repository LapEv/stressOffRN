import React from 'react';
import {FloatingLabelInput} from 'react-native-floating-label-input';
import {useSelector} from 'react-redux';

export const FloatLabelInput = props => {
  const theme = useSelector(state => state.theme);
  const fliStyles = {
    customLabelStyles: {
      colorFocused: '#aaa',
      colorBlurred: '#aaa',
      fontSizeFocused: 12,
      fontSizeBlurred: 16,
    },
    labelStyles: {
      paddingHorizontal: 5,
      paddingTop: 0,
      color: '#aaa',
    },
    inputStyles: {
      color: theme.TEXT_COLOR,
      paddingTop: 25,
      paddingHorizontal: 10,
      fontSize: 18,
    },
  };
  return (
    <FloatingLabelInput
      label={props.label}
      value={props.value}
      isPassword={props.isPassword}
      hintTextColor={props.hintTextColor}
      onChangeText={props.onChangeText}
      containerStyles={props.containerStyles}
      customLabelStyles={fliStyles.customLabelStyles}
      labelStyles={fliStyles.labelStyles}
      inputStyles={fliStyles.inputStyles}
    />
  );
};
