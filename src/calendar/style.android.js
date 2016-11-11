import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  container: {
    paddingLeft: 5,
    paddingRight: 5,
    flex: 1,
    backgroundColor: 'white'
  },
  week: {
    marginTop: 7,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  arrow: {
    padding: 10
  },
  monthText: {
    fontSize: 16,
    fontWeight: '300',
    color: '#2d4150',
    margin: 10,
    marginBottom: 7
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 0,
    paddingRight: 0,
    alignItems: 'center'
  },
  dayHeader: {
    marginTop: 3,
    marginBottom: 2,
    width: 32,
    textAlign: 'center',
    paddingTop: 0,
    paddingBottom: 10,
    fontSize: 12,
    color: '#b6c1cd'
  }
});

