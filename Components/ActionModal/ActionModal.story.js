import React from 'react';
import { storiesOf } from '@storybook/react-native';
import { action } from '@storybook/addon-actions';

import { ActionModal } from './ActionModal';
import { Images } from '../../Themes';

const DEFAULTS = {
  isVisible: true
};

storiesOf('ActionModal', module)
  .add('No Buttons', () => (
    <ActionModal
      {...DEFAULTS}
      title="Bluetooth/Wireless Off"
      statement="We’re unable to scan around you, check your Bluetooth and WiFi settings to continue."
      coverScreen={false}
    />
  ))
  .add('Action Button', () => (
    <ActionModal
      {...DEFAULTS}
      title="No Users Found"
      statement="We can’t find anyone near you using the app. Make sure they’re in discovery mode too!"
      actionOption="Keep Scanning"
      onAction={action('onAction')}
      coverScreen={false}
    />
  ))
  .add('Action/Dismiss buttons', () => (
    <ActionModal
      {...DEFAULTS}
      title="Accept"
      statement="Would you like to connect with this person and explore each others intents?"
      actionOption="Accept"
      dismissOption="No Thanks"
      onAction={action('onAction')}
      onDismiss={action('onDismiss')}
      coverScreen={false}
    />
  ))
  .add('Modal with Username', () => (
    <ActionModal
      {...DEFAULTS}
      username="nehalt"
      title="nehalt"
      statement="Member since 2019"
      actionOption="Send Invite"
      onAction={action('onAction')}
      coverScreen={false}
    />
  ))
  .add('Modal with Glyph Icon', () => (
    <ActionModal
      {...DEFAULTS}
      glyph="😥"
      title="No Users Found"
      statement="We can’t find anyone near you using the app. Make sure they’re in discovery mode too!"
      actionOption="Keep Scanning"
      onAction={action('onAction')}
      coverScreen={false}
    />
  ))
  .add('Modal with Image', () => (
    <ActionModal
      {...DEFAULTS}
      image={Images.iconRadar}
      title="Discovery Scan"
      statement="Scanning..."
      actionOption="Keep Scanning"
      onAction={action('onAction')}
      coverScreen={false}
    />
  ));
