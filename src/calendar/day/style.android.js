import {StyleSheet} from 'react-native';
import * as appStyle from '../../style';

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
    color: '#ffffff',
    backgroundColor: 'rgba(255, 255, 255, 0)'
  },
  selected: {
    backgroundColor: 'white',
    borderRadius: 16
  },
  todayText: {
    color: appStyle.text.color
  },
  selectedText: {
    color: appStyle.foregroundColor
  },
  disabledText: {
    color: 'rgba(255, 255, 255, 0.5)'
  },
  dot: {
    width: 4,
    height: 4,
    marginTop: 1,
    borderRadius: 2,
    opacity: 0
  },
  visibleDot: {
    opacity: 1,
    backgroundColor: appStyle.text.linkColor
  },
  selectedDot: {
    backgroundColor: appStyle.foregroundColor
  }
});

