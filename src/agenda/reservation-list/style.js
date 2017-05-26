import {StyleSheet} from 'react-native';
import * as defaultStyle from '../style';

export default StyleSheet.create({
  container: {
    flexDirection: 'row'
  },
  dayNum: {
    fontSize: 28,
    fontWeight: '200',
    color: defaultStyle.reservationListDayNumColor
  },
  dayText: {
    fontSize: 14,
    fontWeight: '300',
    color: defaultStyle.reservationListDayTextColor,
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
    color: defaultStyle.reservationListTodayColor
  }
});

