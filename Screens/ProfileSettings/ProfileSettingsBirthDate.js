import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { PaddedFrame } from './Frames';

import { DatePicker, Button } from '../../Components';
import { getBirthDate, setBirthDateResponse } from '../../Redux/ResponsesRedux';
import { APP_BLACK, APP_BRIGHT_GRAY, APP_WHITE } from '../../Themes';
import { toTestIds } from '../../Utils';
import {
  ANALYTICS_USER_PROPERTY,
  setUserProperty
} from '../../Services/Analytics';

const STYLES = StyleSheet.create({
  datePicker: {
    backgroundColor: APP_WHITE
  },
  wrapper: {
    alignSelf: 'stretch',
    alignItems: 'center',
    flex: 1
  },
  button: {
    alignSelf: 'stretch'
  }
});

const toISODay = date => {
  const isoDate = date.toISOString();
  return isoDate.slice(0, isoDate.indexOf('T'));
};

const todayMinus = years => {
  const date = new Date();
  const thisYear = date.getFullYear();
  date.setYear(thisYear - years);
  return date;
};

// Do we need to caculate age with month/date accounted?
const getAge = birthDate => {
  const thisYear = new Date().getFullYear();
  const birthYear = birthDate.getFullYear();

  return thisYear - birthYear;
};

const MINIMUM_BIRTHDAY = todayMinus(18);

const getBirthDateDispatcher = () => {
  const dispatch = useDispatch();
  const dispatchBirthDate = birthDate => {
    dispatch(setBirthDateResponse(birthDate));
  };

  return useCallback(dispatchBirthDate, [dispatch]);
};

export const ProfileSettingsBirthDate = ({ navigation }) => {
  const birthDate = useSelector(getBirthDate);
  const dispatchBirthday = getBirthDateDispatcher();

  const [currentBirthDate, setCurrentBirthDate] = useState(new Date(birthDate));
  const isTooYoung = currentBirthDate > MINIMUM_BIRTHDAY;

  useEffect(() => {
    setCurrentBirthDate(new Date(birthDate));
  }, [birthDate]);

  const onSaveDate = () => {
    const age = getAge(currentBirthDate);
    setUserProperty({
      [ANALYTICS_USER_PROPERTY.AGE]: age
    });
    dispatchBirthday(toISODay(currentBirthDate));
    navigation.goBack();
  };

  const onDate = date => {
    setCurrentBirthDate(date);
  };

  return (
    <PaddedFrame navigation={navigation} title="Date of Birth">
      <View style={STYLES.wrapper}>
        <DatePicker
          {...toTestIds('Date Of Birth Picker')}
          date={new Date(currentBirthDate)}
          fadeToColor={APP_BRIGHT_GRAY}
          onDate={onDate}
          style={STYLES.datePicker}
          textColor={APP_BLACK}
        />
      </View>
      <Button
        {...toTestIds('Save Button')}
        onPress={onSaveDate}
        disabled={isTooYoung}
        style={STYLES.button}>
        Save
      </Button>
    </PaddedFrame>
  );
};
