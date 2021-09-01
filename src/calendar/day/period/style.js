import { StyleSheet } from 'react-native';
import * as defaultStyle from '../../../style';
const FILLER_HEIGHT = 40;
export default function styleConstructor(theme = {}) {
  const appStyle = { ...defaultStyle, ...theme };
  return StyleSheet.create({
    wrapper: {
      alignItems: 'center',
      alignSelf: 'stretch',
      marginLeft: -1,
    },
    base: {
      width: FILLER_HEIGHT,
      height: FILLER_HEIGHT,
      alignItems: 'center',
      justifyContent: 'center',
    },
    fillers: {
      position: 'absolute',
      height: FILLER_HEIGHT,
      flexDirection: 'row',
      left: 0,
      right: 0,
    },
    leftFiller: {
      height: FILLER_HEIGHT,
      flex: 1,
    },
    rightFiller: {
      height: FILLER_HEIGHT,
      flex: 1,
    },
    text: {
      marginTop: 7,
      fontSize: appStyle.textDayFontSize,
      fontFamily: appStyle.textDayFontFamily,
      fontWeight: appStyle.textDayFontWeight,
      color: appStyle.dayTextColor,
      backgroundColor: 'rgba(255, 255, 255, 0)',
    },
    today: {
      backgroundColor: appStyle.todayBackgroundColor,
    },
    todayText: {
      fontWeight: '500',
      color: theme.todayTextColor || appStyle.dayTextColor,
    },
    selectedText: {
      color: appStyle.selectedDayTextColor,
    },
    disabledText: {
      color: appStyle.textDisabledColor,
      textDecorationLine: 'line-through',
    },
    inactiveText: {
      color: appStyle.textInactiveColor,
    },
    // quickAction: {
    //   backgroundColor: 'white',
    //   borderWidth: 1,
    //   borderColor: '#c1e4fe'
    // },
    // quickActionText: {
    //   marginTop: 6,
    //   color: appStyle.textColor
    // },
    // firstQuickAction: {
    //   backgroundColor: appStyle.textLinkColor
    // },
    // firstQuickActionText: {
    //   color: 'white'
    // },
    // naText: {
    //   color: '#b6c1cd'
    // },
    ...(theme.stylesheet?.day?.period || {}),
    borderArrow: {
      width: 8,
      height: 6,
      borderTopColor: '#bdbdbd',
      borderLeftColor: 'rgba(0,0,0,0)',
      borderColor: 'rgba(0,0,0,0)',
      borderTopWidth: 6,
      borderLeftWidth: 4,
      borderRightWidth: 4,
      alignSelf: 'center',
      position: 'absolute',
      left: 22,
      top: -7,
    },
    innerArrow: {
      width: 6,
      height: 4,
      borderTopColor: '#fff',
      borderLeftColor: 'rgba(0,0,0,0)',
      borderColor: 'rgba(0,0,0,0)',
      borderTopWidth: 4,
      borderLeftWidth: 3,
      borderRightWidth: 3,
      alignSelf: 'center',
      position: 'absolute',
      left: 23,
      top: -7,
    },
  });
}
