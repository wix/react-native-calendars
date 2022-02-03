import {StyleSheet} from 'react-native';
import * as defaultStyle from '../../style';

const STYLESHEET_ID = 'stylesheet.marking';

export default function styleConstructor(theme = {}) {
  const appStyle = {...defaultStyle, ...theme};
  return StyleSheet.create({
    dots: {
      flexDirection: 'row'
    },
    periods: {
      alignSelf: 'stretch'
    },
    period: {
      height: 4,
      marginVertical: 1,
      backgroundColor: appStyle.dotColor
    },
    startingDay: {
      borderTopLeftRadius: 2,
      borderBottomLeftRadius: 2,
      marginLeft: 4
    },
    endingDay: {
      borderTopRightRadius: 2,
      borderBottomRightRadius: 2,
      marginRight: 4
    },
<<<<<<< HEAD:src/calendar/day/marking/style.js
    ...(theme[STYLESHEET_ID] || {})
=======
    // @ts-expect-error
    ...(theme['stylesheet.marking'] || {})
>>>>>>> 115f18741ed6f1e9a22d7ebe2115e091b3d204ca:src/calendar/day/marking/style.ts
  });
}
