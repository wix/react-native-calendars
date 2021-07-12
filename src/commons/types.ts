import {ColorValue} from 'react-native';
export interface Theme {
  container?: object;
  contentStyle?: object;
  header?: object;
  headerText?: object;
  arrowButton?: object;
  event?: object;
  eventTitle?: object;
  eventSummary?: object;
  eventTimes?: object;
  line?: object;
  lineNow?: object;
  timeLabel?: object;
  todayTextColor?: string;
  calendarBackground?: string;
  indicatorColor?: ColorValue;
  stylesheet?: {
    calendar?: {header?: object};
    day?: {basic?: object; period?: object};
    dot?: object;
    marking?: object;
    'calendar-list'?: {main?: object};
  };
}
