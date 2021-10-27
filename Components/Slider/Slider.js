import React, { useState, useMemo, useRef } from 'react';
import RNSlider from '@react-native-community/slider';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import { Circle } from '../Circle';
import {
  APP_WHITE,
  APP_PARALLEL_ORANGE,
  APP_SLIDER_GRAY,
  Images
} from '../../Themes';
import { omitTestIds, pickTestIds } from '../../Utils';

const AnimatedSlider = Animated.createAnimatedComponent(RNSlider);
const ANIMATION_INTERVAL = 200;

export const SLIDER_STYLE = {
  CONTINUOUS: 'continuous',
  STEPPED: 'stepped'
};

export const SLIDER_GRAVITY = {
  LOW: 'low',
  MIDDLE: 'middle',
  HIGH: 'high'
};

const DEFAULT_STYLES = StyleSheet.create({
  container: {
    position: 'relative',
    height: 40,
    justifyContent: 'center'
  },
  stepsContainer: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '100%',
    width: '100%'
  },
  barContainer: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center'
  }
});

const getGravityValue = (min, max, gravity) => {
  if (gravity === SLIDER_GRAVITY.MIDDLE) {
    return (max + min) / 2;
  }

  if (gravity === SLIDER_GRAVITY.HIGH) {
    return max;
  }
  return min;
};

const getGravityPosition = gravity => {
  if (gravity === SLIDER_GRAVITY.MIDDLE) {
    return 0.5;
  }

  if (gravity === SLIDER_GRAVITY.HIGH) {
    return 1;
  }
  return 0;
};

const getStepValues = (min, max, steps) => {
  const values = [];
  if (steps < 2) return values;
  const offset = (max - min) / (steps - 1);

  values.push(min);
  let currentVal = min;
  for (let i = 1; i < steps - 1; i += 1) {
    currentVal += offset;
    values.push(currentVal);
  }
  values.push(max);

  return values;
};

const findNearestStepIndex = (value, steps) => {
  const firstIndex = steps.findIndex(step => step > value);
  if (firstIndex < 0) return steps.length - 1;
  if (!firstIndex) return 0;

  const current = steps[firstIndex];
  const prev = steps[firstIndex - 1];

  return current - value > value - prev ? firstIndex - 1 : firstIndex;
};

const getIsPassed = (step, current, gravityValue) => {
  const stepDiff = step - gravityValue;
  const currentDiff = current - gravityValue;

  if (stepDiff * currentDiff < 0) {
    return false;
  }

  // Allow for a buffer of one thousandth to catch floating point math
  return Math.abs(stepDiff) <= Math.abs(currentDiff) + 0.001;
};

const getBarWidth = (gravityPosition, valueInProgress, max) => {
  let left = gravityPosition;
  let right = (valueInProgress / max) * 100;
  if (gravityPosition > right) {
    left = right;
    right = gravityPosition;
  }

  return {
    left: `${left}%`,
    right: `${100 - right}%`
  };
};

export const StepCircle = ({
  size = 24,
  ringSize = 4,
  isPassed = false,
  color = APP_PARALLEL_ORANGE,
  contrastColor = APP_WHITE,
  tintColor = APP_SLIDER_GRAY,
  ...props
}) => {
  const outerColor = isPassed ? contrastColor : tintColor;
  const innerColor = isPassed ? color : contrastColor;

  return (
    <Circle
      size={size}
      color={outerColor}
      style={{ padding: ringSize }}
      {...props}>
      <Circle size={size - ringSize * 2} color={innerColor} />
    </Circle>
  );
};

export const Slider = ({
  barColor = APP_SLIDER_GRAY,
  barSize = 8,
  barTintColor = APP_PARALLEL_ORANGE,
  gravity = SLIDER_GRAVITY.MIDDLE,
  min = 1,
  max = 10,
  onChange,
  sliderStyle = SLIDER_STYLE.STEPPED,
  steps = 5,
  stepThumbSize = 24,
  stepThumbRingSize = 4,
  stepColor = APP_PARALLEL_ORANGE,
  stepContrastColor = APP_WHITE,
  stepTintColor = APP_SLIDER_GRAY,
  style,
  answersOnly = false,
  trackThumbImage = Images.iconSliderThumb,
  value,
  ...props
}) => {
  const stepValues = useMemo(() => getStepValues(min, max, steps), [
    min,
    max,
    steps
  ]);
  const gravityValue = getGravityValue(min, max, gravity);
  const gravityPosition = getGravityPosition(gravity) * 100;

  const initialValue = value;
  const isSnapped = sliderStyle === SLIDER_STYLE.STEPPED;
  const [valueInProgress, setValueInProgress] = useState(initialValue);
  const animationValue = useRef(new Animated.Value(valueInProgress)).current;

  const onSlidingComplete = () => {
    if (!isSnapped) {
      return;
    }
    const snapValue =
      stepValues[findNearestStepIndex(valueInProgress, stepValues)];

    Animated.timing(animationValue, {
      toValue: snapValue,
      duration: ANIMATION_INTERVAL,
      easing: Easing.out(Easing.in),
      useNativeDriver: false
    }).start(() => {
      setValueInProgress(snapValue);
    });

    if (onChange) {
      onChange(snapValue);
    }
  };
  const onValueChange = newVal => {
    setValueInProgress(newVal);
    animationValue.setValue(newVal);

    if (!isSnapped && onChange) {
      onChange(newVal);
    }
  };

  return (
    <View style={[DEFAULT_STYLES.container, style]} {...omitTestIds(props)}>
      <View style={DEFAULT_STYLES.barContainer}>
        <View
          style={{
            width: '100%',
            height: barSize,
            backgroundColor: barColor,
            borderRadius: barSize / 2,
            position: 'relative'
          }}>
          <View
            style={{
              height: '100%',
              top: 0,
              backgroundColor: barTintColor,
              position: 'absolute',
              ...getBarWidth(gravityPosition, valueInProgress, max)
            }}
          />
        </View>
      </View>
      <View style={DEFAULT_STYLES.stepsContainer}>
        {stepValues.map(step => (
          <StepCircle
            color={stepColor}
            contrastColor={stepContrastColor}
            tintColor={stepTintColor}
            size={stepThumbSize}
            ringSize={stepThumbRingSize}
            key={step}
            isPassed={getIsPassed(step, valueInProgress, gravityValue)}
          />
        ))}
      </View>
      {!answersOnly && (
        <AnimatedSlider
          {...pickTestIds(props)}
          thumbImage={trackThumbImage}
          minimumValue={min}
          maximumValue={max}
          value={animationValue}
          testID="RNSlider"
          minimumTrackTintColor="transparent"
          maximumTrackTintColor="transparent"
          onSlidingComplete={onSlidingComplete}
          onValueChange={onValueChange}
          style={{
            alignItems: 'center',
            marginBottom: -4
          }}
        />
      )}
    </View>
  );
};
