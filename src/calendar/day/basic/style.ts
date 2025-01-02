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
      width: appStyle.basicDayHeight,
      height: appStyle.basicDayHeight,
      alignItems: 'center'
    },
    today: {
      backgroundColor: appStyle.todayBackgroundColor,
      borderRadius: appStyle.basicDayHeight / 2
    },
    selected: {
      backgroundColor: appStyle.selectedDayBackgroundColor,
      borderRadius: appStyle.basicDayHeight / 2
    },
    
    text: {
      fontSize: appStyle.textDayFontSize,
      fontFamily: appStyle.textDayFontFamily,
      fontWeight: appStyle.textDayFontWeight,
      color: appStyle.dayTextColor,
      backgroundColor: 'rgba(0, 0, 0, 0)',
      marginTop: constants.isAndroid ? 4 : 6,
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
