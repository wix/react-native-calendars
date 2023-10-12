import {StyleSheet} from 'react-native';
import * as defaultStyle from '../../../style';
import {Theme} from '../../../types';

const FILLER_HEIGHT = 36;
const SELECTED_BASE_SIZE = 45;

export default function styleConstructor(theme: Theme = {}) {
  const appStyle = {...defaultStyle, ...theme};
  return StyleSheet.create({
    wrapper: {
      alignItems: 'center',
      alignSelf: 'stretch',
      marginLeft: -1
    },
    base: {
      width: SELECTED_BASE_SIZE,
      height: SELECTED_BASE_SIZE,
      alignItems: 'center',
      justifyContent: 'center'
    },

    fillers: {
      position: 'absolute',
      height: FILLER_HEIGHT,
      flexDirection: 'row',
      top: 4.5,
      left: 0,
      right: 0,
      overflow: 'hidden'
    },
    leftFiller: {
      backgroundColor: appStyle.calendarBackground,
      height: FILLER_HEIGHT,
      flex: 1,
    },
    rightFiller: {
      backgroundColor: appStyle.calendarBackground,
      height: FILLER_HEIGHT,
      flex: 1
    },

    text: {
      fontSize: appStyle.textDayFontSize,
      fontFamily: appStyle.textDayFontFamily,
      fontWeight: appStyle.textDayFontWeight,
      color: appStyle.dayTextColor,
      backgroundColor: 'rgba(255, 255, 255, 0)'
    },
    dotContainer: {
      position: 'absolute',
      bottom: 3
    },
    today: {
      backgroundColor: appStyle.todayBackgroundColor
    },
    todayText: {
      fontWeight: '500',
      color: theme.todayTextColor || appStyle.dayTextColor
    },
    selectedText: {
      color: appStyle.selectedDayTextColor
    },
    disabledText: {
      color: appStyle.textDisabledColor
    },
    inactiveText: {
      color: appStyle.textInactiveColor
    },
    ...(theme['stylesheet.day.period'] || {})
  });
}
