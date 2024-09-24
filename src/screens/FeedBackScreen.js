import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  useWindowDimensions,
  TextInput,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useDispatch, useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {FloatLabelInput} from '../components/ui/FloatLabelInput';
import {THEME} from '../theme';
import {CustomHeader} from '../components/ui/CustomHeader';
import {BoxShadow} from 'react-native-shadow';
import {AddFeedBackToFB} from '../components/function/FirebaseFunction';
import {CONST} from '../const';
import {modalShowMessage} from '../store/actions/modalMessage';
import {IntervalFeedback} from '../store/actions/intervalFeedback';

export const FeedBackScreen = ({navigation}) => {
  const language = useSelector(state => state.language);
  const theme = useSelector(state => state.theme);
  const dateFeedback = useSelector(state => state.intervalFeedback.date);
  const width = useWindowDimensions().width;
  const dispatch = useDispatch();

  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState('');
  const [description, setDescription] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [timestmp, setTimeStmp] = useState(dateFeedback);

  const CheckFirstNameMax = value => {
    value.length <= CONST.feedback.maxLengthFirstName
      ? (setFirstName(value), errorMessage ? setErrorMessage('') : null)
      : (setFirstName(value),
        setErrorMessage(language.feedback.errors.maxLengthName));
  };

  const CheckTopicMax = value => {
    value.length <= CONST.feedback.maxLengthTopic
      ? (setTopic(value), errorMessage ? setErrorMessage('') : null)
      : (setTopic(value),
        setErrorMessage(language.feedback.errors.maxLengthTopic));
  };

  const CheckDescriptionMax = value => {
    value.length <= CONST.feedback.maxLengthDescription
      ? (setDescription(value), errorMessage ? setErrorMessage('') : null)
      : (setDescription(value),
        setErrorMessage(language.feedback.errors.maxLengthDescription));
  };

  const isValidEmail = email => {
    const emailRegex =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(email.trim().toLowerCase());
  };

  const сlearFields = () => {
    setFirstName('');
    setTopic('');
    setEmail('');
    setDescription('');
  };

  async function setAsyncStorageTimeRequest() {
    const date = new Date();
    try {
      return await AsyncStorage.setItem(
        CONST.STORAGE_KEYS.feedbackInterval,
        JSON.stringify(date),
      );
    } catch (e) {
      console.log('SettingsItems: Error: ', e);
    }
  }

  const Submit = async () => {
    const curTime = new Date();
    const delay =
      CONST.feedback.intervalSending -
      (Date.parse(curTime) - Date.parse(timestmp)) / 1000;
    if (
      timestmp !== '' &&
      Date.parse(timestmp) - Date.parse(curTime) <
        CONST.feedback.intervalSending
    ) {
      const formattedTime = new Date(delay * 1000).toUTCString().split(/ /)[4];
      const messageDelay = ` ${formattedTime.substr(
        0,
        2,
      )}h:${formattedTime.substr(3, 2)}m:${formattedTime.substr(6, 2)}s`;
      setErrorMessage(language.feedback.errors.intervalSending + messageDelay);
      return;
    }

    !firstName ? setErrorMessage(language.feedback.errors.emptyName) : null;
    if (!firstName) return;

    if (firstName.length > CONST.feedback.maxLengthFirstName) return;

    const checkEmail = isValidEmail(email);
    !checkEmail
      ? setErrorMessage(language.feedback.errors.incorrectEmail)
      : null;
    if (!checkEmail) return;

    !topic ? setErrorMessage(language.feedback.errors.emptyTopic) : null;
    if (topic.length < CONST.feedback.minLengthTopic) {
      setErrorMessage(language.feedback.errors.minLengthTopic);
      return;
    }
    if (!topic) return;

    !description
      ? setErrorMessage(language.feedback.errors.emptyDescription)
      : null;
    if (description.length < CONST.feedback.minLengthDescription) {
      setErrorMessage(language.feedback.errors.minLengthDescription);
      return;
    }
    if (!description) return;

    const value = {
      status: 'new',
      name: firstName,
      email: email,
      topic: topic,
      description: description,
      to: CONST.request.to,
      message: {
        html: '',
        subject: '',
      },
    };

    const numberRequest = await AddFeedBackToFB(value);
    numberRequest.error === ''
      ? (сlearFields(),
        (language.modalMessages.feedbackSuccess.message =
          language.feedback.resultSuccess + numberRequest.request),
        dispatch(modalShowMessage(language.modalMessages.feedbackSuccess)),
        setTimeStmp(new Date()),
        setAsyncStorageTimeRequest(),
        dispatch(IntervalFeedback({date: new Date()})),
        navigation.navigate('SettingsScreen'))
      : ((language.modalMessages.error.message =
          language.feedback.resultError + `${numberRequest.error}`),
        dispatch(modalShowMessage(language.modalMessages.error)));
  };

  const shadowOpt = {
    width: (width / 2) * 0.8,
    height: 60,
    color: theme.BACKGROUNDCOLOR,
    border: 7,
    radius: 15,
    opacity: 0.7,
    x: 0,
    y: 0,
    style: {
      margin: 30,
      borderRadius: 15,
      justifyContent: 'center',
      alignItems: 'center',
      borderColor: theme.borderColor,
      borderWidth: 1,
      borderRadius: 15,
    },
  };
  const heightdescription = 160;
  const fliStyles = {
    containerStyles: {
      borderWidth: 1,
      paddingHorizontal: 10,
      borderColor: theme.ITEM_COLOR,
      borderRadius: 15,
      height: 60,
      marginVertical: 20,
      color: theme.TEXT_COLOR,
    },
    containerStylesDescription: {
      borderWidth: 1,
      padding: 10,
      borderColor: theme.ITEM_COLOR,
      borderRadius: 15,
      height: heightdescription,
      marginVertical: 20,
      color: theme.TEXT_COLOR,
      textAlignVertical: 'top',
    },
  };

  return (
    <View style={styles.container}>
      <CustomHeader
        navigation={navigation}
        label={language.headerTitle.feedback}
      />
      <LinearGradient
        colors={theme.BACKGROUNDCOLOR_LG}
        style={THEME.MAIN_BACKGROUNDSTYLES}>
        <KeyboardAvoidingView
          style={{
            flexDirection: 'column',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
          }}
          behavior="padding"
          enabled
          keyboardVerticalOffset={-350}>
          <ScrollView
            style={{
              width: '100%',
              height: '100%',
            }}
            contentContainerStyle={{
              justifyContent: 'flex-start',
              alignItems: 'center',
            }}>
            <View
              style={{
                width: '90%',
                minHeight: 30,
                marginTop: 20,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              {errorMessage ? (
                <Text
                  style={[
                    THEME.TITLE_FONT2,
                    {
                      color: theme.DANGER_COLOR,
                      textAlign: 'center',
                    },
                  ]}>
                  {errorMessage}
                </Text>
              ) : null}
            </View>
            <View style={styles.floatingItem}>
              <FloatLabelInput
                isPassword={false}
                label={language.feedback.firstName}
                value={firstName}
                type="text"
                containerStyles={fliStyles.containerStyles}
                onChangeText={value => CheckFirstNameMax(value)}
              />
            </View>
            <View style={styles.floatingItem}>
              <FloatLabelInput
                isPassword={false}
                label={language.feedback.emailLabel}
                value={email}
                type="text"
                containerStyles={fliStyles.containerStyles}
                onChangeText={setEmail}
              />
            </View>
            <View style={styles.floatingItem}>
              <FloatLabelInput
                isPassword={false}
                label={language.feedback.topicLabel}
                value={topic}
                type="text"
                containerStyles={fliStyles.containerStyles}
                onChangeText={value => CheckTopicMax(value)}
              />
            </View>
            <View
              style={[
                styles.floatingItem,
                {
                  height: heightdescription,
                },
              ]}>
              <TextInput
                value={description}
                type="text"
                multiline
                numberOfLines={4}
                placeholder={language.feedback.descriptionLabel}
                placeholderTextColor={'#aaa'}
                style={fliStyles.containerStylesDescription}
                onChangeText={value => CheckDescriptionMax(value)}
              />
            </View>
            <TouchableOpacity
              style={{
                alignItems: 'center',
                justifyContent: 'flex-start',
              }}
              onPress={Submit}>
              <BoxShadow setting={shadowOpt}>
                <Text style={[{color: theme.TEXT_COLOR}, THEME.TITLE_FONT2]}>
                  {language.feedback.button}
                </Text>
              </BoxShadow>
            </TouchableOpacity>
            <View
              style={{
                width: '100%',
                height: 100,
              }}></View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  floatingItem: {
    width: '70%',
    height: 60,
    marginTop: 20,
    marginVertical: 15,
    paddingLeft: 15,
  },
});
