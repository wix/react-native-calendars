import {StyleSheet} from 'react-native';
import * as defaultStyle from '../style';

const STYLESHEET_ID = 'stylesheet.calendar.main';

export default function getStyle(theme={}) {
  const appStyle = {...defaultStyle, ...theme};
  return StyleSheet.create({
    container: {
      paddingLeft: 10,
      paddingRight: 10,
      marginBottom: 7,
      backgroundColor: appStyle.calendarBackground
    },
    week: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    ...(theme[STYLESHEET_ID] || {})
  });
}
