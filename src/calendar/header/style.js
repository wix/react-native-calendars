import {StyleSheet} from 'react-native';
import * as appStyle from '../../style';

export default StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 10,
    paddingRight: 10,
    alignItems: 'center'
  },
  monthText: {
    fontSize: 16,
    fontWeight: '300',
    color: appStyle.text.defaultColor,
    margin: 10
  },
  arrow: {
    padding: 10
  },
  week: {
    marginTop: 7,
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  dayHeader: {
    marginTop: 2,
    marginBottom: 7,
    width: 32,
    textAlign: 'center',
    fontSize: 12,
    color: appStyle.text.sectionTitleColor
  }
});

