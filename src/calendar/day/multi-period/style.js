import { StyleSheet, Platform } from 'react-native';
import * as defaultStyle from '../../../style';

const STYLESHEET_ID = 'stylesheet.day.basic';

export default function styleConstructor(theme = {}) {
  const appStyle = { ...defaultStyle, ...theme };
  return StyleSheet.create({
    base: {
      width: 38,
      height: 38,
      alignItems: 'center',
    },
    text: {
      marginTop: Platform.OS === 'android' ? 4 : 6,
      fontSize: appStyle.textDayFontSize,
      fontFamily: appStyle.textDayFontFamily,
      fontWeight: '300',
      color: appStyle.dayTextColor,
      backgroundColor: 'rgba(255, 255, 255, 0)',
      flex: 5,
      paddingBottom: 0,
    },
    uren: {
      marginTop: Platform.OS === 'android' ? 4 : 6,
      fontSize: 11,
      fontFamily: appStyle.textDayFontFamily,
      fontWeight: '300',
      color: appStyle.dayTextColor,
      backgroundColor: 'rgba(255, 255, 255, 0)',
      flex: 5,
      paddingTop: 0,
      marginTop: 0,
    },
    alignedText: {
      marginTop: Platform.OS === 'android' ? 4 : 6,
    },
    stretch: {
      alignSelf: 'stretch'
    },
    selected: {
      backgroundColor: appStyle.selectedDayBackgroundColor,
      borderRadius: 32,
    },
    today: {
      backgroundColor: appStyle.todayBackgroundColor
    },
    todayText: {
      color: appStyle.todayTextColor,
    },
    selectedText: {
      color: appStyle.selectedDayTextColor,
    },
    disabledText: {
      color: appStyle.textDisabledColor,
    },
    dot: {
      // width: 42,
      height: 4,
      marginVertical: 1,
      // borderRadius: 2,
      opacity: 0,
    },
    leftFiller: {
      width: 4,
      height: 4,
      marginTop: 1,
      marginRight: -2,
    },
    rightFiller: {
      width: 4,
      height: 4,
      marginTop: 1,
      marginLeft: -2,
    },
    rounded: {
      borderRadius: 2,
    },
    visibleDot: {
      opacity: 1,
      backgroundColor: appStyle.dotColor,
    },
    selectedDot: {
      backgroundColor: appStyle.selectedDotColor,
    },
    startingPeriod: {
      width: 18,
      height: 4,
      marginTop: 1,
      borderRadius: 2,
      opacity: 0,
    },
    ...(theme[STYLESHEET_ID] || {}),
  });
}
