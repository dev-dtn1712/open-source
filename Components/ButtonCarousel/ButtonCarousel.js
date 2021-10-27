import { isNil, noop, range } from 'lodash';
import React, { useState, useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  Platform,
  StyleSheet,
  View,
  ScrollView,
  TouchableWithoutFeedback,
  Text,
  Image,
  NativeModules,
  findNodeHandle
} from 'react-native';

import { APP_BLUE, APP_WHITE, APP_GREEN, Fonts, Images } from '../../Themes';
import { pickTestIds, toTestIds, omitTestIds } from '../../Utils';

const { UIManager } = NativeModules;

const BUTTON_WIDTH = 280;
const BUTTON_HEIGHT = 70;
const BUTTON_MARGIN = 5.5;
const NUM_COLUMNS = 5;
const CONTENT_MARGIN = 16 - BUTTON_MARGIN;

const RESTART_DELAY = 1000;
const FULL_WIDTH_SCROLL_DURATION = 18000;
const EXPECTED_FULL_SCROLL_WIDTH = 1100;

const SCROLL_DURATION_PER_PIXEL = Math.floor(
  FULL_WIDTH_SCROLL_DURATION / EXPECTED_FULL_SCROLL_WIDTH
);

const DEFAULT_STYLES = StyleSheet.create({
  container: {
    overflow: 'hidden',
    marginVertical: BUTTON_MARGIN
  },
  content: {
    marginHorizontal: CONTENT_MARGIN
  },
  list: {
    flexDirection: 'row'
  },
  button: {
    backgroundColor: APP_BLUE,
    borderRadius: 8,
    margin: BUTTON_MARGIN,
    width: BUTTON_WIDTH,
    height: BUTTON_HEIGHT,
    justifyContent: 'center',
    padding: 14
  },
  text: {
    ...Fonts.style.normal,
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.26,
    lineHeight: 17,
    color: APP_WHITE,
    textAlign: 'center'
  },
  statusImage: {
    position: 'absolute',
    right: 8,
    bottom: 12
  }
});

export const ButtonCarousel = ({
  data,
  style,
  buttonStyle,
  marqueeOnMount = true,
  onSelected = () => {},
  ...props
}) => {
  const scrollViewRef = useRef(null);
  const contentViewRef = useRef(null);

  const animatedPosition = useRef(new Animated.Value(0));
  const [currentPosition, setCurrentPosition] = useState(0);

  const [scrollableWidth, setScrollableWidth] = useState(0);
  const [isAnimatingRight, setIsAnimatingRight] = useState(true);

  const startAnimation = (position = currentPosition) => {
    if (scrollableWidth > 0) {
      const distanceToScroll = isAnimatingRight
        ? scrollableWidth - position
        : position;

      const toValue = isAnimatingRight ? scrollableWidth : 0;
      const duration = SCROLL_DURATION_PER_PIXEL * distanceToScroll;

      Animated.timing(animatedPosition.current, {
        toValue,
        duration,
        easing: Easing.inOut(Easing.ease),
        delay: RESTART_DELAY,
        useNativeDriver: false
      }).start(({ finished }) => {
        if (finished) {
          setIsAnimatingRight(!isAnimatingRight);
        }
      });
    }
  };

  const stopAnimation = () => {
    animatedPosition.current.stopAnimation();
  };

  const onScrollEnd = event => {
    const nextX = event.nativeEvent.contentOffset.x;
    animatedPosition.current.setValue(nextX);

    if (!isAnimatingRight && nextX <= 0) {
      setIsAnimatingRight(true);
    } else if (isAnimatingRight && nextX >= scrollableWidth) {
      setIsAnimatingRight(false);
    } else {
      startAnimation(nextX);
    }
  };

  const onDragEnd = event => {
    // Call onScrollEnd if there will be no momentum scroll
    if (event.nativeEvent.velocity.x === 0) {
      onScrollEnd(event);
    }
  };

  const calculateMetrics = async () => {
    const measureWidth = node =>
      new Promise(resolve => {
        const nodeHandle = findNodeHandle(node);
        if (nodeHandle) {
          UIManager.measure(nodeHandle, (x, y, w) => {
            return resolve(w);
          });
        }
      });

    const [sWidth, cWidth] = await Promise.all([
      measureWidth(scrollViewRef.current),
      measureWidth(contentViewRef.current)
    ]);

    if (sWidth && cWidth) {
      setScrollableWidth(Math.max(0, cWidth + CONTENT_MARGIN * 2 - sWidth));
    }
  };

  const renderButton = ({ statement, isCompleted, testId }, index) => (
    <TouchableWithoutFeedback
      {...toTestIds(testId || statement)}
      key={index}
      onPress={() => onSelected(index)}>
      <View
        style={[
          DEFAULT_STYLES.button,
          isCompleted && { backgroundColor: APP_GREEN },
          buttonStyle
        ]}>
        <Text style={DEFAULT_STYLES.text}>{statement}</Text>
        {isCompleted && (
          <Image
            style={DEFAULT_STYLES.statusImage}
            resizeMode="cover"
            source={Images.iconComplete}
          />
        )}
      </View>
    </TouchableWithoutFeedback>
  );

  const renderRow = (row, idRowProp) =>
    range(NUM_COLUMNS).map(column => {
      const index = row * NUM_COLUMNS + column;
      const item = data[index];
      return item ? renderButton(item, index, idRowProp) : null;
    });

  const renderView = () => {
    const rows = Math.floor(data.length / NUM_COLUMNS) + 1;
    return (
      <View
        ref={contentViewRef}
        {...omitTestIds(props)}
        style={[
          DEFAULT_STYLES.content,
          { transform: [{ translateX: 0 }], width: null }
        ]}>
        {range(rows).map(row => {
          const marginLeftStyle = {
            marginLeft: row % 2 ? (BUTTON_WIDTH + BUTTON_MARGIN) * 0.5 : 0
          };
          return (
            <View key={row} style={[DEFAULT_STYLES.list, marginLeftStyle]}>
              {renderRow(row)}
            </View>
          );
        })}
      </View>
    );
  };

  // There is a difficult to diagnose bug when using the ButtonCarousel nested
  // inside another ScrollView on iOS. While the ButtonCarousel is animating,
  // press events get blocked to all children of the wrapping ScrollView.

  // As a workaround, we can set the contentOffset directly and remove the
  // scrollEventThrottle prop. However, that approach breaks *Android*,
  // so we're left with the combination of weird workarounds below.

  let scrollTo;
  let animateProps;

  if (Platform.OS === 'ios') {
    scrollTo = noop;
    animateProps = { contentOffset: { x: currentPosition, y: 0 } };
  } else {
    scrollTo = x => {
      scrollViewRef.current.scrollTo({ x, animated: false });
    };
    animateProps = {};
  }

  useEffect(() => {
    startAnimation();
  }, [isAnimatingRight]);

  useEffect(() => {
    if (marqueeOnMount) {
      calculateMetrics();
    }
  }, [marqueeOnMount]);

  useEffect(() => {
    startAnimation();
  }, [scrollableWidth]);

  useEffect(() => {
    const scrollListener = animatedPosition.current.addListener(({ value }) => {
      if (!isNil(value)) {
        setCurrentPosition(value);
        scrollTo(value);
      }
    });

    return () => {
      stopAnimation();
      animatedPosition.current.removeListener(scrollListener);
    };
  }, []);

  return (
    <View style={[DEFAULT_STYLES.container, style]}>
      <ScrollView
        {...pickTestIds(props)}
        ref={scrollViewRef}
        horizontal
        onScrollBeginDrag={stopAnimation}
        onScrollEndDrag={onDragEnd}
        onMomentumScrollEnd={onScrollEnd}
        showsHorizontalScrollIndicator={false}
        onContentSizeChange={() => calculateMetrics()}
        {...animateProps}>
        {renderView()}
      </ScrollView>
    </View>
  );
};
