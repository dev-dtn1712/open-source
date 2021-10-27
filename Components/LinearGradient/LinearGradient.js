import { get } from 'lodash';
import React from 'react';
import { View } from 'react-native';
import RNLinearGradient from 'react-native-linear-gradient';

import {
  APP_GRADIENT_START,
  APP_GRADIENT_END,
  APP_PARALLEL_ORANGE
} from '../../Themes';

const len = val => get(val, 'length', 0);
// Uses a Gradient if `color` is falsey, and `colors` is
// either an array with at least two items, or is missing
const shouldUseGradient = ({ color, colors }) => !color && len(colors) > 1;

const AsGradient = ({
  colors = [APP_GRADIENT_START, APP_GRADIENT_END],
  end = { x: 1, y: 1 },
  start = { x: 0, y: 0 },
  ...props
}) => <RNLinearGradient colors={colors} end={end} start={start} {...props} />;

const AsView = ({ color, colors = [APP_PARALLEL_ORANGE], style, ...props }) => (
  <View style={[{ backgroundColor: color || colors[0] }, style]} {...props} />
);

export class LinearGradient extends React.Component {
  render() {
    return shouldUseGradient(this.props) ? (
      <AsGradient {...this.props} />
    ) : (
      <AsView {...this.props} />
    );
  }
}
