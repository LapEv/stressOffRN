import React, {useState} from 'react';
// import firebase from 'firebase';
import LinearGradient from 'react-native-linear-gradient';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Platform,
  useWindowDimensions,
  TouchableOpacity,
} from 'react-native';
import {useSelector} from 'react-redux';
import {FloatLabelInput} from '../../components/ui/FloatLabelInput';
import {THEME} from '../../theme';
import {CONST} from '../../const';
import {BoxShadow} from 'react-native-shadow';
import {CustomHeader} from '../../components/ui/CustomHeader';

export const ResetPasswordScreen = ({route, navigation}) => {
  const language = useSelector(state => state.language);
  const width = useWindowDimensions().width;
  const theme = useSelector(state => state.theme);
  const [reset, setResetPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);

  const handleResetPassword = () => {
    // firebase
    //   .auth()
    //   .sendPasswordResetEmail(reset.trim())
    //   .then(() => navigation.navigate('LoginScreen'))
    //   .catch((error) => setErrorMessage(error.message));
  };

  const shadowOpt = {
    width: (width / 2) * 0.8,
    height: 60,
    color: theme.BACKGROUNDCOLOR,
    border: 4,
    radius: 15,
    opacity: 0.7,
    x: 0,
    y: 0,
    style: {
      margin: 30,
      borderRadius: 15,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      borderColor: theme.CHECK_COLOR,
      borderWidth: 1,
    },
  };
  const heightdescription = 160;
  const fliStyles = {
    containerStyles: {
      borderWidth: 1,
      borderColor: theme.CHECK_COLOR,
      borderRadius: 15,
      height: 60,
      color: theme.TEXT_COLOR,
    },
    containerStylesDescription: {
      borderWidth: 1,
      borderColor: theme.CHECK_COLOR,
      borderRadius: 15,
      height: heightdescription,
      color: theme.TEXT_COLOR,
      textAlignVertical: 'top',
    },
  };

  return (
    <ScrollView style={{flex: 1}} contentContainerStyle={{flexGrow: 1}}>
      <CustomHeader
        navigation={navigation}
        label={language.headerTitle.resetPassword}
      />
      <LinearGradient
        colors={theme.BACKGROUNDCOLOR_LG}
        style={(THEME.MAIN_BACKGROUNDSTYLES, {width: '100%'})}>
        <View style={Platform.OS === 'web' ? styles.web : styles.mobile}>
          <Text style={[THEME.TEXT_FONT5, {color: theme.TEXT_COLOR}]}>
            {language.headerTitle.resetPassword}
          </Text>
          {errorMessage && (
            <Text
              style={[
                THEME.TITLE_FONT3,
                {
                  color: theme.DANGER_COLOR,
                },
              ]}>
              {errorMessage}
            </Text>
          )}
          <View style={styles.floatingItem}>
            <FloatLabelInput
              isPassword={false}
              label="Email"
              value={reset}
              type="text"
              hintTextColor={theme.TEXT_COLOR}
              containerStyles={fliStyles.containerStyles}
              onChangeText={setResetPassword}
            />
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={{
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: width / CONST.timer.numberColumns,
              }}
              onPress={handleResetPassword}>
              <BoxShadow setting={shadowOpt}>
                <Text style={[{color: theme.TEXT_COLOR}, THEME.TITLE_FONT2]}>
                  {language.buttons.resetPassword}
                </Text>
              </BoxShadow>
            </TouchableOpacity>
          </View>
          <View style={styles.optionsContainer}>
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <Text style={[THEME.TEXT_FONT3, {color: theme.TEXT_COLOR}]}>
                {language.Messages.noAccount}
              </Text>
              <TouchableOpacity
                style={{
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  width: width / CONST.timer.numberColumns,
                }}
                onPress={() => navigation.navigate('LoginScreen')}>
                <BoxShadow setting={shadowOpt}>
                  <Text style={[{color: theme.TEXT_COLOR}, THEME.TITLE_FONT2]}>
                    {language.buttons.signIn}
                  </Text>
                </BoxShadow>
              </TouchableOpacity>
            </View>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                height: heightButton,
              }}>
              <Text style={[THEME.TEXT_FONT3, {color: theme.TEXT_COLOR}]}>
                {language.Messages.hasAccount}
              </Text>
              <TouchableOpacity
                style={{
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  width: width / CONST.timer.numberColumns,
                }}
                onPress={() => navigation.navigate('SignUpScreen')}>
                <BoxShadow setting={shadowOpt}>
                  <Text style={[{color: theme.TEXT_COLOR}, THEME.TITLE_FONT2]}>
                    {language.buttons.signUp}
                  </Text>
                </BoxShadow>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </LinearGradient>
    </ScrollView>
  );
};

const heightButton = 50;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  web: {
    width: '40%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mobile: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  floatingItem: {
    width: '70%',
    height: 60,
    marginTop: 8,
    marginVertical: 15,
    paddingLeft: 15,
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    width: 150,
    borderRadius: 25,
    color: 'white',
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 70,
    paddingBottom: 10,
    width: '100%',
    color: 'white',
  },
  buttonOptions: {
    marginTop: 5,
    borderRadius: 25,
    width: 150,
    height: 100,
  },
});
