import {StyleSheet} from 'react-native';
import * as defaultStyle from '../../../style';


const STYLESHEET_ID = 'stylesheet.day.period';
const FILLER_HEIGHT = 34;

export default function styleConstructor(theme={}) {
  const appStyle = {...defaultStyle, ...theme};
  return StyleSheet.create({
    wrapper: {
      alignItems: 'center',
      alignSelf: 'stretch',
      marginLeft: -1
    },
    base: {
      width: 38,
      height: FILLER_HEIGHT,
      alignItems: 'center'
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
    },
    selectedText: {
      color: appStyle.selectedDayTextColor
    },
    disabledText: {
      color: appStyle.textDisabledColor
    },
    
    quickAction: {
      backgroundColor: 'white',
      borderWidth: 1,
      borderColor: '#c1e4fe'
    },
<<<<<<< HEAD:src/calendar/day/period/style.js
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
    ...(theme[STYLESHEET_ID] || {})
=======

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
    // @ts-expect-error
    ...(theme['stylesheet.day.period'] || {})
>>>>>>> 115f18741ed6f1e9a22d7ebe2115e091b3d204ca:src/calendar/day/period/style.ts
  });
}
