import {StyleSheet} from 'react-native';
import * as defaultStyle from '../../style';

const STYLESHEET_ID = 'stylesheet.agenda.list';

export default function styleConstructor(theme = {}) {
  const appStyle = {...defaultStyle, ...theme};
  return  StyleSheet.create({
    container: {
      flexDirection: 'row',
    },
    monthNum:{
      fontSize: 12,
      color:'rgba(0,0,0,0.5)',
      paddingRight:2,
    },
    dayNum: {
      fontSize: 20,
      fontWeight: '300',
      lineHeight:22,
      marginTop: 4,
    },
    dayText: {
      fontSize: 14,
      fontWeight: '300',
      marginTop: 4,
      color: appStyle.agendaDayTextColor,
      backgroundColor: 'rgba(0,0,0,0)'
    },
    formart:{
      width:63,
      alignItems:'flex-end'
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
