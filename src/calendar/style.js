import {StyleSheet} from 'react-native';
import * as defaultStyle from '../style';

const STYLESHEET_ID = 'stylesheet.calendar.main';

export default function getStyle(theme = {}) {
  const appStyle = {...defaultStyle, ...theme};
  return StyleSheet.create({
    container: {
      paddingLeft: 5,
      paddingRight: 5,
      backgroundColor: appStyle.calendarBackground
    },
    dayContainer: {
      flex: 1,
      alignItems: 'center'
    },
    emptyDayContainer: {
      flex: 1
    },
    monthView: {
      backgroundColor: appStyle.calendarBackground
    },
    week: {
      marginVertical: appStyle.weekVerticalMargin,
      flexDirection: 'row',
      justifyContent: 'space-around'
    },
<<<<<<< HEAD:src/calendar/style.js
    ...(theme[STYLESHEET_ID] || {})
=======
    // @ts-expect-error
    ...(theme['stylesheet.calendar.main'] || {})
>>>>>>> 115f18741ed6f1e9a22d7ebe2115e091b3d204ca:src/calendar/style.ts
  });
}
