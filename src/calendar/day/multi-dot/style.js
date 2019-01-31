import { Platform, StyleSheet } from "react-native"
import * as defaultStyle from "../../../style"

const STYLESHEET_ID = "stylesheet.day.multiDot"

export default function styleConstructor(theme = {}) {
  const appStyle = { ...defaultStyle, ...theme }
  return StyleSheet.create({
    base: {
      width: "100%",
      height: 32,
      alignItems: "center",
      borderRadius: 1,
      borderColor: "transparent",
      borderWidth: 1,
    },
    text: {
      marginTop: Platform.OS === "android" ? 4 : 5,
      fontSize: appStyle.textDayFontSize,
      fontFamily: appStyle.textDayFontFamily,
      fontWeight: "300",
    },
    defaultText: {
      color: appStyle.dayTextColor,
    },
    alignedText: {
      marginTop: Platform.OS === "android" ? 4 : 5,
    },
    selected: {
      backgroundColor: appStyle.separatorColor,
      borderRadius: 1,
      borderColor: "transparent",
      borderWidth: 1,
    },
    today: {
      borderRadius: 1,
      borderColor: appStyle.todayColor,
      borderWidth: 1,
    },
    todayText: {
      color: appStyle.dayTextColor,
      marginTop: 5,
    },
    holidayText: {
      color: appStyle.holidayColor,
      marginTop: 5,
    },
    saturdayText: {
      color: appStyle.saturdayColor,
      marginTop: 5,
    },
    selectedText: {
      marginTop: 5,
    },
    disabledText: {
      color: appStyle.textDisabledColor,
    },
    dot: {
      width: 4,
      height: 4,
      marginTop: 1,
      marginLeft: 1,
      marginRight: 1,
      borderRadius: 2,
      opacity: 0,
    },
    dotText: {
      margin: 0,
      padding: 0,
      top: Platform.OS === "android" ? -10 : -9,
    },
    visibleDot: {
      opacity: 1,
      backgroundColor: appStyle.dotColor,
    },
    selectedDot: {
      backgroundColor: appStyle.selectedDotColor,
    },
    ...(theme[STYLESHEET_ID] || {}),
  })
}
