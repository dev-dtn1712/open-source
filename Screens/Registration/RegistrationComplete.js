import React, { useCallback, useEffect } from 'react';
import { StyleSheet, Animated, Easing, SafeAreaView } from 'react-native';
import { useDispatch } from 'react-redux';

import { setSignupComplete } from '../../Redux/SignupRedux';

import { FullCard } from '../../Components';
import { APP_DARK_GRAY, APP_WHITE, Images } from '../../Themes';

const TITLE = 'Congratulations!';
const STATEMENT = "Your account has been created, you're all set.";

const ANIMATION_INTERVAL = 660;

const STYLES = StyleSheet.create({
  body: {
    paddingHorizontal: '15%'
  },
  card: {
    backgroundColor: APP_WHITE
  },
  screen: {
    backgroundColor: APP_WHITE,
    flex: 1
  },
  text: {
    color: APP_DARK_GRAY,
    textAlign: 'center'
  }
});

export const RegistrationComplete = () => {
  const dispatch = useDispatch();

  const viewOpacity = new Animated.Value(0);

  const dispatchRegisterComplete = useCallback(
    value => dispatch(setSignupComplete(value)),
    [dispatch]
  );

  useEffect(() => {
    Animated.timing(viewOpacity, {
      toValue: 1,
      duration: ANIMATION_INTERVAL,
      easing: Easing.out(Easing.in),
      useNativeDriver: false
    }).start(() => {
      dispatchRegisterComplete();
    });

    return () => {};
  }, []);

  return (
    <SafeAreaView style={STYLES.screen}>
      <Animated.View style={[{ flex: 1, opacity: viewOpacity }]}>
        <FullCard
          bodyStyle={STYLES.body}
          image={Images.iconBigGreenCheck}
          style={STYLES.card}
          textStyle={STYLES.text}
          title={TITLE}
          titleStyle={STYLES.text}>
          {STATEMENT}
        </FullCard>
      </Animated.View>
    </SafeAreaView>
  );
};
