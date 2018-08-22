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
      fontFamily: appStyle.agendaDayNumFontFamily,
      fontSize: appStyle.agendaDayNumFontSize || 28,
      fontWeight: appStyle.agendaDayNumFontWeight || '400',
      color: appStyle.agendaDayNumColor
    },
    dayText: {
      fontSize: appStyle.agendaDayFontSize || 14,
      fontWeight: appStyle.agendaDayFontWeight || '300',
      color: appStyle.agendaDayTextColor,
      fontFamily: appStyle.agendaDayFontFamily,
      marginTop: appStyle.agendaDayMarginTop || -5,
      backgroundColor: 'rgba(0,0,0,0)'
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
