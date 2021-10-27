import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { storiesOf } from '@storybook/react-native';

import { PagedView } from './PagedView';
import { Button } from '../Button';
import { SecondaryButton } from '../SecondaryButton';

const PagedViewContainer = props => {
  const [pageNumber, setPageNumber] = useState(0);

  return (
    <PagedView onPage={setPageNumber} pageNumber={pageNumber} {...props} />
  );
};

const TriggeredViewContainer = props => {
  const [pageNumber, setPageNumber] = useState(0);
  const onNext = () => {
    if (pageNumber < 2) {
      setPageNumber(pageNumber + 1);
    }
  };
  const onPrev = () => {
    if (pageNumber > 0) {
      setPageNumber(pageNumber - 1);
    }
  };

  return (
    <View style={{ height: '100%' }}>
      <PagedView
        pageNumber={pageNumber}
        scrollEnabled={false}
        style={{ flex: 1 }}
        {...props}
      />
      <Button onPress={onNext}>Next</Button>
      <SecondaryButton onPress={onPrev}>Previous</SecondaryButton>
    </View>
  );
};

storiesOf('PagedView', module)
  .add('default', () => (
    <PagedViewContainer>
      <Text>Page 1</Text>
      <Text>Page 2</Text>
      <Text>Page 3</Text>
    </PagedViewContainer>
  ))
  .add('narrow', () => (
    <View style={{ width: '100%', alignItems: 'center' }}>
      <PagedViewContainer pageWidth={160} style={{ backgroundColor: 'orange' }}>
        <Text>Page 1</Text>
        <Text>Page 2</Text>
        <Text>Page 3</Text>
      </PagedViewContainer>
    </View>
  ))
  .add('externally triggered', () => (
    <TriggeredViewContainer>
      <Text>Page 1</Text>
      <Text>Page 2</Text>
      <Text>Page 3</Text>
    </TriggeredViewContainer>
  ));
