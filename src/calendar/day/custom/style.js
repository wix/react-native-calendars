import {StyleSheet, Platform} from 'react-native';
import * as defaultStyle from '../../../style';

const STYLESHEET_ID = 'stylesheet.day.single';

export default function styleConstructor(theme={}) {
  const appStyle = {...defaultStyle, ...theme};
  return StyleSheet.create({
    base: {
      width: 32,
      height: 32,
      alignItems: 'center',
      ...appStyle.baseTextDayStyle
    },
    text: {
      marginTop: Platform.OS === 'android' ? 4 : 6,
      fontSize: appStyle.textDayFontSize,
      fontFamily: appStyle.textDayFontFamily,
      fontWeight: appStyle.textDayFontWeight,
      color: appStyle.dayTextColor,
      backgroundColor: 'rgba(255, 255, 255, 0)',
      ...appStyle.textDayStyle
    },
    alignedText: {
      marginTop: Platform.OS === 'android' ? 4 : 6
    },
    selected: {
      backgroundColor: appStyle.selectedDayBackgroundColor,
      borderRadius: 16,
      ...appStyle.selectedStyle
    },
    today: {
      backgroundColor: appStyle.todayBackgroundColor,
      ...appStyle.todayStyle
    },
    todayText: {
      color: appStyle.todayTextColor,
      ...appStyle.todayTextStyle
    },
    selectedText: {
      color: appStyle.selectedDayTextColor,
      ...appStyle.selectedTextStyle
    },
    disabledContainer: {
      backgroundColor: appStyle.disabledContainer,
      ...appStyle.disabledContainerStyle
    },
    disabledText: {
      color: appStyle.textDisabledColor,
      ...appStyle.disabledTextStyle
    },
    ...(theme[STYLESHEET_ID] || {})
  });
}
