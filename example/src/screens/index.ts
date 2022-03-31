import {Navigation} from 'react-native-navigation';

import MenuScreen from './menuScreen';
import CalendarsScreen from './calendarScreen';
import AgendaScreen from './agendaScreen';
import CalendarListScreen from './calendarListScreen';
import HorizontalCalendarListScreen from './horizontalCalendarListScreen';
import NewCalendarListScreen from './newCalendarListScreen';
import ExpandableCalendar from './expandableCalendar';
import TimelineCalendar from './timelineCalendarScreen';

export function registerScreens() {
  Navigation.registerComponent('Menu', () => MenuScreen);
  Navigation.registerComponent('Calendars', () => CalendarsScreen);
  Navigation.registerComponent('Agenda', () => AgendaScreen);
  Navigation.registerComponent('CalendarListScreen', () => CalendarListScreen);
  Navigation.registerComponent('HorizontalCalendarListScreen', () => HorizontalCalendarListScreen);
  Navigation.registerComponent('NewCalendarList', () => NewCalendarListScreen);
  Navigation.registerComponent('ExpandableCalendar', () => ExpandableCalendar);
  Navigation.registerComponent('TimelineCalendar', () => TimelineCalendar);
}
