import {Dimensions, I18nManager, Platform, PlatformIOSStatic} from 'react-native';


const {width: screenWidth, height: screenHeight} = Dimensions.get('window');
const isRTL = I18nManager.isRTL;
const isAndroid = Platform.OS === 'android';
const isIOS = Platform.OS === 'ios';
const screenAspectRatio = screenWidth < screenHeight ? screenHeight / screenWidth : screenWidth / screenHeight;
const isTablet = (Platform as PlatformIOSStatic).isPad || (screenAspectRatio < 1.6 && Math.max(screenWidth, screenHeight) >= 900);
const isAndroidRTL = isAndroid && isRTL;

export default {
  screenWidth,
  screenHeight,
  isRTL,
  isAndroid,
  isIOS,
  isTablet,
  isAndroidRTL
};
