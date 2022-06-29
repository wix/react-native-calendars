import {StyleSheet} from 'react-native';
import * as defaultStyle from '../style';
import {Theme} from '../types';
import constants from '../commons/constants';

const LINE_COLOR = '#D8D8D8';
const TIME_LABEL_COLOR = '#AAAAAA';
const EVENT_TEXT_COLOR = '#615B73';
const NOW_INDICATOR_COLOR = 'red';
const UNAVAILABLE_HOURS_BLOCK_COLOR = '#F8F9FA';

export default function styleConstructor(theme: Theme = {}, calendarHeight: number) {
  const appStyle = {...defaultStyle, ...theme};

  return StyleSheet.create({
    container: {
      backgroundColor: appStyle.calendarBackground,
      ...theme.container,
    },
    contentStyle: {
      backgroundColor: appStyle.calendarBackground,
      ...theme.contentStyle,
      flexDirection: 'row',
      height: calendarHeight + 10
    },
    line: {
      height: 1,
      backgroundColor: LINE_COLOR,
      ...theme.line,
      position: 'absolute'
    },
    verticalLine: {
      width: 1,
      backgroundColor: LINE_COLOR,
      ...theme.verticalLine,
      position: 'absolute',
      height: '105%'
    },
    nowIndicator: {
      position: 'absolute',
      right: 0
    },
    nowIndicatorLine: {
      height: 1,
      backgroundColor: NOW_INDICATOR_COLOR, 
      ...theme.nowIndicatorLine,
      position: 'absolute',
      left: 0,
      right: 0
    },
    nowIndicatorKnob: {
      width: 7,
      height: 7,
      borderRadius: 4,
      backgroundColor: NOW_INDICATOR_COLOR,
      ...theme.nowIndicatorKnob,
      position: 'absolute',
      left: -3,
      top: -3
    },
    timeLabel: {
      color: TIME_LABEL_COLOR,
      fontSize: 10,
      fontWeight: '500',
      fontFamily: constants.isIOS ? 'Helvetica Neue' : 'Roboto',
      paddingLeft: 12,
      textAlign: 'center',
      ...theme.timeLabel,
      position: 'absolute'
    },
    unavailableHoursBlock: {
      position: 'absolute',
      right: 0,
      backgroundColor: UNAVAILABLE_HOURS_BLOCK_COLOR
    },
    event: {
      opacity: 1,
      paddingLeft: 4,
      paddingTop: 5,
      paddingBottom: 0,
      backgroundColor: '#F0F4FF',
      borderColor: '#DDE5FD',
      borderWidth: 1,
      ...theme.event,
      position: 'absolute',
      flex: 1,
      flexDirection: 'column',
      alignItems: 'flex-start',
      overflow: 'hidden',
      minHeight: 25,
    },
    eventTitle: {
      color: EVENT_TEXT_COLOR,
      fontWeight: '600',
      ...theme.eventTitle,
      minHeight: 15
    },
    eventSummary: {
      color: EVENT_TEXT_COLOR,
      fontSize: 12,
      ...theme.eventSummary,
      flexWrap: 'wrap'
    },
    eventTimes: {
      marginTop: 3,
      color: EVENT_TEXT_COLOR,
      fontSize: 10,
      fontWeight: 'bold',
      ...theme.eventTimes,
      flexWrap: 'wrap'
    },
    eventsContainer: {
      flex: 1
    },
    ...(theme?.stylesheet?.timeline?.main || {})
  });
}
