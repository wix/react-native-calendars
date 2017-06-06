import {StyleSheet} from 'react-native';
import * as defaultStyle from '../style';

export default function styleConstructor(theme = {}) {
  const appStyle = {...defaultStyle, ...theme};
  return StyleSheet.create({
    calendar: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      borderBottomWidth: 1,
      borderColor: appStyle.separatorColor
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
    knob: {
      width: 38,
      height: 7,
      marginTop: 10,
      borderRadius: 3,
      backgroundColor: '#f2F4f5'
    },
    weekdays: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginLeft: 15,
      marginRight: 15,
      paddingTop: 15,
      paddingBottom: 7,
      backgroundColor: appStyle.calendarBackground
    },
    weekday: {
      width: 32,
      textAlign: 'center',
      fontSize: 13,
      color: appStyle.textSectionTitleColor,
    },
    reservations: {
      flex: 1,
      marginTop: 104,
      backgroundColor: appStyle.backgroundColor
    },
  });
}
