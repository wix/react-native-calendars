import {Dimensions, I18nManager, Platform, PlatformIOSStatic} from 'react-native';


const {width: screenWidth, height: screenHeight} = Dimensions.get('window');
const isRTL = I18nManager.isRTL;
const isAndroid = Platform.OS === 'android';
const isIOS = Platform.OS === 'ios';
const screenAspectRatio = screenWidth < screenHeight ? screenHeight / screenWidth : screenWidth / screenHeight;
const isTablet = (Platform as PlatformIOSStatic).isPad || (screenAspectRatio < 1.6 && Math.max(screenWidth, screenHeight) >= 900);
const isAndroidRTL = isAndroid && isRTL;
const isRN73 = () => !!Platform?.constants?.reactNativeVersion && Platform.constants.reactNativeVersion?.minor >= 73;
const isWeb = Platform.OS === 'web';
const getRNWebMinorVersion = () => {
  const version = require('react-native-web/package.json').version;
  const minorVersion = parseInt(version.split('.')[1], 10);
  return minorVersion;
};

export default {
  screenWidth,
  screenHeight,
  isRTL,
  isAndroid,
  isIOS,
  isTablet,
  isAndroidRTL,
  isRN73,
  isWeb,
  getRNWebMinorVersion
};
