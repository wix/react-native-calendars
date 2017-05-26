import {StyleSheet} from 'react-native';
import * as defaultStyle from '../../style';

export default function styleConstructor(theme = {}) {
  const appStyle = {...defaultStyle, ...theme};
  return  StyleSheet.create({
    container: {
      flexDirection: 'row'
    },
    dayNum: {
      fontSize: 28,
      fontWeight: '200',
      color: appStyle.reservationListDayNumColor
    },
    dayText: {
      fontSize: 14,
      fontWeight: '300',
      color: appStyle.reservationListDayTextColor,
      marginTop: -5,
      backgroundColor: 'rgba(0,0,0,0)'
    },
    day: {
      width: 63,
      alignItems: 'center',
      justifyContent: 'flex-start',
      marginTop: 32
    },
    today: {
      color: appStyle.reservationListTodayColor
    }
  });
}
