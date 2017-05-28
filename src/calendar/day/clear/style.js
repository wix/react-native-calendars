import {StyleSheet, Platform} from 'react-native';
import * as defaultStyle from '../../../style';
import {Colors, Typography} from 'react-native-ui-lib';

export default function styleConstructor(theme = {}) {
  const appStyle = {...defaultStyle, ...theme};
  return StyleSheet.create({
    base: {
      width: 32,
      height: 32,
      alignItems: 'center'
    },
    text: {
      marginTop: 3,
      color: appStyle.dayTextColor,
      backgroundColor: 'rgba(255, 255, 255, 0)',
      ...Typography.text80
    },
    alignedText: {
      marginTop: Platform.OS === 'android' ? 4 : 6
    },
    selected: {
      borderRadius: 16,
      backgroundColor: Colors.dark10
    },
    today: {
      borderRadius: 16,
      borderWidth: 1,
      borderColor: appStyle.todayBorderColor
    },
    todayText: {
      color: appStyle.todayTextColor
    },
    selectedText: {
      color: appStyle.selectedDayTextColor
    },
    disabledText: {
      color: appStyle.textDisabledColor
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
      backgroundColor: appStyle.dotColor
    },
    selectedDot: {
      backgroundColor: appStyle.selectedDotColor
    }
  });
}
