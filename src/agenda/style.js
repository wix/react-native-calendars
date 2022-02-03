import {StyleSheet} from 'react-native';
import * as defaultStyle from '../style';
import platformStyles from './platform-style';

<<<<<<< HEAD:src/agenda/style.js
const STYLESHEET_ID = 'stylesheet.agenda.main';

export default function styleConstructor(theme = {}) {
=======
export default function styleConstructor(theme: Theme = {}) {
>>>>>>> 115f18741ed6f1e9a22d7ebe2115e091b3d204ca:src/agenda/style.ts
  const appStyle = {...defaultStyle, ...theme};
  const {knob, weekdays} = platformStyles(appStyle);

  return StyleSheet.create({
    container: {
      flex: 1, 
      overflow: 'hidden'
    },
    animatedContainer: {
      flex: 1
    },
    knob,
    weekdays,
    header: {
      overflow: 'hidden',
      justifyContent: 'flex-end',
      position: 'absolute',
      height: '100%',
      width: '100%'
    },
    knobContainer: {
      flex: 1,
      position: 'absolute',
      left: 0,
      right: 0,
      height: 24,
      bottom: 0,
      alignItems: 'center',
      backgroundColor: appStyle.calendarBackground
    },
    weekday: {
      width: 32,
      textAlign: 'center',
      color: appStyle.textSectionTitleColor,
      fontSize: appStyle.textDayHeaderFontSize,
      fontFamily: appStyle.textDayHeaderFontFamily,
      fontWeight: appStyle.textDayHeaderFontWeight
    },
    reservations: {
      flex: 1,
      marginTop: 104,
      backgroundColor: appStyle.backgroundColor
    },
<<<<<<< HEAD:src/agenda/style.js
    ...(theme[STYLESHEET_ID] || {})
=======
    scrollPadStyle: {
      position: 'absolute',
      width: '100%',
      alignSelf: 'center'
    },
    // @ts-expect-error
    ...(theme['stylesheet.agenda.main'] || {})
>>>>>>> 115f18741ed6f1e9a22d7ebe2115e091b3d204ca:src/agenda/style.ts
  });
}
