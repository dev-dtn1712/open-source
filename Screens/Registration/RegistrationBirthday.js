import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useDispatch } from 'react-redux';

import { Button, DatePicker, FullCard } from '../../Components';
import { setSignupBirthDate } from '../../Redux/SignupRedux';
import { APP_RED, Fonts, Images } from '../../Themes';
import { getBirthDateTemplate } from '../../Services/TemplatesService';
import { toTestIds } from '../../Utils';
import {
  ANALYTICS_USER_PROPERTY,
  setUserProperty
} from '../../Services/Analytics';

const ERROR_TEXT = "You're too young to participate.";

const todayAt = year => {
  const date = new Date();
  date.setYear(year);
  return date;
};

const todayMinus = years => {
  const date = new Date();
  const thisYear = date.getFullYear();
  date.setYear(thisYear - years);
  return date;
};

const START_DATE = todayAt(2000);
const MINIMUM_BIRTHDAY = todayMinus(18);

const STYLES = StyleSheet.create({
  body: {
    flex: 1,
    justifyContent: 'space-between'
  },
  error: {
    ...Fonts.style.normal,
    color: APP_RED,
    marginTop: 4
  },
  pickerContainer: {
    alignItems: 'center'
  }
});

const toISODay = date => {
  const isoDate = date.toISOString();
  return isoDate.slice(0, isoDate.indexOf('T'));
};

const getAge = birthDate => {
  const thisYear = new Date().getFullYear();
  const birthYear = birthDate.getFullYear();

  return thisYear - birthYear;
};

const getBirthdayDispatcher = () => {
  const dispatch = useDispatch();
  const dispatchBirthday = birthday => {
    dispatch(setSignupBirthDate(birthday));
  };

  return useCallback(dispatchBirthday, [dispatch]);
};

const getFooter = (onPress, enabled = true) => (
  <Button {...toTestIds('Save Button')} disabled={!enabled} onPress={onPress}>
    Save
  </Button>
);

export const RegistrationBirthday = () => {
  const [birthday, setBirthday] = useState(null);
  const { statement, title } = getBirthDateTemplate();

  const isSet = birthday !== null;
  const isTooYoung = isSet && birthday > MINIMUM_BIRTHDAY;
  const isValid = isSet && !isTooYoung;

  const dispatchBirthday = getBirthdayDispatcher();
  const onSave = () => {
    const age = getAge(birthday);
    setUserProperty({
      [ANALYTICS_USER_PROPERTY.AGE]: age
    });
    dispatchBirthday(toISODay(birthday));
  };

  return (
    <FullCard
      bodyStyle={STYLES.body}
      footer={getFooter(onSave, isValid)}
      image={Images.iconCake}
      title={title}>
      {statement}
      <View style={STYLES.pickerContainer}>
        <DatePicker
          {...toTestIds('Date Of Birth Picker')}
          date={birthday || START_DATE}
          onDate={setBirthday}
        />
        <Text style={STYLES.error}>{isTooYoung && ERROR_TEXT}</Text>
      </View>
    </FullCard>
  );
};
