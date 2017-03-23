import {StyleSheet} from 'react-native';
import * as defaultStyle from '../../style';

export default function styleConstructor(theme) {
  const appStyle = {...defaultStyle, ...theme};
  return StyleSheet.create({
    base: {
      width: 32,
      height: 32,
      alignItems: 'center'
    },
    text: {
      marginTop: 4,
      fontSize: 16,
      fontWeight: '300',
      color: appStyle.defaultColor,
      backgroundColor: 'rgba(255, 255, 255, 0)'
    },
    selected: {
      backgroundColor: appStyle.textLinkColor,
      borderRadius: 16
    },
    todayText: {
      color: appStyle.textLinkColor
    },
    selectedText: {
      color: appStyle.foregroundColor
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
      backgroundColor: appStyle.textLinkColor
    },
    selectedDot: {
      backgroundColor: appStyle.foregroundColor
    }
  });
};
