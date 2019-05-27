import {Platform, Dimensions, I18nManager} from 'react-native';

const {height, width} = Dimensions.get('window');

export const isRTL = I18nManager.isRTL;
export const isAndroid = Platform.OS === 'android';
export const isIos = Platform.OS === 'ios';
export const screenWidth = width;
export const screenHeight = height;
export const todayString = 'today';

export const UPDATE_SOURCES = {
  LIST_DRAG: 'listDrag',
  CALENDAR_INIT: 'calendarInit',
  DAY_PRESS: 'dayPress',
  PAGE_SCROLL: 'pageScroll'
};
