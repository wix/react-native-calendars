import './wdyr'; // <--- must be first import
import React from 'react';
import {AppRegistry} from 'react-native';
// import {createStaticNavigation} from '@react-navigation/native';
// import {createNativeStackNavigator} from '@react-navigation/native-stack';
// import {enableScreens} from 'react-native-screens';
// import {I18nManager} from 'react-native'; // <--- In order to test RTL
//@ts-expect-error
import {LocaleConfig} from 'react-native-calendars';
import {name as appName} from '../app.json';
import MenuScreen from './screens/menuScreen';
// import CalendarScreen from './screens/calendarScreen';
// import CalendarPlaygroundScreen from './screens/calendarPlaygroundScreen';
// import AgendaScreen from './screens/agendaScreen';
// import AgendaInfiniteListScreen from './screens/agendaInfiniteListScreen';
// import CalendarsListScreen from './screens/calendarListScreen';
// import NewCalendarsListScreen from './screens/newCalendarListScreen';
// import ExpandableCalendarScreen from './screens/expandableCalendarScreen';
// import TimelineCalendarScreen from './screens/timelineCalendarScreen';
// import PlaygroundScreen from './screens/playgroundScreen';

AppRegistry.registerComponent(appName, () => App);

// I18nManager.forceRTL(true); // <--- In order to test RTL
// eslint-disable-next-line no-console
console.ignoredYellowBox = ['Remote debugger'];

LocaleConfig.locales['en'] = {
  formatAccessibilityLabel: "dddd d 'of' MMMM 'of' yyyy",
  monthNames: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ],
  monthNamesShort: ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'],
  dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  dayNamesShort: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  // numbers: ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'] // <--- number localization example
};

LocaleConfig.locales['fr'] = {
  monthNames: ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'],
  monthNamesShort: ['Janv.','Févr.','Mars','Avril','Mai','Juin','Juil.','Août','Sept.','Oct.','Nov.','Déc.'],
  dayNames: ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'],
  dayNamesShort: ['Dim.','Lun.','Mar.','Mer.','Jeu.','Ven.','Sam.'],
  today: 'Aujourd\'hui'
};

LocaleConfig.locales['he'] = {
  formatAccessibilityLabel: "dddd d 'of' MMMM 'of' yyyy",
  monthNames: [
    'ינואר',
    'פברואר',
    'מרץ',
    'אפריל',
    'מאי',
    'יוני',
    'יולי',
    'אוגוסט',
    'ספטמבר',
    'אוקטובר',
    'נובמבר',
    'דצמבר'
  ],
  monthNamesShort: ['ינו', 'פבר', 'מרץ', 'אפר', 'מאי', 'יונ', 'יול', 'אוג', 'ספט', 'אוק', 'נוב', 'דצמ'],
  dayNames: ['ראון', 'שני', 'שלישי', 'קביעי', 'חמישי', 'שישי', 'שבת'],
  dayNamesShort: ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש'],
};

LocaleConfig.defaultLocale = 'en';

/** React Navigation */
// enableScreens();

// const RootStack = createNativeStackNavigator({
//   screens: {
//     Home: {
//       screen: MenuScreen
//     },
//     Calendar: CalendarScreen,
//     CalendarPlayground: CalendarPlaygroundScreen,
//     Agenda: AgendaScreen,
//     AgendaInfiniteList: AgendaInfiniteListScreen,
//     CalendarList: CalendarsListScreen,
//     NewCalendarList: NewCalendarsListScreen,
//     ExpandableCalendar: ExpandableCalendarScreen,
//     TimelineCalendar: TimelineCalendarScreen,
//     Playground: PlaygroundScreen
//   },
// });
// const Navigation = createStaticNavigation(RootStack);
export default function App() {
  // return <Navigation/>;
  return <MenuScreen/>
}
