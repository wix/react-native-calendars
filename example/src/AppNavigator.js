import { StackNavigator } from 'react-navigation';

import {
  MenuScreen,
  CalendarScreen,
  AgendaScreen,
  CalendarsListScreen,
} from './screens';

const routes = {
  Menu: {
    screen: MenuScreen,
    navigationOptions: () => ({
      headerMode: 'screen',
      title: 'Menu',
    }),
  },
  Calendars: {
    screen: CalendarScreen,
    navigationOptions: () => ({
      headerMode: 'screen',
      title: 'Calendars',
    }),
  },
  Agenda: {
    screen: AgendaScreen,
    navigationOptions: () => ({
      headerMode: 'screen',
      title: 'Agenda',
    }),
  },
  CalendarsList: {
    screen: CalendarsListScreen,
    navigationOptions: () => ({
      headerMode: 'screen',
      title: 'Calendar List',
    }),
  },
};

const AppNavigator = StackNavigator(routes, {
  initialRouteName: 'Menu',
});

export default AppNavigator;
