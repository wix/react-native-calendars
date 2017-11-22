import {StyleSheet} from 'react-native';
import * as defaultStyle from '../../../style';

const STYLESHEET_ID = 'stylesheet.day.basic';

export default function styleConstructor(theme={}) {
  const appStyle = {...defaultStyle, ...theme};
  return StyleSheet.create({
    // base: {
    //   width: 32,
    //   height: 32,
    //   alignItems: 'center',
    // },
    // text: {
    //   marginTop: 4,
    //   fontSize: appStyle.textDayFontSize,
    //   fontFamily: appStyle.textDayFontFamily,
    //   fontWeight: '300',
    //   color: appStyle.dayTextColor,
    //   backgroundColor: 'rgba(255, 255, 255, 0)'
    // },
    // alignedText: {
    //   marginTop: Platform.OS === 'android' ? 4 : 6
    // },
    // selected: {
    //   backgroundColor: appStyle.selectedDayBackgroundColor,
    //   borderRadius: 16
    // },
    // todayText: {
    //   color: appStyle.todayTextColor
    // },
    // selectedText: {
    //   color: appStyle.selectedDayTextColor
    // },
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
    },

    //PET Style
    base: {
      // width: 32,
      // height: 45,
      height: (appStyle.heightCalendar - 74) / 5,
      // alignItems: 'center',
      flex: 1/7,
      // backgroundColor: "red",
      borderRightWidth: 1,
      borderRightColor: appStyle.borderColor,
      padding: 0
    },
    text: {
      fontSize: 40 / 3,
      fontWeight: 'bold',
      color: appStyle.primaryColor,
      marginLeft: 3
      // backgroundColor: 'rgba(255, 255, 255, 0)'
      // backgroundColor: 'yellow',
      // paddingVertical: 5
    },
    noRightBorder: {
      borderRightWidth: 0
    },
    specialText: {
      color:appStyle.specialColor
    },
    todayText: {

    },
    todayView: {
      backgroundColor: appStyle.bgDayColor
    },
    alignedText: {
      // marginTop: Platform.OS === 'android' ? 4 : 6
      marginLeft: 3
    },
    viewDotComponent: {
      flex: 1,
      alignItems: 'center'
    },
    selected: {
      // backgroundColor: appStyle.selectedDayBackgroundColor,
      // borderRadius: 16
    },
    selectedText: {
      // color: appStyle.selectedDayTextColor
    },
    viewBound: {
      height: "100%",
      width: "100%",
    },
    selectedView: {
      // backgroundColor: appStyle.bgDayColor
      borderWidth: 1,
      borderColor: "#0cc287"
    },
    dayView: {
      flexDirection: 'row',
      alignItems: 'flex-end'
    },
    typeDayText: {
      fontSize: 8,
      fontWeight: 'bold',
      color: 'red',
      marginBottom: 3,
      flex: 1
    },
    //End PET Style

    ...(theme[STYLESHEET_ID] || {})
  });
}
