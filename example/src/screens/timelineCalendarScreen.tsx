import groupBy from 'lodash/groupBy';
// import filter from 'lodash/filter';
// import find from 'lodash/find';

import React, {Component} from 'react';
// import {Alert} from 'react-native';
import {
  ExpandableCalendar,
  TimelineEventProps,
  TimelineList,
  CalendarProvider,
  TimelineProps,
  CalendarUtils,
} from 'react-native-calendars';

import {timelineEvents, getDate} from '../mocks/timelineEvents';

const INITIAL_TIME = {hour: 9, minutes: 0};
const EVENTS: TimelineEventProps[] = timelineEvents;

export default class TimelineCalendarScreen extends Component {
  state = {
    currentDate: getDate(),
    events: EVENTS,
    eventsByDate: groupBy(EVENTS, e => CalendarUtils.getCalendarDateString(e.start)) as {
      [key: string]: TimelineEventProps[];
    },
  };

  marked = {
    [`${getDate(-1)}`]: {marked: true},
    [`${getDate()}`]: {marked: true},
    [`${getDate(1)}`]: {marked: true},
    [`${getDate(2)}`]: {marked: true},
    [`${getDate(4)}`]: {marked: true},
  };

  onDateChanged = (date: string, source: string) => {
    console.log('TimelineCalendarScreen onDateChanged: ', date, source);
    this.setState({currentDate: date});
  };

  onMonthChange = (month: any, updateSource: any) => {
    console.log('TimelineCalendarScreen onMonthChange: ', month, updateSource);
  };

  // createNewEvent: TimelineProps['onBackgroundLongPress'] = (timeString, timeObject) => {
  //   const {eventsByDate} = this.state;
  //   const hourString = `${(timeObject.hour + 1).toString().padStart(2, '0')}`;
  //   const minutesString = `${timeObject.minutes.toString().padStart(2, '0')}`;

  //   const newEvent = {
  //     id: 'draft',
  //     start: `${timeString}`,
  //     end: `${timeObject.date} ${hourString}:${minutesString}:00`,
  //     title: 'New Event',
  //     color: 'white'
  //   };

  //   if (timeObject.date) {
  //     if (eventsByDate[timeObject.date]) {
  //       eventsByDate[timeObject.date] = [...eventsByDate[timeObject.date], newEvent];
  //       this.setState({eventsByDate});
  //     } else {
  //       eventsByDate[timeObject.date] = [newEvent];
  //       this.setState({eventsByDate: {...eventsByDate}});
  //     }
  //   }
  // };

  // approveNewEvent: TimelineProps['onBackgroundLongPressOut'] = (_timeString, timeObject) => {
  //   const {eventsByDate} = this.state;

  //   Alert.prompt('New Event', 'Enter event title', [
  //     {
  //       text: 'Cancel',
  //       onPress: () => {
  //         if (timeObject.date) {
  //           eventsByDate[timeObject.date] = filter(eventsByDate[timeObject.date], e => e.id !== 'draft');

  //           this.setState({
  //             eventsByDate
  //           });
  //         }
  //       }
  //     },
  //     {
  //       text: 'Create',
  //       onPress: eventTitle => {
  //         if (timeObject.date) {
  //           const draftEvent = find(eventsByDate[timeObject.date], {id: 'draft'});
  //           if (draftEvent) {
  //             draftEvent.id = undefined;
  //             draftEvent.title = eventTitle ?? 'New Event';
  //             draftEvent.color = 'lightgreen';
  //             eventsByDate[timeObject.date] = [...eventsByDate[timeObject.date]];

  //             this.setState({
  //               eventsByDate
  //             });
  //           }
  //         }
  //       }
  //     }
  //   ]);
  // };

  private timelineProps: Partial<TimelineProps> = {
    format24h: true,
    // onBackgroundLongPress: this.createNewEvent,
    // onBackgroundLongPressOut: this.approveNewEvent,
    scrollToFirst: true,
    start: 0,
    end: 24,
    unavailableHours: [
      {start: 0, end: 6},
      {start: 22, end: 24},
    ],
    overlapEventsSpacing: 8,
    rightEdgeSpacing: 24,
    theme: {
      nowIndicatorLine: {
        backgroundColor: '#2FDF84',
      },
      nowIndicatorKnob: {
        backgroundColor: '#2FDF84',
      },
    },
  };

  render() {
    const {currentDate, eventsByDate} = this.state;

    return (
      <CalendarProvider
        date={currentDate}
        onDateChanged={this.onDateChanged}
        onMonthChange={this.onMonthChange}
        showTodayButton
        disabledOpacity={0.6}
      >
        <ExpandableCalendar
          firstDay={1}
          markedDates={this.marked}
          hideArrows={true}
          theme={{
            // event: {
            //   borderColor: '#FAFAFA',
            //   borderWidth: 3,
            //   borderRadius: 10,
            //   backgroundColor: 'white',
            //   padding: 10,
            //   marginBottom: 5,
            //   shadowColor: '#000',
            //   shadowOffset: {width: 0, height: 2},
            //   shadowOpacity: 0.25,
            //   shadowRadius: 3.84,
            //   elevation: 5
            // },
            // eventTitle: {
            //   fontSize: 16,
            //   fontWeight: 'bold'
            // },
            // eventSummary: {
            //   fontSize: 14
            // },
            //
            // timelineContainer: {
            //   backgroundColor: 'green',
            //   color: 'green',
            //   // backgroundColor: '#FAFAFF',
            //   marginTop: 10,
            //   flex: 1
            // },
            // contentStyle: {
            //   backgroundColor: 'green'
            //   // color: 'green',
            // },
            // line: {
            //   backgroundColor: 'green',
            //   color: 'green'
            // },
            // verticalLine: {
            //   backgroundColor: 'green',
            //   color: 'green'
            // },
            // nowIndicatorLine: {
            //   height: 2,
            //   backgroundColor: 'green',
            //   color: 'green'
            // },
            // nowIndicatorKnob: {
            //   backgroundColor: 'green',
            //   color: 'green'
            // },
            todayTextColor: '#27AE60',
            // calendarBackground: 'yellow'
            textSectionTitleColor: '#000000',
            // textSectionTitleDisabledColor: 'yellow',
            dayTextColor: '#4D4D4D',
            selectedDayTextColor: '#FFFFFF',
            // monthTextColor: 'yellow',
            selectedDayBackgroundColor: '#27AE60',
            // arrowColor: 'yellow',
            textDisabledColor: '#C5C5C5',
            // textInactiveColor: 'yellow'
            // backgroundColor: 'yellow'
            dotColor: '#27AE60',
            // selectedDotColor: 'yellow',
            // disabledArrowColor: 'yellow'
            // // textDayFontFamily?: TextStyle['fontFamily'];
            // // textMonthFontFamily?: TextStyle['fontFamily'];
            // // textDayHeaderFontFamily?: TextStyle['fontFamily'];
            // // textDayFontWeight?: TextStyle['fontWeight'];
            // // textMonthFontWeight?: TextStyle['fontWeight'];
            // // textDayHeaderFontWeight?: TextStyle['fontWeight'];
            // // textDayFontSize?: number;
            // // textMonthFontSize?: number;
            // // textDayHeaderFontSize?: number;
            // agendaDayTextColor: 'yellow',
            // agendaDayNumColor: 'yellow',
            // agendaTodayColor: 'yellow',
            // agendaKnobColor: 'yellow',
            // // todayButtonFontFamily?: TextStyle['fontFamily'];
            // // todayButtonFontWeight?: TextStyle['fontWeight'];
            // // todayButtonFontSize?: number;
            // // textDayStyle?: TextStyle;
            // // dotStyle?: object;
            // // arrowStyle?: ViewStyle;
            // todayBackgroundColor: 'yellow',
            // disabledDotColor: 'yellow',
            // inactiveDotColor: 'yellow',
            // todayDotColor: 'yellow',
            // todayButtonTextColor: 'yellow',
            // todayButtonPosition: 'yellow',
            // // arrowHeight?: number;
            // // arrowWidth?: number;
            // // weekVerticalMargin?: number;
            // // stylesheet?: {
            // // calendar?: {
            // // main?: object;
            // // header?: object;
            // // };
            // // day?: {
            // // basic?: object;
            // // period?: object;
            // // };
            // // dot?: object;
            // // marking?: object;
            // // 'calendar-list'?: {
            // // main?: object;
            // // };
            // // agenda?: {
            // // main?: object;
            // // list?: object;
            // // };
            // // expandable?: {
            // // main?: object;
            // // };
            // // };
          }}
          // headerStyle={{backgroundColor: 'pink', marginTop: 0}}
          // calendarStyle={{backgroundColor: 'red', marginTop: 0}}
        />
        <TimelineList
          events={eventsByDate}
          // events={{}}
          timelineProps={this.timelineProps}
          showNowIndicator
          scrollToFirst
          initialTime={INITIAL_TIME}
          // timelineProps={{
          //   theme: {
          //     nowIndicatorLine: {
          //       height: 2,
          //       backgroundColor: 'green',
          //       color: 'green'
          //     },
          //     nowIndicatorKnob: {
          //       backgroundColor: 'green',
          //       color: 'green'
          //     }
          //   }
          // }}
        />
      </CalendarProvider>
    );
  }
}
