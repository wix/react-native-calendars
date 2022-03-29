// @flow
import {StyleSheet} from 'react-native';
import {Theme} from '../types';
import constants from '../commons/constants';

// const eventPaddingLeft = 4
export const HOURS_SIDEBAR_WIDTH = 72;

export default function styleConstructor(theme: Theme = {}, calendarHeight: number) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#ffff',
      ...theme.container
    },
    contentStyle: {
      backgroundColor: '#ffff',
      height: calendarHeight + 10,
      ...theme.contentStyle
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
      left: HOURS_SIDEBAR_WIDTH - 16,
      backgroundColor: 'rgb(216,216,216)',
      ...theme.line
    },
    verticalLine: {
      position: 'absolute',
      width: 1,
      height: '105%',
      backgroundColor: 'rgb(216,216,216)',
      left: HOURS_SIDEBAR_WIDTH
    },
    nowIndicator: {
      position: 'absolute',
      left: HOURS_SIDEBAR_WIDTH,
      right: 0
    },
    nowIndicatorLine: {
      height: 1,
      position: 'absolute',
      left: 0,
      right: 0,
      backgroundColor: 'red',
      ...theme.nowIndicatorLine
    },
    nowIndicatorKnob: {
      position: 'absolute',
      left: -3,
      top: -3,
      width: 7,
      height: 7,
      borderRadius: 4,
      backgroundColor: 'red',
      ...theme.nowIndicatorKnob
    },
    timeLabel: {
      position: 'absolute',
      color: 'rgb(170,170,170)',
      fontSize: 10,
      fontFamily: constants.isIOS ? 'Helvetica Neue' : 'Roboto',
      fontWeight: '500',
      paddingLeft: 12,
      textAlign: 'center',
      width: HOURS_SIDEBAR_WIDTH - 16,
      ...theme.timeLabel
    },
    unavailableHoursBlock: {
      position: 'absolute',
      left: HOURS_SIDEBAR_WIDTH,
      right: 0,
      backgroundColor: '#F8F9FA'
    }
  });
}
