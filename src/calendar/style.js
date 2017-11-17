import {StyleSheet} from 'react-native';
import * as defaultStyle from '../style';

const STYLESHEET_ID = 'stylesheet.calendar.main';

export default function getStyle(theme={}) {
  const appStyle = {...defaultStyle, ...theme};
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
      flexDirection: 'row',
      justifyContent: 'space-around'
    },

    //PET Style
    // container: {
    //   paddingLeft: 5,
    //   paddingRight: 5,
    //   flex: 1,
    //   backgroundColor: appStyle.calendarBackground,
    // },
    weekPet: {
      // marginTop: 7,
      // marginBottom: 7,
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginHorizontal: 12,
      borderColor: appStyle.borderColor,
      borderWidth: 1,
      borderTopWidth: 0
    },
    borderRadiusBottom: {
      borderBottomLeftRadius: 5,
      borderBottomRightRadius: 5
    },
    scrollView: {
      marginBottom: 18
    },
    //End PET Style

    ...(theme[STYLESHEET_ID] || {})
  });
}

