import { StyleSheet } from "react-native";
import * as defaultStyle from "../style";

export default function getStyle(theme = {}) {
  const appStyle = { ...defaultStyle, ...theme };
  return StyleSheet.create({
    container: {
      paddingLeft: 5,
      paddingRight: 5,
      flex: 1,
      backgroundColor: appStyle.calendarBackground
    },
    week: {
      marginTop: 7,
      marginBottom: 7,
      flexDirection: "row",
      justifyContent: "space-around"
    },
    yearText: {
      fontSize: appStyle.textYearFontSize,
      fontFamily: appStyle.textYearFontFamily,
      fontWeight: "300",
      color: appStyle.yearTextColor,
      marginBottom: 40,
      alignSelf: "center"
    }
  });
}
