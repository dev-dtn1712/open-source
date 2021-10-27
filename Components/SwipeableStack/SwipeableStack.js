import React, { useState } from 'react';
import { StyleSheet, View, Animated, PanResponder } from 'react-native';
import range from 'lodash/range';

import { Metrics, APP_DARK_GRAY } from '../../Themes';
import { omitTestIds, pickTestIds } from '../../Utils';

export const DEFAULT_VISIBLE_CARD_COUNT = 5;

const CARD_PADDING = 16;
const DEFAULT_CARD_WIDTH = Metrics.screenWidth - CARD_PADDING * 2;
const CARD_SPACING = 8;
const CARD_ZOOM_OFFSET = 0.05;
const DRAG_DISTANCE = Metrics.screenWidth / 2;
const SWIPE_ANIM_DURATION = 100;
const AUTO_ANIM_DURATION = 400;
const DISABLE_LEFT_SWIPE = false;
const DISABLE_RIGHT_SWIPE = false;

const DEFAULT_STYLES = StyleSheet.create({
  stack: {
    flex: 1
  },
  content: {
    flex: 1,
    marginHorizontal: CARD_PADDING
  },
  dummy: {
    borderRadius: 8,
    backgroundColor: APP_DARK_GRAY,
    width: DEFAULT_CARD_WIDTH
  }
});

export const SwipeableStack = ({
  items,
  renderItem = () => {},
  onCardSwiped = () => {},
  onCardLeftSwiped = () => {},
  onCardRightSwiped = () => {},
  setSwipeTriggerFn = () => {},
  style,
  cardStyle,
  disabled,
  ...props
}) => {
  const totalCardCount = items.length;
  const [currentCard, setCurrentCard] = useState(0);
  const [lastSwipeDirection, setLastSwipeDirection] = useState('left');

  const [cardHeight, setCardHeight] = useState(0);

  const drag = new Animated.ValueXY({ x: 0, y: 0 });
  const dragDistance = new Animated.Value(0);

  const resetCard = () => {
    Animated.timing(dragDistance, {
      toValue: 0,
      duration: SWIPE_ANIM_DURATION,
      useNativeDriver: false
    }).start();
    Animated.spring(drag, {
      toValue: { x: 0, y: 0 },
      duration: SWIPE_ANIM_DURATION,
      useNativeDriver: false
    }).start();
  };

  const nextCard = (direction, duration = SWIPE_ANIM_DURATION) => {
    if (currentCard < totalCardCount) {
      if (duration === AUTO_ANIM_DURATION) {
        Animated.timing(dragDistance, {
          toValue: DRAG_DISTANCE,
          duration: SWIPE_ANIM_DURATION,
          useNativeDriver: false
        }).start();
      }

      const x =
        direction === 'left'
          ? DEFAULT_CARD_WIDTH * -1.3
          : DEFAULT_CARD_WIDTH * 1.3;

      Animated.timing(drag, {
        toValue: { x, y: 0 },
        duration,
        useNativeDriver: false
      }).start(() => {
        onCardSwiped(currentCard);
        setLastSwipeDirection(direction);

        switch (direction) {
          case 'left':
            onCardLeftSwiped(currentCard);
            break;
          case 'right':
            onCardRightSwiped(currentCard);
            break;
          default:
        }

        setCurrentCard(currentCard + 1);
      });
    }
  };

  setSwipeTriggerFn(() => {
    dragDistance.setValue(0);
    drag.setValue({ x: 0, y: 0 });
    nextCard(lastSwipeDirection, AUTO_ANIM_DURATION);
  });

  const viewPanResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gestureState) => {
      const dx = Math.abs(gestureState.dx);
      const dy = Math.abs(gestureState.dy);
      return !disabled && dx > dy * 2;
    },
    onPanResponderMove: (_, gestureState) => {
      dragDistance.setValue(Math.hypot(gestureState.dx, 0));
      drag.setValue({ x: gestureState.dx, y: 0 });
    },
    onPanResponderRelease: (_, gestureState) => {
      if (Math.abs(gestureState.dx) > DRAG_DISTANCE) {
        if (gestureState.dx < 0 && !DISABLE_LEFT_SWIPE) {
          nextCard('left');
        } else if (gestureState.dx > 0 && !DISABLE_RIGHT_SWIPE) {
          nextCard('right');
        } else {
          resetCard();
        }
      } else {
        resetCard();
      }
    }
  });

  const renderCard = (item, index) => {
    const label = item && item.uuid ? item.uuid : currentCard + index;

    const topCard = index === 0;

    const cardZoom = 1 - CARD_ZOOM_OFFSET * index;
    const scale = dragDistance.interpolate({
      inputRange: [0, DRAG_DISTANCE],
      outputRange: [cardZoom, cardZoom + CARD_ZOOM_OFFSET],
      extrapolate: 'clamp'
    });

    const rotate = drag.x.interpolate({
      inputRange: [DEFAULT_CARD_WIDTH * -1.3, 0, DEFAULT_CARD_WIDTH * 1.3],
      outputRange: ['-15deg', '0deg', '15deg'],
      extrapolate: 'clamp'
    });

    const topOffset = CARD_SPACING * DEFAULT_VISIBLE_CARD_COUNT;
    const topPadding = dragDistance.interpolate({
      inputRange: [0, DRAG_DISTANCE],
      outputRange: [
        topOffset - CARD_SPACING * index * 2.5,
        topOffset - CARD_SPACING * (index - 1) * 2.5
      ],
      extrapolate: 'clamp'
    });

    const horizontalOffset = CARD_SPACING * index;
    const horizontalPadding = dragDistance.interpolate({
      inputRange: [0, DRAG_DISTANCE],
      outputRange: [
        horizontalOffset * CARD_ZOOM_OFFSET,
        (horizontalOffset - CARD_SPACING) * CARD_ZOOM_OFFSET
      ],
      extrapolate: 'clamp'
    });

    const cardOpacity = 1 - index / DEFAULT_VISIBLE_CARD_COUNT;
    const opacity = dragDistance.interpolate({
      inputRange: [0, DRAG_DISTANCE],
      outputRange: [cardOpacity, cardOpacity + 1 / DEFAULT_VISIBLE_CARD_COUNT],
      extrapolate: 'clamp'
    });

    const animatedStyle = {
      position: 'absolute',
      zIndex: -index,
      transform: [
        { translateX: topCard ? drag.x : 0 },
        { scale: topCard ? 1 : scale },
        { rotate: topCard ? rotate : '0deg' }
      ],
      top: topPadding,
      left: topCard ? 0 : horizontalPadding,
      right: topCard ? 0 : horizontalPadding,
      opacity: topCard ? 1 : opacity
    };

    return (
      <Animated.View
        key={`card_${label}`}
        pointerEvents={topCard ? 'auto' : 'none'}
        style={[animatedStyle, { height: cardHeight }]}>
        {index < 2 && renderItem(item, index)}
        {index >= 2 && (
          <View style={[DEFAULT_STYLES.dummy, { height: cardHeight }]} />
        )}
      </Animated.View>
    );
  };

  const renderCardStack = () => {
    const visibleCardCount = Math.min(
      DEFAULT_VISIBLE_CARD_COUNT,
      totalCardCount - currentCard
    );

    return range(visibleCardCount).map(visibleIndex =>
      renderCard(items[currentCard + visibleIndex], visibleIndex)
    );
  };

  return (
    <View style={[DEFAULT_STYLES.stack, style]} {...omitTestIds(props)}>
      <View
        {...pickTestIds(props)}
        {...viewPanResponder.panHandlers}
        style={DEFAULT_STYLES.content}
        onLayout={event => {
          const { height } = event.nativeEvent.layout;
          setCardHeight(height - CARD_SPACING * DEFAULT_VISIBLE_CARD_COUNT);
        }}>
        {currentCard < totalCardCount && renderCardStack()}
      </View>
    </View>
  );
};
