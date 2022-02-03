import {StyleSheet} from 'react-native';
import * as defaultStyle from '../../../style';

const STYLESHEET_ID = 'stylesheet.dot';

export default function styleConstructor(theme = {}) {
  const appStyle = {...defaultStyle, ...theme};
  return StyleSheet.create({
    dot: {
      width: 4,
      height: 4,
      marginTop: 1,
      marginHorizontal: 1,
      borderRadius: 2,
      opacity: 0,
      backgroundColor:"red",
      ...appStyle.dotStyle
    },
    visibleDot: {
      opacity: 1,
      backgroundColor: "red",
    },
    selectedDot: {
      backgroundColor: appStyle.selectedDotColor
    },
    disabledDot: {
      backgroundColor: appStyle.disabledDotColor || appStyle.dotColor
    },
    todayDot: {
      backgroundColor: appStyle.todayDotColor || appStyle.dotColor
    },
<<<<<<< HEAD:src/calendar/day/dot/style.js
    ...(theme[STYLESHEET_ID] || {})
=======
    // @ts-expect-error
    ...(theme['stylesheet.dot'] || {})
>>>>>>> 115f18741ed6f1e9a22d7ebe2115e091b3d204ca:src/calendar/day/dot/style.ts
  });
}
