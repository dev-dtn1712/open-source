import React, { useState } from 'react';
import { Animated, ScrollView, StyleSheet, View, Text } from 'react-native';
import { Fade } from './Fade';
import { APP_WHITE, APP_DARK_GRAY, Fonts, COLOR_PALETTE } from '../../Themes';
import {
  DEFAULT_TOP_BAR_HEIGHT,
  CENTER_PADDING,
  TopBar
} from '../../Components';
import { omitTestIds, pickTestIds } from '../../Utils';

export const DEFAULT_TITLE_HEIGHT = 40;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: APP_DARK_GRAY
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
    zIndex: 99
  },
  headerContainer: {
    height: DEFAULT_TOP_BAR_HEIGHT - CENTER_PADDING,
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  headline: {
    ...Fonts.style.title,
    textAlign: 'center',
    fontSize: Fonts.size.normal,
    color: APP_WHITE
  },
  titleContainer: {
    position: 'absolute',
    top: DEFAULT_TOP_BAR_HEIGHT,
    left: 16,
    zIndex: 77
  },
  title: {
    ...Fonts.style.title,
    color: APP_WHITE
  }
});

const useNativeDriver = false;

export const ScrollSurface = ({
  title,
  titleStyle,
  containerStyle,
  topBarStyle,
  topBarProps,
  headerContainerStyle,
  headlineStyle,
  isNavTransparencyEnabled = false,
  barColor = APP_DARK_GRAY,
  scrollViewProps,
  scrollContainerStyle,
  contentStyle,
  children,
  ...props
}) => {
  const [isHeaderScrolled, setIsHeaderScrolled] = useState(false);

  const scrollAnimated = new Animated.Value(0);
  const headerOpacity = scrollAnimated.interpolate({
    inputRange: [0, 10, DEFAULT_TOP_BAR_HEIGHT],
    outputRange: [0, 0.8, 1],
    extrapolate: 'clamp',
    useNativeDriver
  });
  const titleOpacity = scrollAnimated.interpolate({
    inputRange: [0, 10, DEFAULT_TOP_BAR_HEIGHT],
    outputRange: [1, 0, 0],
    extrapolate: 'clamp',
    useNativeDriver
  });

  const handleScroll = event => {
    const offset = event.nativeEvent.contentOffset.y;
    const isScrolled =
      offset > (isNavTransparencyEnabled ? 10 : DEFAULT_TITLE_HEIGHT);

    if (!isHeaderScrolled && isScrolled) {
      setIsHeaderScrolled(isScrolled);
    }

    if (isHeaderScrolled && !isScrolled) {
      setIsHeaderScrolled(isScrolled);
    }
  };

  return (
    <View style={[styles.container, containerStyle]} {...omitTestIds(props)}>
      <TopBar
        style={[
          styles.header,
          topBarStyle,
          { backgroundColor: COLOR_PALETTE.transparent }
        ]}
        {...topBarProps}
      />

      <Animated.View
        style={[
          styles.header,
          { zIndex: 88, backgroundColor: barColor },
          { opacity: isNavTransparencyEnabled ? headerOpacity : 1 }
        ]}>
        <Fade visible={isHeaderScrolled} duration={1}>
          <View style={[styles.headerContainer, headerContainerStyle]}>
            <Text style={[styles.headline, headlineStyle]}>{title}</Text>
          </View>
        </Fade>
      </Animated.View>

      <ScrollView
        {...pickTestIds(props, 'Content')}
        style={[{ flex: 1, backgroundColor: APP_WHITE }, contentStyle]}
        contentContainerStyle={scrollContainerStyle}
        scrollEventThrottle={16}
        overScrollMode="never"
        onScroll={Animated.event(
          [
            {
              nativeEvent: { contentOffset: { y: scrollAnimated } }
            }
          ],
          {
            listener: handleScroll,
            useNativeDriver
          }
        )}
        {...scrollViewProps}>
        <View style={styles.titleContainer}>
          <Animated.Text
            style={[
              styles.title,
              titleStyle,
              { opacity: isNavTransparencyEnabled ? titleOpacity : 1 }
            ]}>
            {title}
          </Animated.Text>
        </View>
        {children}
      </ScrollView>
    </View>
  );
};
