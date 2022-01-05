import React, {Component} from 'react';
import {Alert} from 'react-native';
import {
  ExpandableCalendar,
  TimelineEventProps,
  TimelineList,
  CalendarProvider,
  TimelineProps,
  CalendarUtils
} from 'react-native-calendars';
import _ from 'lodash';

const EVENTS: TimelineEventProps[] = [
  {
    start: '2017-09-06 01:30:00',
    end: '2017-09-06 02:30:00',
    title: 'Dr. Mariana Joseph',
    summary: '3412 Piedmont Rd NE, GA 3032',
    color: '#e6add8'
  },
  {
    start: '2017-09-07 00:30:00',
    end: '2017-09-07 01:30:00',
    title: 'Visit Grand Mother',
    summary: 'Visit Grand Mother and bring some fruits.',
    color: '#ade6d8'
  },
  {
    start: '2017-09-07 02:30:00',
    end: '2017-09-07 03:20:00',
    title: 'Meeting with Prof. Behjet Zuhaira',
    summary: 'Meeting with Prof. Behjet at 130 in her office.',
    color: '#e6add8'
  },
  {
    start: '2017-09-07 04:10:00',
    end: '2017-09-07 04:40:00',
    title: 'Tea Time with Dr. Hasan',
    summary: 'Tea Time with Dr. Hasan, Talk about Project'
  },
  {
    start: '2017-09-07 01:05:00',
    end: '2017-09-07 01:35:00',
    title: 'Dr. Mariana Joseph',
    summary: '3412 Piedmont Rd NE, GA 3032'
  },
  {
    start: '2017-09-07 14:30:00',
    end: '2017-09-07 16:30:00',
    title: 'Meeting Some Friends in ARMED',
    summary: 'Arsalan, Hasnaat, Talha, Waleed, Bilal',
    color: '#d8ade6'
  },
  {
    start: '2017-09-08 01:40:00',
    end: '2017-09-08 02:25:00',
    title: 'Meet Sir Khurram Iqbal',
    summary: 'Computer Science Dept. Comsats Islamabad',
    color: '#e6bcad'
  },
  {
    start: '2017-09-08 04:10:00',
    end: '2017-09-08 04:40:00',
    title: 'Tea Time with Colleagues',
    summary: 'WeRplay'
  },
  {
    start: '2017-09-08 00:45:00',
    end: '2017-09-08 01:45:00',
    title: 'Lets Play Apex Legends',
    summary: 'with Boys at Work'
  },
  {
    start: '2017-09-08 11:30:00',
    end: '2017-09-08 12:30:00',
    title: 'Dr. Mariana Joseph',
    summary: '3412 Piedmont Rd NE, GA 3032'
  },
  {
    start: '2017-09-10 12:10:00',
    end: '2017-09-10 13:45:00',
    title: 'Merge Request to React Native Calendars',
    summary: 'Merge Timeline Calendar to React Native Calendars'
  }
];

export default class TimelineCalendarScreen extends Component {
  state = {
    currentDate: '2017-09-10',
    events: EVENTS,
    eventsByDate: _.groupBy(EVENTS, e => CalendarUtils.getCalendarDateString(e.start)) as {
      [key: string]: TimelineEventProps[];
    }
  };

  marked = {
    '2017-09-06': {marked: true},
    '2017-09-07': {marked: true},
    '2017-09-08': {marked: true},
    '2017-09-10': {marked: true}
  };

  onDateChanged = (date: string) => {
    // console.warn('TimelineCalendarScreen onDateChanged: ', date, updateSource);
    // fetch and set data for date + week ahead
    this.setState({currentDate: date});
  };

  onMonthChange = (/* month, updateSource */) => {
    // console.warn('TimelineCalendarScreen onMonthChange: ', month, updateSource);
  };

  createNewEvent: TimelineProps['onBackgroundLongPress'] = (timeString, timeObject) => {
    const {eventsByDate} = this.state;
    const hourString = `${(timeObject.hour + 1).toString().padStart(2, '0')}`;
    const minutesString = `${timeObject.minutes.toString().padStart(2, '0')}`;

    const newEvent = {
      id: 'draft',
      start: `${timeString}`,
      end: `${timeObject.date} ${hourString}:${minutesString}:00`,
      title: 'New Event',
      color: '#ffffff'
    };

    if (timeObject.date) {
      if (eventsByDate[timeObject.date]) {
        eventsByDate[timeObject.date] = [...eventsByDate[timeObject.date], newEvent];
        this.setState({eventsByDate});
      } else {
        eventsByDate[timeObject.date] = [newEvent];
        this.setState({eventsByDate: {...eventsByDate}});
      }
    }
  };

  approveNewEvent: TimelineProps['onBackgroundLongPressOut'] = (_timeString, timeObject) => {
    const {eventsByDate} = this.state;

    Alert.prompt('New Event', 'Enter event title', [
      {
        text: 'Cancel',
        onPress: () => {
          if (timeObject.date) {
            eventsByDate[timeObject.date] = _.filter(eventsByDate[timeObject.date], e => e.id !== 'draft');

            this.setState({
              eventsByDate
            });
          }
        }
      },
      {
        text: 'Create',
        onPress: eventTitle => {
          if (timeObject.date) {
            const draftEvent = _.find(eventsByDate[timeObject.date], {id: 'draft'});
            if (draftEvent) {
              draftEvent.id = undefined;
              draftEvent.title = eventTitle ?? 'New Event';
              draftEvent.color = '#d8ade6';
              eventsByDate[timeObject.date] = [...eventsByDate[timeObject.date]];

              this.setState({
                eventsByDate
              });
            }
          }
        }
      }
    ]);
  };

  private timelineProps = {
    format24h: true,
    scrollToFirst: true,
    onBackgroundLongPress: this.createNewEvent,
    onBackgroundLongPressOut: this.approveNewEvent
    // start: 0,
    // end: 24
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
          leftArrowImageSource={require('../img/previous.png')}
          rightArrowImageSource={require('../img/next.png')}
          markedDates={this.marked}
        />
        <TimelineList events={eventsByDate} timelineProps={this.timelineProps} />
      </CalendarProvider>
    );
  }
}
