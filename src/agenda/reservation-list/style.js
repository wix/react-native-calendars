import {StyleSheet} from 'react-native';
import * as appStyle from '../../style';

export default StyleSheet.create({
  container: {
    flexDirection: 'row'
  },
  dayNum: {
    fontSize: 28,
    fontWeight: '200',
    color: '#b6c1cd'
  },
  dayText: {
    fontSize: 14,
    fontWeight: '300',
    color: '#b6c1cd',
    marginTop: -5,
    backgroundColor: 'rgba(0,0,0,0)'
  },
  day: {
    width: 63,
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 7
  },
  today: {
    color: appStyle.text.linkColor
  }
});

