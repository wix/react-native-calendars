import {StyleSheet} from 'react-native';
import * as defaultStyle from '../../style';

<<<<<<< HEAD:src/agenda/reservation-list/style.js
const STYLESHEET_ID = 'stylesheet.agenda.list';

export default function styleConstructor(theme = {}) {
=======
export default function styleConstructor(theme: Theme = {}) {
>>>>>>> 115f18741ed6f1e9a22d7ebe2115e091b3d204ca:src/agenda/reservation-list/style.ts
  const appStyle = {...defaultStyle, ...theme};
  return StyleSheet.create({
    container: {
      flexDirection: 'row'
    },
    innerContainer: {
      flex: 1
    },
    dayNum: {
      fontSize: 28,
      fontWeight: '200',
      fontFamily: appStyle.textDayFontFamily,
      color: appStyle.agendaDayNumColor
    },
    dayText: {
      fontSize: 14,
      fontWeight: appStyle.textDayFontWeight,
      fontFamily: appStyle.textDayFontFamily,
      color: appStyle.agendaDayTextColor,
      backgroundColor: 'rgba(0,0,0,0)',
      marginTop: -5
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
    indicator: {
      marginTop: 80
    },
<<<<<<< HEAD:src/agenda/reservation-list/style.js
    ...(theme[STYLESHEET_ID] || {})
=======
    // @ts-expect-error
    ...(theme['stylesheet.agenda.list'] || {})
>>>>>>> 115f18741ed6f1e9a22d7ebe2115e091b3d204ca:src/agenda/reservation-list/style.ts
  });
}
