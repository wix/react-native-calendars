import {StyleSheet} from 'react-native';
import * as defaultStyle from '../style';
import {Theme} from '../types';

export default function getStyle(theme: Theme = {}) {
  const appStyle = {...defaultStyle, ...theme};
  return StyleSheet.create({
    container: {
      // paddingLeft: 5,
      // paddingRight: 5,
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
      backgroundColor: appStyle.calendarBackground,
      paddingBottom: 15,
      borderBottomColor: '#C2C8CC',
      borderBottomWidth: 0.5,
    },
    week: {
      marginTop: 7,
      // marginBottom: 7,
      flexDirection: 'row',
      justifyContent: 'space-around'
    },
    total: {
      marginTop: 7,
      width: 45,
      textAlign: 'center',
      fontSize: appStyle.textDayFontSize,
      fontFamily: appStyle.textDayHeaderFontFamily,
      fontWeight: appStyle.textDayHeaderFontWeight,
      color: appStyle.textDayHeaderColor,
    },
    dayHeader: {
      marginTop: 10,
      marginBottom: 5,
      width: 30,
      textAlign: 'center',
      fontSize: appStyle.textDayHeaderFontSize,
      fontFamily: appStyle.textDayHeaderFontFamily,
      fontWeight: appStyle.textDayHeaderFontWeight,
      color: appStyle.textDayHeaderColor,
    },
    disabledDayHeader: {
      color: appStyle.weekendTextDayHeaderColor,
    },
    ...(theme.stylesheet?.calendar?.main || {})
  });
}
