import {StyleSheet} from 'react-native';
import * as defaultStyle from '../../style';

const STYLESHEET_ID = 'stylesheet.agenda.list';

export default function styleConstructor(theme = {}) {
  const appStyle = {...defaultStyle, ...theme};
  return  StyleSheet.create({
    container: {
      flexDirection: 'row'
    },
    dayNum: {
      fontSize: appStyle.agendaDayNumFontSize,
      fontWeight: appStyle.agendaDayNumFontSize || '200',
      fontFamily: appStyle.agendaDayFontFamily,
      color: appStyle.agendaDayNumColor
    },
    dayText: {
      fontSize: appStyle.agendaDayFontSize,
      fontWeight: appStyle.agendaDayFontWeight,
      fontFamily: appStyle.agendaDayFontFamily,
      color: appStyle.agendaDayTextColor,
      backgroundColor: 'rgba(0,0,0,0)',
    },
    day: {
      width: 63,
      alignItems: 'center',
      justifyContent: 'flex-start',
      marginTop: 32
    },
    today: {
      color: appStyle.agendaTodayColor
    },
    ...(theme[STYLESHEET_ID] || {})
  });
}
