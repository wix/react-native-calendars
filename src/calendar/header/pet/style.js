import {StyleSheet, Platform} from 'react-native';
import * as defaultStyle from '../../style';

const STYLESHEET_ID = 'stylesheet.calendar.header';

export default function(theme={}) {
  const appStyle = {...defaultStyle, ...theme};
  return StyleSheet.create({
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingLeft: 10,
      paddingRight: 10,
      alignItems: 'center'
    },
    // monthText: {
    //   fontSize: appStyle.textMonthFontSize,
    //   fontFamily: appStyle.textMonthFontFamily,
    //   fontWeight: '300',
    //   color: appStyle.monthTextColor,
    //   margin: 10
    // },
    arrow: {
      padding: 10
    },
    arrowImage: {
      ...Platform.select({
        ios: {
          tintColor: appStyle.arrowColor
        },
        android: {
          tintColor: appStyle.arrowColor
        }
      })
    },
    // week: {
    //   marginTop: 7,
    //   flexDirection: 'row',
    //   justifyContent: 'space-around'
    // },
    // dayHeader: {
    //   marginTop: 2,
    //   marginBottom: 7,
    //   width: 32,
    //   textAlign: 'center',
    //   fontSize: appStyle.textDayHeaderFontSize,
    //   fontFamily: appStyle.textDayHeaderFontFamily,
    //   color: appStyle.textSectionTitleColor
    // },

    //PET Style
    monthText: {
      fontSize: 100 / 3,
      fontWeight: 'bold',
      color: appStyle.primaryColor,
      // marginVertical: 23 / 3,
      marginLeft: 23 / 3
    },
    yearText: {
      fontSize: 10,
      fontWeight: 'bold',
      color: appStyle.primaryColor,
      // marginVertical: 23 / 3,
      marginRight: 23 / 3,
      paddingTop: 5
    },
    week: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      borderColor: appStyle.borderColor,
      borderWidth: 1,
      marginHorizontal: 12,
      borderTopLeftRadius: 5,
      borderTopRightRadius: 5,
    },
    dayHeader: {
      marginTop: 4,
      marginBottom: 6,
      textAlign: 'center',
      fontSize: 10,
      fontWeight: 'bold',
      color: appStyle.primaryColor,
      width: '100%'
    },
    dayHeaderWeekend: {
      color: appStyle.specialColor
    },
    viewDay: {
      flex: 1 / 7,
      borderRightColor: appStyle.borderColor,
      borderRightWidth: 1
    },
    noRightBorder: {
      borderRightWidth: 0
    },
    //End PET Style

    ...(theme[STYLESHEET_ID] || {})
  });
}
