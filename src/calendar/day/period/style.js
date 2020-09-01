import {StyleSheet} from 'react-native';
import * as defaultStyle from '../../../style';


const STYLESHEET_ID = 'stylesheet.day.period';
const FILLER_HEIGHT = 34;
const FILLER_WIDTH = 34;

export default function styleConstructor(theme={}) {
  const appStyle = {...defaultStyle, ...theme};
  return StyleSheet.create({
    wrapper: {
      alignItems: 'center',
      alignSelf: 'stretch',
      marginLeft: 0
    },
    base: {
      width: FILLER_WIDTH,
      height: FILLER_HEIGHT,
      alignItems: 'center',
      overflow: 'hidden'
    },
    fillers: {
      position: 'absolute',
      height: FILLER_HEIGHT,
      flexDirection: 'row',
      left: 0,
      right: 0
    },
    leftFiller: {
      height: FILLER_HEIGHT,
      flex: 1
    },
    rightFiller: {
      height: FILLER_HEIGHT,
      flex: 1
    },
    text: {
      marginTop: 7,
      fontSize: appStyle.textDayFontSize,
      fontFamily: appStyle.textDayFontFamily,
      fontWeight: appStyle.textDayFontWeight,
      color: appStyle.dayTextColor,
      backgroundColor: 'rgba(255, 255, 255, 0)'
    },
    today: {
      backgroundColor: appStyle.todayBackgroundColor
    },
    todayText: {
      fontWeight: '500',
      color: theme.todayTextColor || appStyle.dayTextColor
      //color: appStyle.textLinkColor
    },
    disabledText: {
      color: appStyle.textDisabledColor
    },
    quickAction: {
      backgroundColor: 'white',
      borderWidth: 1,
      borderColor: '#c1e4fe'
    },
    quickActionText: {
      marginTop: 6,
      color: appStyle.textColor
    },
    firstQuickAction: {
      backgroundColor: appStyle.textLinkColor
    },
    firstQuickActionText: {
      color: 'white'
    },
    naText: {
      color: '#b6c1cd'
    },
    dot: {
      width: 4,
      height: 4,
      marginTop: 1,
      marginLeft: 1,
      marginRight: 1,
      borderRadius: 2,
      opacity: 0
    },
    visibleDot: {
      opacity: 1,
      backgroundColor: appStyle.dotColor
    },
    ...(theme[STYLESHEET_ID] || {})
  });
}
