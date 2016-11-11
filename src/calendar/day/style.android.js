import {StyleSheet} from 'react-native';
import * as appStyle from '../../../common/style';

export default StyleSheet.create({
  base: {
    width: 32,
    height: 32,
    alignItems: 'center'
  },
  text: {
    marginTop: 4,
    fontSize: 16,
    fontWeight: '300',
    color: '#2d4150',
    backgroundColor: 'rgba(255, 255, 255, 0)'
  },
  selected: {
    backgroundColor: appStyle.text.linkColor,
    borderRadius: 16
  },
  todayText: {
    color: appStyle.text.linkColor
  },
  selectedText: {
    color: 'white'
  },
  disabledText: {
    color: appStyle.text.disabledText
  },
  dot: {
    width: 4,
    height: 4,
    marginTop: 0,
    borderRadius: 2,
    opacity: 0
  },
  visibleDot: {
    opacity: 1,
    backgroundColor: appStyle.text.linkColor
  },
  selectedDot: {
    backgroundColor: appStyle.backgroundColor
  }
});

