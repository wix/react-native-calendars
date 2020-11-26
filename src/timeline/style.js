// @flow
import {Platform, StyleSheet} from 'react-native';

const CALENDAR_VERTICAL_OFFSET = 15;

export default function styleConstructor(
  theme = {},
  calendarHeight,
  {offsetLeft, offsetRight, offsetBottom, timeTextWidth},
) {
  let style = {
    container: {
      flex: 1,
      backgroundColor: '#ffff',
      ...theme.container
    },
    contentStyle: {
      backgroundColor: '#ffff',
      height: calendarHeight + CALENDAR_VERTICAL_OFFSET * 2 + offsetBottom,
      paddingTop: CALENDAR_VERTICAL_OFFSET,
      paddingBottom: CALENDAR_VERTICAL_OFFSET,
      ...theme.contentStyle
    },
    innerContentStyle: {
      height: calendarHeight
    },
    header: {
      paddingHorizontal: 30,
      height: 50,
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderColor: '#E6E8F0',
      backgroundColor: '#F5F5F6',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'stretch',
      ...theme.header
    },
    headerTextContainer: {
      justifyContent: 'center'
    },
    headerText: {
      fontSize: 16,
      ...theme.headerText
    },
    arrow: {
      width: 15,
      height: 15,
      resizeMode: 'contain'
    },
    arrowButton: {
      width: 50,
      alignItems: 'center',
      justifyContent: 'center',
      ...theme.arrowButton
    },
    event: {
      position: 'absolute',
      backgroundColor: '#F0F4FF',
      borderColor: '#DDE5FD',
      borderWidth: 1,
      paddingLeft: 4,
      minHeight: 25,
      flex: 1,
      opacity: 1,
      paddingTop: 5,
      paddingBottom: 0,
      flexDirection: 'column',
      alignItems: 'flex-start',
      overflow: 'hidden',
      ...theme.event
    },
    eventTitle: {
      color: '#615B73',
      fontWeight: '600',
      minHeight: 15,
      ...theme.eventTitle
    },
    eventSummary: {
      color: '#615B73',
      fontSize: 12,
      flexWrap: 'wrap',
      ...theme.eventSummary
    },
    eventTimes: {
      marginTop: 3,
      fontSize: 10,
      fontWeight: 'bold',
      color: '#615B73',
      flexWrap: 'wrap',
      ...theme.eventTimes
    },
    line: {
      height: 1,
      position: 'absolute',
      backgroundColor: 'rgb(216,216,216)',
      left: offsetLeft + timeTextWidth,
      right: offsetRight,
      ...theme.line
    },
    lineNow: {
      height: 2,
      position: 'absolute',
      backgroundColor: 'red',
      left: offsetLeft + timeTextWidth - 10,
      right: offsetRight - 10,
      ...theme.lineNow
    },
    timeLabel: {
      position: 'absolute',
      left: offsetLeft,
      width: timeTextWidth,
      textAlign: 'left',
      color: 'rgb(170,170,170)',
      fontSize: 10,
      fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'Roboto',
      fontWeight: '500',
      ...theme.timeLabel
    }
  };
  return StyleSheet.create(style);
}
