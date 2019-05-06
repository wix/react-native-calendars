import {StyleSheet} from 'react-native';
import * as defaultStyle from '../style';

const STYLESHEET_ID = 'stylesheet.expandable.main';

export default function styleConstructor(theme={}) {
  const appStyle = {...defaultStyle, ...theme};
  return StyleSheet.create({
    containerShadow: {
      borderWidth: 1,
      borderColor: 'white',
      shadowColor: '#79838A',
      shadowOpacity: 0.2,
      shadowRadius: 2,
      shadowOffset: {height: 6, width: 0},
      zIndex: 99,
      elevation: 2
    },
    container: {
      backgroundColor: appStyle.calendarBackground
    },
    knobContainer: {
      position: 'absolute',
      left: 0,
      right: 0,
      height: 24,
      bottom: 0,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: appStyle.calendarBackground
    },
    knob: {
      width: 40,
      height: 4,
      borderRadius: 3,
      backgroundColor: appStyle.textColor
    },
    sectionText: {
      fontWeight: 'bold', 
      fontSize: 12,
      color: '#5c95ff',
      paddingVertical: 8, 
      paddingLeft: 20,
      backgroundColor: appStyle.calendarBackground
    },
    header: {
      position: 'absolute',
      left: 0,
      right: 0,
      backgroundColor: appStyle.calendarBackground
    },
    headerTitle: {
      alignSelf: 'center',
      paddingTop: 10,
      paddingBottom: 18,
      fontSize: appStyle.textMonthFontSize,
      fontFamily: appStyle.textMonthFontFamily,
      fontWeight: appStyle.textMonthFontWeight,
      color: appStyle.monthTextColor
    },
    weekDayNames: {
      flexDirection: 'row', 
      justifyContent: 'space-between', 
      paddingHorizontal: 22
    },
    weekday: {
      width: 32,
      textAlign: 'center',
      fontSize: 13,
      color: appStyle.textSectionTitleColor
    },
    monthView: {
      backgroundColor: appStyle.calendarBackground
    },
    week: {
      flex: 1,
      marginTop: 7,
      marginBottom: 7,
      flexDirection: 'row',
      justifyContent: 'space-around'
    },
    ...(theme[STYLESHEET_ID] || {})
  });
}
