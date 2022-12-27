import {ViewStyle, TextStyle} from 'react-native';
import {MarkingProps} from './calendar/day/marking';
import {CalendarContextProps} from './expandableCalendar/Context';

export type ContextProp = {
  context?: CalendarContextProps;
}
export type MarkingTypes = 'dot' | 'multi-dot' | 'period' | 'multi-period' | 'custom';
export type MarkedDates = {
  [key: string]: MarkingProps;
};
export type DayState = 'selected' | 'disabled' | 'inactive' | 'today' | '';
export type Direction = 'left' | 'right';
export type DateData = {
  year: number;
  month: number;
  day: number;
  timestamp: number;
  dateString: string;
};
export interface Theme {
  timelineContainer?: object;
  contentStyle?: ViewStyle;
  event?: object;
  eventTitle?: object;
  eventSummary?: object;
  eventTimes?: object;
  line?: object;
  verticalLine?: object;
  nowIndicatorLine?: object;
  nowIndicatorKnob?: object;
  timeLabel?: object;
  todayTextColor?: string;
  calendarBackground?: string;
  indicatorColor?: string;
  textSectionTitleColor?: string;
  textSectionTitleDisabledColor?: string;
  dayTextColor?: string;
  selectedDayTextColor?: string;
  monthTextColor?: string;
  selectedDayBackgroundColor?: string;
  arrowColor?: string;
  textDisabledColor?: string;
  textInactiveColor?: string;
  backgroundColor?: string; //TODO: remove in V2
  dotColor?: string;
  selectedDotColor?: string;
  disabledArrowColor?: string;
  textDayFontFamily?: TextStyle['fontFamily'];
  textMonthFontFamily?: TextStyle['fontFamily'];
  textDayHeaderFontFamily?: TextStyle['fontFamily'];
  textDayFontWeight?: TextStyle['fontWeight'];
  textMonthFontWeight?: TextStyle['fontWeight'];
  textDayHeaderFontWeight?: TextStyle['fontWeight'];
  textDayFontSize?: number;
  textMonthFontSize?: number;
  textDayHeaderFontSize?: number;
  agendaDayTextColor?: string;
  agendaDayNumColor?: string;
  agendaTodayColor?: string;
  agendaKnobColor?: string;
  todayButtonFontFamily?: TextStyle['fontFamily'];
  todayButtonFontWeight?: TextStyle['fontWeight'];
  todayButtonFontSize?: number;
  textDayStyle?: TextStyle;
  dotStyle?: object;
  arrowStyle?: ViewStyle;
  todayBackgroundColor?: string;
  disabledDotColor?: string;
  inactiveDotColor?: string;
  todayDotColor?: string;
  todayButtonTextColor?: string;
  todayButtonPosition?: string;
  arrowHeight?: number;
  arrowWidth?: number;
  weekVerticalMargin?: number;
  stylesheet?: {
    calendar?: {
      main?: object; 
      header?: object;
    };
    day?: {
      basic?: object; 
      period?: object;
    };
    dot?: object;
    marking?: object;
    'calendar-list'?: {
      main?: object;
    };
    agenda?: {
      main?: object; 
      list?: object;
    };
    expandable?: {
      main?: object;
    };
  };
}

export type AgendaEntry = {
  name: string;
  height: number;
  day: string;
}

export type AgendaSchedule = {
  [date: string]: AgendaEntry[];
}

export interface DayAgenda {
  reservation?: AgendaEntry;
  date?: XDate;
}