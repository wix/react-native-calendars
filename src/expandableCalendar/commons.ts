import {Platform, Dimensions, I18nManager, PlatformIOSStatic} from 'react-native';

const {height, width} = Dimensions.get('window');

export const isRTL = I18nManager.isRTL;
export const isAndroid = Platform.OS === 'android';
export const isIos = Platform.OS === 'ios';
export const screenWidth = width;
export const screenHeight = height;
export const screenAspectRatio = screenWidth < screenHeight ? screenHeight / screenWidth : screenWidth / screenHeight;
export const isTablet = (Platform as PlatformIOSStatic).isPad || (screenAspectRatio < 1.6 && Math.max(screenWidth, screenHeight) >= 900);
export const todayString = 'today';

export enum UpdateSources {
  CALENDAR_INIT = 'calendarInit',
  TODAY_PRESS = 'todayPress',
  LIST_DRAG = 'listDrag',
  DAY_PRESS = 'dayPress',
  PAGE_SCROLL = 'pageScroll',
  WEEK_SCROLL = 'weekScroll',
  PROP_UPDATE = 'propUpdate'
}
