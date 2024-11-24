import {StyleSheet} from 'react-native';
import * as defaultStyle from '../../../style';
import {Theme} from '../../../types';
import constants from '../../../commons/constants';

export default function styleConstructor(theme: Theme = {}) {
  const appStyle = {...defaultStyle, ...theme};
  return StyleSheet.create({
    container: {
      alignSelf: 'stretch',
      alignItems: 'center'
    },
    base: {
      width: 32,
      height: 32,
      alignItems: 'center'
    },
    selected: {
      backgroundColor: appStyle.selectedDayBackgroundColor,
      borderRadius: 16
    },
    today: {
      backgroundColor: appStyle.todayBackgroundColor,
      borderRadius: 16
    },
    
    text: {
      marginTop: constants.isAndroid ? 4 : 6,
      fontSize: appStyle.textDayFontSize,
      fontFamily: appStyle.textDayFontFamily,
      fontWeight: appStyle.textDayFontWeight,
      color: appStyle.dayTextColor,
      backgroundColor: 'rgba(255, 255, 255, 0)',
      ...appStyle.textDayStyle
    },
    todayText: {
      color: appStyle.todayTextColor
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
    ...(theme['stylesheet.day.basic'] || {})
  });
}
