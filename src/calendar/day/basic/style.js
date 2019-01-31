import { Platform, StyleSheet } from "react-native"
import * as defaultStyle from "../../../style"

const STYLESHEET_ID = "stylesheet.day.basic"

export default function styleConstructor(theme = {}) {
  const appStyle = { ...defaultStyle, ...theme }
  return StyleSheet.create({
    base: {
      width: 32,
      height: 32,
      alignItems: "center",
    },
    text: {
      marginTop: Platform.OS === "android" ? 4 : 6,
      fontSize: appStyle.textDayFontSize,
      fontFamily: appStyle.textDayFontFamily,
      fontWeight: "300",
      color: appStyle.dayTextColor,
      backgroundColor: "transparent",
    },
    alignedText: {
      marginTop: Platform.OS === "android" ? 4 : 6,
    },
    selected: {
      borderRadius: 1,
      borderColor: appStyle.agendaDayTextColor,
      borderWidth: 1,
    },
    today: {
      borderRadius: 1,
      borderColor: appStyle.todayColor,
      borderWidth: 1,
    },
    todayText: {
      marginTop: 5,
      color: appStyle.todayTextColor,
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
      borderRadius: 2,
      opacity: 0,
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
