import {StyleSheet} from 'react-native';
import * as defaultStyle from '../style';

const STYLESHEET_ID = 'stylesheet.calendar-list.main';

export default function getStyle(theme={}) {
  const appStyle = {...defaultStyle, ...theme};
  return StyleSheet.create({
    container: {
      backgroundColor: appStyle.calendarBackground
    },
    placeholder: {
      backgroundColor: appStyle.calendarBackground,
      alignItems: 'center',
      justifyContent: 'center'
    },
    placeholderText: {
      fontSize: 30,
      fontWeight: '200',
      color: appStyle.dayTextColor
    },
    loadingSpinner: {
      color: '#6da1a6'
    },
    calendar: {
      paddingLeft: 15,
      paddingRight: 15
    },
    ...(theme[STYLESHEET_ID] || {})
  });
}
