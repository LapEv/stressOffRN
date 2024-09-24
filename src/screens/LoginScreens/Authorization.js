import React, {useState, useEffect} from 'react';
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
import {CONST} from '../../const';
import {THEME} from '../../theme';
import {BoxShadow} from 'react-native-shadow';
import {CustomHeader} from '../../components/ui/CustomHeader';

export const Authorization = ({route, screen, navigation}) => {
  const language = useSelector(state => state.language);
  const width = useWindowDimensions().width;
  const theme = useSelector(state => state.theme);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShow(!show);
    }, 5000);
    return () => clearTimeout(timeout);
  }, [show]);

  const handleLogin = () => {
    // firebase
    //   .auth()
    //   .signInWithEmailAndPassword(email.trim(), password)
    //   .then(() => {
    //     navigation.navigate(CONST.use_PIN_CODE ? 'PinCodeScreen' : 'Main');
    //   })
    //   .catch((error) => setErrorMessage(error.message));
  };

  const handleSignUp = () => {
    // console.log(email, ' ', password, ' ', confirmPassword);
    // if (password !== confirmPassword) {
    //   setErrorMessage(`Passwords don't match`);
    // } else {
    //   firebase
    //     .auth()
    //     .createUserWithEmailAndPassword(email.trim(), password)
    //     .then(() => {
    //       navigation.navigate(CONST.use_PIN_CODE ? 'PinCodeScreen' : 'Main');
    //     })
    //     .catch((error) => setErrorMessage(error.message));
    // }
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
      paddingRight: 10,
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
        label={language.headerTitle.login}
      />
      <LinearGradient
        colors={theme.BACKGROUNDCOLOR_LG}
        style={(THEME.MAIN_BACKGROUNDSTYLES, {width: '100%'})}>
        <View style={Platform.OS === 'web' ? styles.web : styles.mobile}>
          <Text style={[THEME.TEXT_FONT5, {color: theme.TEXT_COLOR}]}>
            {screen === 'LoginScreen'
              ? language.headerTitle.login
              : language.headerTitle.signUp}
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
              value={email}
              type="text"
              hintTextColor={theme.TEXT_COLOR}
              containerStyles={fliStyles.containerStyles}
              onChangeText={setEmail}
            />
          </View>
          <View style={styles.floatingItem}>
            <FloatLabelInput
              isPassword={true}
              label="Password"
              value={password}
              togglePassword={show}
              hintTextColor={theme.TEXT_COLOR}
              containerStyles={fliStyles.containerStyles}
              onChangeText={setPassword}
            />
          </View>
          {screen === 'SignUpScreen' && (
            <View style={styles.floatingItem}>
              <FloatLabelInput
                isPassword={true}
                label="Confirm Password"
                value={confirmPassword}
                hintTextColor={theme.TEXT_COLOR}
                containerStyles={fliStyles.containerStyles}
                onChangeText={setConfirmPassword}
              />
            </View>
          )}
          <View style={[styles.buttonContainer, {color: theme.TEXT_COLOR}]}>
            <TouchableOpacity
              style={{
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: width / CONST.timer.numberColumns,
              }}
              onPress={screen === 'LoginScreen' ? handleLogin : handleSignUp}>
              <BoxShadow setting={shadowOpt}>
                <Text style={[{color: theme.TEXT_COLOR}, THEME.TITLE_FONT2]}>
                  {screen === 'LoginScreen'
                    ? language.buttons.signIn
                    : language.buttons.signUp}
                </Text>
              </BoxShadow>
            </TouchableOpacity>
          </View>
          <View style={styles.optionsContainer}>
            {screen === 'SignUpScreen' ? (
              <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <Text style={[THEME.TEXT_FONT3, {color: theme.TEXT_COLOR}]}>
                  {language.Messages.hasAccount}
                </Text>
                <TouchableOpacity
                  style={{
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    width: width / CONST.timer.numberColumns,
                  }}
                  onPress={() => navigation.navigate('LoginScreen')}>
                  <BoxShadow setting={shadowOpt}>
                    <Text
                      style={[{color: theme.TEXT_COLOR}, THEME.TITLE_FONT2]}>
                      {language.buttons.signIn}
                    </Text>
                  </BoxShadow>
                </TouchableOpacity>
              </View>
            ) : (
              <View
                style={[styles.optionsInContainer, {color: theme.TEXT_COLOR}]}>
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: heightButton,
                  }}>
                  <Text style={[THEME.TEXT_FONT3, {color: theme.TEXT_COLOR}]}>
                    {language.Messages.noAccount}
                  </Text>
                  <TouchableOpacity
                    style={{
                      alignItems: 'center',
                      justifyContent: 'flex-start',
                      width: width / CONST.timer.numberColumns,
                    }}
                    onPress={() => navigation.navigate('SignUpScreen')}>
                    <BoxShadow setting={shadowOpt}>
                      <Text
                        style={[{color: theme.TEXT_COLOR}, THEME.TITLE_FONT2]}>
                        {language.buttons.signUp}
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
                    {language.Messages.forgotPassword}
                  </Text>
                  <TouchableOpacity
                    style={{
                      alignItems: 'center',
                      justifyContent: 'flex-start',
                      width: width / CONST.timer.numberColumns,
                    }}
                    onPress={() => navigation.navigate('ResetPasswordScreen')}>
                    <BoxShadow setting={shadowOpt}>
                      <Text
                        style={[{color: theme.TEXT_COLOR}, THEME.TITLE_FONT2]}>
                        {language.buttons.resetPassword}
                      </Text>
                    </BoxShadow>
                  </TouchableOpacity>
                </View>
              </View>
            )}
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
    // marginTop: -40,
  },
  floatingItem: {
    width: '70%',
    height: 60,
    marginTop: 20,
    marginVertical: 15,
    paddingLeft: 15,
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    width: 150,
    height: heightButton,
    borderRadius: 25,
  },
  optionsContainer: {
    marginTop: 70,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionsInContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 20,
    paddingBottom: 25,
    width: '100%',
  },
});
