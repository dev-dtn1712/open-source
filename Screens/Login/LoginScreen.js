import React, { useState, useCallback, useEffect } from 'react';
import {
  KeyboardAvoidingView,
  ScrollView,
  SafeAreaView,
  Text,
  View,
  Platform
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import {
  setLoginRequest,
  setAuthError,
  getAuthError,
  getAuthLoading
} from '../../Redux/AuthRedux';

import {
  Button,
  SecondaryButton,
  FullCard,
  InputField,
  TopBar,
  ProgressHUD
} from '../../Components';
import {
  APP_BREADCRUMB_GRAY,
  APP_DARK_GRAY,
  APP_RED,
  Fonts,
  Images
} from '../../Themes';
import {
  isValidEmail,
  isValidPassword,
  toTestIds,
  PASSWORD_VALID_ERROR,
  EMAIL_VALID_ERROR
} from '../../Utils';

const STYLES = {
  flexContainer: {
    flex: 1
  },
  screen: {
    backgroundColor: APP_DARK_GRAY,
    flex: 1
  },
  imageContainer: {
    marginTop: -32,
    paddingVertical: 0
  },
  logoImage: {
    width: 153,
    resizeMode: 'contain'
  },
  topBar: {
    position: 'relative'
  },
  errorText: {
    ...Fonts.style.normal,
    color: APP_RED,
    paddingHorizontal: 16
  },
  input: {
    marginVertical: 8,
    marginHorizontal: 0
  },
  container: {
    flex: 1,
    backgroundColor: APP_DARK_GRAY,
    paddingBottom: 0
  },
  cardBody: {
    marginTop: -48,
    paddingVertical: 0
  },
  btnLogin: {
    marginBottom: 0
  },
  btnForgot: {
    marginVertical: 4
  },
  forgotText: {
    color: APP_BREADCRUMB_GRAY
  }
};

const getBackNavigator = ({ pop }) => () => {
  pop();
};

const getErrorMessage = error => {
  try {
    const { message } = error;
    return message || PASSWORD_VALID_ERROR;
  } catch (err) {
    return PASSWORD_VALID_ERROR;
  }
};

const getFooter = ({ disabled, onLogin, onForgot }) => {
  return (
    <View>
      <Button
        {...toTestIds('Login Button')}
        disabled={disabled}
        onPress={onLogin}
        style={STYLES.btnLogin}>
        Login
      </Button>
      <SecondaryButton
        {...toTestIds('Forgot Password Button')}
        onPress={onForgot}
        style={STYLES.btnForgot}
        textStyle={STYLES.forgotText}>
        Forgot Password?
      </SecondaryButton>
    </View>
  );
};

export const Login = ({ navigation }) => {
  const dispatch = useDispatch();
  const isSubmitting = useSelector(getAuthLoading);
  const authError = useSelector(getAuthError);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const dispatchLogin = useCallback(value => dispatch(setLoginRequest(value)), [
    dispatch
  ]);
  const dispatchError = useCallback(value => dispatch(setAuthError(value)), [
    dispatch
  ]);

  useEffect(() => {
    dispatchError(null);

    return () => {
      dispatchError(null);
    };
  }, []);

  useEffect(() => {
    setError(authError);
  }, [authError]);

  const onChangeEmail = value => {
    setEmail(value);
  };

  const onChangePassword = value => {
    setPassword(value);
  };

  const onLogin = () => {
    if (!isValidEmail(email)) {
      setError({
        message: EMAIL_VALID_ERROR
      });
      return;
    }

    if (!isValidPassword(password)) {
      setError({
        message: PASSWORD_VALID_ERROR
      });
      return;
    }

    setError(false);

    dispatchLogin({
      email,
      password
    });
  };

  const onForgot = () => {
    const forwardEmail = isValidEmail(email) ? email : '';
    navigation.navigate({
      routeName: 'Forgot',
      params: {
        email: forwardEmail
      }
    });
  };

  return (
    <SafeAreaView style={STYLES.screen}>
      <TopBar
        onPressLeftItem={getBackNavigator(navigation)}
        leftItemLabel="Welcome"
        style={STYLES.topBar}
      />
      <KeyboardAvoidingView
        style={STYLES.flexContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView {...toTestIds('Content')} style={STYLES.container}>
          <FullCard
            footer={getFooter({
              disabled: isSubmitting || !email || !password,
              onLogin,
              onForgot
            })}
            imageWrapperStyle={STYLES.imageContainer}
            imageStyle={STYLES.logoImage}
            image={Images.logoCanWe}>
            <View style={STYLES.cardBody}>
              <InputField
                {...toTestIds('Email Input')}
                label="Email Address"
                onChangeText={onChangeEmail}
                value={email}
                placeholder="Enter your email address"
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <InputField
                {...toTestIds('Password Input')}
                label="Password"
                onChangeText={onChangePassword}
                value={password}
                placeholder="Enter your password"
                secureTextEntry
                autoCapitalize="none"
              />
              {error && (
                <Text style={STYLES.errorText}>{getErrorMessage(error)}</Text>
              )}
            </View>
          </FullCard>
        </ScrollView>
      </KeyboardAvoidingView>
      <ProgressHUD isVisible={isSubmitting} />
    </SafeAreaView>
  );
};
