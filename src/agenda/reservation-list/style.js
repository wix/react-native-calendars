import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  container: {
    flexDirection: 'row'
  },
  dayNum: {
    fontSize: 28,
    fontWeight: '200',
    color: '#7a92a5'
  },
  dayText: {
    fontSize: 14,
    fontWeight: '300',
    color: '#7a92a5',
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
    color: '#00adf5'
  }
});

