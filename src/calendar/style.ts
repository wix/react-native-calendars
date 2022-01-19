import {StyleSheet} from 'react-native';
import * as defaultStyle from '../style';
import {Theme} from '../types';

export default function getStyle(theme: Theme = {}) {
  const appStyle = {...defaultStyle, ...theme};
  return StyleSheet.create({
    container: {
      paddingLeft: 5,
      paddingRight: 5,
      backgroundColor: appStyle.calendarBackground
    },
    dayContainer: {
      flex: 1,
      alignItems: 'center'
    },
    emptyDayContainer: {
      flex: 1
    },
    monthView: {
      backgroundColor: appStyle.calendarBackground
    },
    week: {
      marginVertical: appStyle.weekVerticalMargin,
      flexDirection: 'row',
      justifyContent: 'space-around'
    },
    weekSelectionComponent: {
      borderRadius: 3,
      borderWidth: 1,
      borderColor: appStyle.arrowColor,
      width: 30,
      aspectRatio: 1
    },
    weekSelectionComponentChecked: {
      borderWidth: 11,
      borderRadius: 5
    },
    // @ts-expect-error
    ...(theme['stylesheet.calendar.main'] || {})
  });
}
