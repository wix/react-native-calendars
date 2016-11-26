import {StyleSheet} from 'react-native';
import * as appStyle from '../style';

export default StyleSheet.create({
  calendar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    borderBottomWidth: 1,
    borderColor: appStyle.separatorColor
  },
  knobContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: -7,
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0)'
  },
  weekdays: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 24,
    paddingRight: 24,
    paddingTop: 10,
    paddingBottom: 2,
    backgroundColor: appStyle.foregroundColor
  },
  weekday: {
    width: 32,
    textAlign: 'center',
    fontSize: 12,
    color: '#b6c1cd',
  },
  reservations: {
    flex: 1,
    marginTop: 71,
    backgroundColor: '#f4f4f4'
  },
});

