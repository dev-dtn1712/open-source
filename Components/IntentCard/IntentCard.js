import React, { useState } from 'react';
import { StyleSheet, TouchableWithoutFeedback, View, Text } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ToggleSwitch from 'toggle-switch-react-native';

import {
  APP_WHITE,
  APP_GREEN,
  APP_SWITCH_ACTIVE,
  APP_WHITE_GRAY,
  Fonts,
  COLOR_PALETTE
} from '../../Themes';
import { appendIfMissingTestId } from '../../Utils';

const DEFAULT_STYLES = StyleSheet.create({
  card: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: APP_GREEN,
    minHeight: 67,
    borderRadius: 4,
    paddingVertical: 8
  },
  glyph: {
    fontFamily: Fonts.type.base,
    fontSize: 20,
    marginLeft: 16
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    marginLeft: 10,
    marginRight: 'auto'
  },
  title: {
    ...Fonts.style.normal,
    fontWeight: 'bold',
    color: APP_WHITE,
    textAlign: 'left'
  },
  switchContainer: {
    marginRight: 16,
    height: 30,
    justifyContent: 'center',
    overflow: 'visible'
  },
  switchTrackStyle: {
    width: 54,
    padding: 15,
    borderWidth: 2
  },
  switchThumbStyle: {
    width: 26,
    height: 26,
    margin: 2,
    borderRadius: 13
  },
  chevron: {
    marginRight: 8,
    opacity: 0.2
  }
});

export const IntentCard = ({
  glyph,
  title,
  intentSharing = true,
  isShared = false,
  style,
  switchTestId,
  textStyle,
  onPress = () => {},
  onToggle = () => {},
  ...props
}) => {
  const [isToggled, setIsToggled] = useState(isShared);
  const onToogleSwitch = () => {
    const newValue = !isToggled;
    setIsToggled(newValue);
    if (onToggle) {
      onToggle(newValue);
    }
  };

  return (
    <TouchableWithoutFeedback testID="touchable" onPress={onPress} {...props}>
      <View style={[DEFAULT_STYLES.card, style]}>
        {glyph && <Text style={[DEFAULT_STYLES.glyph]}>{glyph}</Text>}
        {title && (
          <View style={DEFAULT_STYLES.titleContainer}>
            <Text style={[DEFAULT_STYLES.title, textStyle]}>{title}</Text>
          </View>
        )}
        {intentSharing && (
          <View style={DEFAULT_STYLES.switchContainer}>
            <ToggleSwitch
              {...appendIfMissingTestId(props, switchTestId, 'Switch')}
              isOn={isToggled}
              onColor={APP_SWITCH_ACTIVE}
              offColor={COLOR_PALETTE.transparent}
              trackOnStyle={{
                ...DEFAULT_STYLES.switchTrackStyle,
                borderColor: APP_SWITCH_ACTIVE
              }}
              trackOffStyle={{
                ...DEFAULT_STYLES.switchTrackStyle,
                borderColor: APP_WHITE
              }}
              thumbOnStyle={DEFAULT_STYLES.switchThumbStyle}
              thumbOffStyle={DEFAULT_STYLES.switchThumbStyle}
              onToggle={onToogleSwitch}
            />
          </View>
        )}
        {!intentSharing && (
          <MaterialIcons
            color={APP_WHITE_GRAY}
            name="arrow-forward"
            size={32}
            style={DEFAULT_STYLES.chevron}
          />
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};
