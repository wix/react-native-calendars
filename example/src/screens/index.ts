import {Navigation} from 'react-native-navigation';

import MenuScreen from './menuScreen';
import CalendarScreen from './calendarScreen';
import AgendaScreen from './agendaScreen';
import CalendarsListScreen from './calendarListScreen';
import HorizontalCalendarListScreen from './horizontalCalendarListScreen';
import NewCalendarsListScreen from './newCalendarListScreen';
import ExpandableCalendarScreen from './expandableCalendarScreen';
import TimelineCalendarScreen from './timelineCalendarScreen';

export function registerScreens() {
  Navigation.registerComponent('Menu', () => MenuScreen);
  Navigation.registerComponent('CalendarScreen', () => CalendarScreen);
  Navigation.registerComponent('AgendaScreen', () => AgendaScreen);
  Navigation.registerComponent('CalendarListScreen', () => CalendarsListScreen);
  Navigation.registerComponent('HorizontalCalendarListScreen', () => HorizontalCalendarListScreen);
  Navigation.registerComponent('NewCalendarListScreen', () => NewCalendarsListScreen);
  Navigation.registerComponent('ExpandableCalendarScreen', () => ExpandableCalendarScreen);
  Navigation.registerComponent('TimelineCalendarScreen', () => TimelineCalendarScreen);
}
