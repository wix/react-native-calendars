import { StyleSheet } from 'react-native';
import * as defaultStyle from '../style';
import constants from '../commons/constants';
const LINE_COLOR = '#D8D8D8';
const TIME_LABEL_COLOR = '#AAAAAA';
const EVENT_TEXT_COLOR = '#615B73';
const NOW_INDICATOR_COLOR = 'red';
const UNAVAILABLE_HOURS_BLOCK_COLOR = '#F8F9FA';
export default function styleConstructor(theme = {}, calendarHeight) {
    const appStyle = { ...defaultStyle, ...theme };
    return StyleSheet.create({
        container: {
            backgroundColor: appStyle.calendarBackground,
            ...appStyle.timelineContainer,
        },
        contentStyle: {
            backgroundColor: appStyle.calendarBackground,
            ...appStyle.contentStyle,
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
            ...appStyle.verticalLine,
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
            ...appStyle.nowIndicatorLine,
            position: 'absolute',
            left: 0,
            right: 0
        },
        nowIndicatorKnob: {
            width: 7,
            height: 7,
            borderRadius: 4,
            backgroundColor: NOW_INDICATOR_COLOR,
            ...appStyle.nowIndicatorKnob,
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
            ...appStyle.timeLabel,
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
            ...appStyle.event,
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
            ...appStyle.eventTitle,
            minHeight: 15
        },
        eventSummary: {
            color: EVENT_TEXT_COLOR,
            fontSize: 12,
            ...appStyle.eventSummary,
            flexWrap: 'wrap'
        },
        eventTimes: {
            marginTop: 3,
            color: EVENT_TEXT_COLOR,
            fontSize: 10,
            fontWeight: 'bold',
            ...appStyle.eventTimes,
            flexWrap: 'wrap'
        },
        eventsContainer: {
            flex: 1
        }
    });
}
