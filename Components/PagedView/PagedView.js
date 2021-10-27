import { isNil, noop } from 'lodash';
import React, { Component, createRef } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { Metrics } from '../../Themes';

const DEFAULT_STYLES = StyleSheet.create({
  page: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  scrollView: {
    height: '100%'
  }
});

const isValidPageNumber = (page, max) =>
  !isNil(page) && page >= 0 && page < max;

export class PagedView extends Component {
  static defaultProps = {
    onPage: noop,
    pageWidth: Metrics.screenWidth
  };

  constructor(props) {
    super(props);
    this.scrollViewRef = createRef();
  }

  componentDidUpdate(prevProps) {
    const { children, pageNumber, onPage, pageWidth } = this.props;

    if (
      prevProps.pageNumber !== pageNumber &&
      isValidPageNumber(pageNumber, children.length)
    ) {
      this.scrollViewRef.current.scrollTo({
        x: pageNumber * pageWidth,
        y: 0,
        animated: true
      });
      onPage(pageNumber);
    }
  }

  render() {
    const {
      children,
      onPage,
      pageNumber,
      pageStyle,
      style,
      pageWidth,
      ...props
    } = this.props;

    const onMomentumScrollEnd = event => {
      const { contentOffset } = event.nativeEvent;
      const newPageNumber = Math.round(contentOffset.x / pageWidth);
      onPage(newPageNumber);
    };

    return (
      <ScrollView
        horizontal
        pagingEnabled
        onMomentumScrollEnd={onMomentumScrollEnd}
        ref={this.scrollViewRef}
        showsHorizontalScrollIndicator={false}
        style={[DEFAULT_STYLES.scrollView, { width: pageWidth }, style]}
        {...props}>
        {React.Children.map(children, child => (
          <View style={[DEFAULT_STYLES.page, { width: pageWidth }, pageStyle]}>
            {child}
          </View>
        ))}
      </ScrollView>
    );
  }
}
