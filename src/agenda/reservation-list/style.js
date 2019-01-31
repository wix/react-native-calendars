import { StyleSheet } from "react-native"
import * as defaultStyle from "../../style"

const STYLESHEET_ID = "stylesheet.agenda.list"

export default function styleConstructor(theme = {}) {
  const appStyle = { ...defaultStyle, ...theme }
  return StyleSheet.create({
    container: {
      flexDirection: "row",
    },
    daySeparator: {
      borderColor: "black",
      borderTopWidth: 2,
    },
    dayNum: {
      fontSize: 28,
      fontWeight: "200",
      color: appStyle.agendaDayNumColor,
    },
    dayText: {
      fontSize: 14,
      fontWeight: "300",
      color: appStyle.agendaDayTextColor,
      marginTop: -5,
      backgroundColor: "transparent",
    },
    day: {
      width: 63,
      alignItems: "center",
      justifyContent: "flex-start",
    },
    today: {
      color: appStyle.todayColor,
    },
    holiday: {
      color: appStyle.holidayColor,
    },
    saturday: {
      color: appStyle.saturdayColor,
    },
    ...(theme[STYLESHEET_ID] || {}),
  })
}
