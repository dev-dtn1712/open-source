import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Answer } from '../Answer';
import { toTestIds, toUuids } from '../../Utils';

const SPACE_BETWEEN = 8;
const DEFAULT_STYLES = StyleSheet.create({
  answer: {
    margin: 0
  },
  form: {}
});

const getMarginTop = index => ({
  marginTop: index === 0 ? 0 : SPACE_BETWEEN
});

export const PolyadicForm = ({
  max,
  onChange = () => {},
  responseData = [],
  responses,
  style,
  answerStyle,
  answersOnly = false,
  ...props
}) => {
  const [currentData, setCurrentData] = useState(responseData);
  const selectedUuids = new Set(toUuids(currentData));

  const isDisabled = uuid =>
    !selectedUuids.has(uuid) && selectedUuids.size >= max;

  const selectionListener = uuid => isSelected => {
    const updatedData = isSelected
      ? currentData.concat({ uuid })
      : currentData.filter(response => response.uuid !== uuid);

    setCurrentData(updatedData);
    onChange(updatedData);
  };

  return (
    <View style={[DEFAULT_STYLES.form, style]} {...props}>
      {responses.map(({ uuid, statement }, i) => {
        const isSelected = selectedUuids.has(uuid);
        if (answersOnly && !isSelected) {
          return null;
        }
        return (
          <Answer
            {...toTestIds(statement)}
            disabled={isDisabled(uuid)}
            isSelected={isSelected}
            key={uuid}
            onChange={selectionListener(uuid)}
            style={[DEFAULT_STYLES.answer, answerStyle, getMarginTop(i)]}>
            {statement}
          </Answer>
        );
      })}
    </View>
  );
};
