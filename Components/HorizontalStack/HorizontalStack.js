import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Breadcrumbs } from '../Breadcrumbs';
import { PagedView } from '../PagedView';
import { Metrics } from '../../Themes';

const CRUMB_SIZE = 9;
const CRUMB_SPACING = 7;
const TOTAL_CRUMB_SPACE = 2 * CRUMB_SPACING + CRUMB_SIZE;
const { screenHeight, screenWidth } = Metrics;

const DEFAULT_STYLES = StyleSheet.create({
  breadcrumbs: {
    position: 'absolute',
    bottom: 16
  },
  page: {
    height: screenHeight
  },
  stack: {},
  wrapper: {}
});

const getBreadcrumbsLeft = count => {
  return screenWidth / 2 - (TOTAL_CRUMB_SPACE * count) / 2;
};
const atLoopedIndex = (arr, index) => {
  const { length } = arr;
  if (length === 0) {
    return undefined;
  }

  return arr[index % length];
};

export const HorizontalStack = ({
  children,
  currentPage = 0,
  highlight = [],
  onPage = () => {},
  pageStyle,
  showBreadcrumbs = true,
  style,
  wrapperStyle,
  ...props
}) => {
  const [page, setPage] = useState(currentPage);
  const highlights = Array.isArray(highlight) ? highlight : [highlight];
  const left = getBreadcrumbsLeft(children.length);

  const onViewPage = newPage => {
    setPage(newPage);
    onPage(newPage);
  };

  useEffect(() => {
    onViewPage(currentPage);
  }, [currentPage]);

  return (
    <View style={[DEFAULT_STYLES.wrapper, wrapperStyle]}>
      <PagedView
        onPage={onViewPage}
        pageNumber={page}
        pageStyle={[DEFAULT_STYLES.page, pageStyle]}
        pageWidth={screenWidth}
        style={[DEFAULT_STYLES.stack, style]}
        {...props}>
        {children}
      </PagedView>
      {showBreadcrumbs && (
        <Breadcrumbs
          count={children.length}
          highlight={atLoopedIndex(highlights, page)}
          selected={page}
          size={CRUMB_SIZE}
          spacing={CRUMB_SPACING}
          style={[DEFAULT_STYLES.breadcrumbs, { left }]}
          testID="breadcrumbs"
        />
      )}
    </View>
  );
};
