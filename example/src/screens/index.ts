import {Navigation} from 'react-native-navigation';

import MenuScreen from './menu';
import CalendarsScreen from './calendars';
import AgendaScreen from './agenda';
import CalendarListScreen from './calendarListScreen';
import NewCalendarListScreen from './newCalendarListScreen';
import ExpandableCalendar from './expandableCalendar';
import TimelineCalendar from './timelineCalendar';

export function registerScreens() {
  Navigation.registerComponent('Menu', () => MenuScreen);
  Navigation.registerComponent('Calendars', () => CalendarsScreen);
  Navigation.registerComponent('Agenda', () => AgendaScreen);
  Navigation.registerComponent('CalendarListScreen', () => CalendarListScreen);
  Navigation.registerComponent('NewCalendarList', () => NewCalendarListScreen);
  Navigation.registerComponent('ExpandableCalendar', () => ExpandableCalendar);
  Navigation.registerComponent('TimelineCalendar', () => TimelineCalendar);
}
