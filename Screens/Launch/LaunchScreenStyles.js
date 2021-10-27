import { StyleSheet } from 'react-native';
import { APP_LIGHT_GRAY, Fonts, ApplicationStyles } from '../../Themes';

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  container: {
    flex: 4,
    alignItems: 'center',
    justifyContent: 'center'
  },
  logo: {
    resizeMode: 'contain',
    alignSelf: 'center',
    width: 153,
    height: 128
  },
  logoTitleContainer: {
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    overflow: 'hidden'
  },
  logoTitle: {
    resizeMode: 'contain',
    alignSelf: 'center',
    width: 198
  },
  bottomContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  text: {
    ...Fonts.style.normal,
    fontStyle: 'italic',
    color: APP_LIGHT_GRAY
  },
  unveil: {
    resizeMode: 'contain',
    alignSelf: 'center',
    width: 99,
    height: 103
  }
});
