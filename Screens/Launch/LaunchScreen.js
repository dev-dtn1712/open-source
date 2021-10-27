import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Image, Text, View, Linking } from 'react-native';
import RNBootSplash from 'react-native-bootsplash';

import { ActionModal } from '../../Components';
import { Images } from '../../Themes';

// Styles
import styles from './LaunchScreenStyles';

const PLAYSTORE_URL =
  'https://play.google.com/store/apps/details?id=social.unveil.parallel';
const UPDATE_ACTION_TITLE = "Let's Update!";
const UPDATE_ACTION_STATEMENT =
  "We'll visit the App Store to finish the update.";

class LaunchScreen extends Component {
  componentDidMount() {
    RNBootSplash.hide({ fade: true });
  }

  openPlayStore = () => {
    const supported = Linking.canOpenURL(PLAYSTORE_URL);
    if (supported) {
      Linking.openURL(PLAYSTORE_URL);
    }
  };

  render() {
    return (
      <View style={styles.mainContainer}>
        <View style={styles.container}>
          <View style={styles.logoTitleContainer}>
            <Image source={Images.logoCanWeTitled} style={[styles.logoTitle]} />
          </View>
        </View>
        <View style={styles.bottomContainer}>
          <Text style={styles.text}>a discovery app from</Text>
          <Image source={Images.logo} style={styles.unveil} />
        </View>
        <ActionModal
          isVisible={this.props.isAppOutdated}
          title={UPDATE_ACTION_TITLE}
          statement={UPDATE_ACTION_STATEMENT}
          actionOption="OK"
          onAction={() => this.openPlayStore()}
        />
      </View>
    );
  }
}

const mapStateToProps = state => ({
  isAppOutdated: state.auth.isAppOutdated
});

export default connect(mapStateToProps)(LaunchScreen);
