import {StyleSheet} from 'react-native';
import * as defaultStyle from '../style';
import platformStyles from './platform-style';
import {monthTextColor} from '../style';


const STYLESHEET_ID = 'stylesheet.agenda.main';

export default function styleConstructor(theme = {}) {
  const appStyle = {...defaultStyle, ...theme};
  const {knob, weekdays} = platformStyles(appStyle);

  return StyleSheet.create({
    knob,
    weekdays,
    header: {
      overflow: 'hidden',
      justifyContent: 'flex-end',
      position:'absolute',
      height:'100%',
      width:'100%'
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
    staticHeader: {
      textAlign: 'center',
      paddingTop: 20,
      fontSize: 16,
      color: monthTextColor
    },
    ...(theme[STYLESHEET_ID] || {})
  });
}
