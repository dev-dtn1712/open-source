import React, { useState, useCallback } from 'react';
import { Text } from 'react-native';
import { useDispatch } from 'react-redux';

import { setSignupGender } from '../../Redux/SignupRedux';

// eslint-disable-next-line import/named
import { Button, FullCard, WheelPicker } from '../../Components';
import { APP_WHITE, Fonts, Images } from '../../Themes';
import { getGenderTemplate } from '../../Services/TemplatesService';
import { toTestIds } from '../../Utils';
import {
  ANALYTICS_USER_PROPERTY,
  setUserProperty
} from '../../Services/Analytics';

const STYLES = {
  text: {
    ...Fonts.style.normal,
    color: APP_WHITE
  },
  cardBody: {
    flex: 1,
    justifyContent: 'space-between'
  },
  pickerBody: {
    marginHorizontal: 32,
    height: 200,
    alignSelf: 'stretch',
    marginBottom: 16
  }
};

const getFooter = ({ onPress }) => {
  return (
    <Button {...toTestIds('Save Button')} onPress={onPress}>
      Save
    </Button>
  );
};

export const RegistrationGender = () => {
  const dispatch = useDispatch();
  const { responses, statement, title } = getGenderTemplate();
  const genderOptions = responses.map(response => response.statement);
  const genderNames = responses.map(response => response.name);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const currentGenderName = genderNames[selectedIndex];

  const dispatchGender = useCallback(
    responseId => dispatch(setSignupGender(responseId)),
    [dispatch]
  );
  const onChangeGender = index => {
    setSelectedIndex(index);
  };
  const onSaveGender = () => {
    dispatchGender(responses[selectedIndex].uuid);
    setUserProperty({
      [ANALYTICS_USER_PROPERTY.GENDER]: currentGenderName
    });
  };

  return (
    <FullCard
      footer={getFooter({
        onPress: onSaveGender
      })}
      image={Images.iconGender}
      title={title}
      footerStyle={STYLES.cardFooter}
      bodyStyle={STYLES.cardBody}>
      <Text style={STYLES.text}>{statement}</Text>
      <WheelPicker
        {...toTestIds('Gender Picker')}
        containerStyle={STYLES.pickerBody}
        data={genderOptions}
        selectedItem={selectedIndex}
        onSelect={onChangeGender}
      />
    </FullCard>
  );
};
