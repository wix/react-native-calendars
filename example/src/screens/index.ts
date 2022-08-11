import {Navigation} from 'react-native-navigation';

import MenuScreen from './menuScreen';
import CalendarScreen from './calendarScreen';
import CalendarPlaygroundScreen from './calendarPlaygroundScreen';
import AgendaScreen from './agendaScreen';
import CalendarsListScreen from './calendarListScreen';
import NewCalendarsListScreen from './newCalendarListScreen';
import ExpandableCalendarScreen from './expandableCalendarScreen';
import TimelineCalendarScreen from './timelineCalendarScreen';
import PlaygroundScreen from './playgroundScreen';


export function registerScreens() {
  Navigation.registerComponent('Menu', () => MenuScreen);
  Navigation.registerComponent('CalendarScreen', () => CalendarScreen);
  Navigation.registerComponent('CalendarPlaygroundScreen', () => CalendarPlaygroundScreen);
  Navigation.registerComponent('AgendaScreen', () => AgendaScreen);
  Navigation.registerComponent('CalendarListScreen', () => CalendarsListScreen);
  Navigation.registerComponent('NewCalendarListScreen', () => NewCalendarsListScreen);
  Navigation.registerComponent('ExpandableCalendarScreen', () => ExpandableCalendarScreen);
  Navigation.registerComponent('TimelineCalendarScreen', () => TimelineCalendarScreen);
  Navigation.registerComponent('Playground', () => PlaygroundScreen);
}
