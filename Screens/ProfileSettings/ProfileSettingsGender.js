import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { PaddedFrame } from './Frames';

// eslint-disable-next-line import/named
import { WheelPicker, Button } from '../../Components';
import { getGender, setGenderResponse } from '../../Redux/ResponsesRedux';
import { APP_BLACK, APP_BRIGHT_GRAY } from '../../Themes';
import { getGenderTemplate } from '../../Services/TemplatesService';
import { toTestIds } from '../../Utils';
import {
  ANALYTICS_USER_PROPERTY,
  setUserProperty
} from '../../Services/Analytics';

const STYLES = StyleSheet.create({
  wheelPickerBody: {
    alignSelf: 'stretch',
    marginHorizontal: 32
  },
  button: {
    alignSelf: 'stretch'
  },
  wrapper: {
    alignSelf: 'stretch',
    flex: 1
  }
});

const getGenderDispatcher = () => {
  const dispatch = useDispatch();
  const dispatchGender = uuid => {
    dispatch(setGenderResponse(uuid));
  };

  return useCallback(dispatchGender, [dispatch]);
};

export const ProfileSettingsGender = ({ navigation }) => {
  const genderId = useSelector(getGender);
  const { responses } = getGenderTemplate();

  // Until RNP-78 is fixed, WheelPicker will select "Female" on each page load.
  // As a work around, on the initial render, the component hard codes a
  // selectedIndex of 0 and does not dispatch any changes to state. After all
  // synchronous code has run, further renders will work normally.
  const [isReady, setIsReady] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      setIsReady(true);
    }, 0);
  }, []);

  const [currentGenderId, setCurrentGenderId] = useState(genderId);

  useEffect(() => {
    setCurrentGenderId(genderId);
  }, [genderId]);

  const genderOptions = responses.map(response => response.statement);
  const genderNames = responses.map(response => response.name);
  const selectedIndex = isReady
    ? responses.findIndex(({ uuid }) => uuid === currentGenderId)
    : 0;
  const currentGenderName = genderNames[selectedIndex];

  const dispatchGender = getGenderDispatcher();
  const onSaveGender = () => {
    dispatchGender(currentGenderId);
    setUserProperty({
      [ANALYTICS_USER_PROPERTY.GENDER]: currentGenderName
    });
    navigation.goBack();
  };

  const onSelect = index => {
    if (isReady) {
      setCurrentGenderId(responses[index].uuid);
    }
  };

  return (
    <PaddedFrame navigation={navigation} title="Gender">
      <View style={STYLES.wrapper}>
        <WheelPicker
          {...toTestIds('Gender Picker')}
          backgroundColor={APP_BRIGHT_GRAY}
          containerStyle={STYLES.wheelPickerBody}
          data={genderOptions}
          itemTextColor={APP_BLACK}
          onSelect={onSelect}
          selectedItem={selectedIndex}
          selectedItemTextColor={APP_BLACK}
        />
      </View>
      <Button
        {...toTestIds('Save Button')}
        onPress={onSaveGender}
        disabled={!isReady}
        style={STYLES.button}>
        Save
      </Button>
    </PaddedFrame>
  );
};
