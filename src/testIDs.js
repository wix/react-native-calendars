const PREFIX = 'native.calendar';

module.exports = {
  CHANGE_MONTH_LEFT_ARROW: `${PREFIX}.CHANGE_MONTH_LEFT_ARROW`,
  CHANGE_MONTH_RIGHT_ARROW: `${PREFIX}.CHANGE_MONTH_RIGHT_ARROW`,
  SELECT_DATE_SLOT: `${PREFIX}.SELECT_DATE_SLOT`,
  CALENDAR_KNOB: `${PREFIX}.CALENDAR_KNOB`,
  STATIC_HEADER: 'STATIC_HEADER',
  AGENDA_CALENDAR_KNOB: `${PREFIX}.AGENDA_CALENDAR_KNOB`,
  AGENDA_CALENDAR_ITEM: `${PREFIX}.AGENDA_CALENDAR_ITEM`,
  HEADER_MONTH_NAME: 'HEADER_MONTH_NAME',
  RESERVATION_DATE: `${PREFIX}.RESERVATION_DATE`,

  menu: {
    CONTAINER: 'menu',
    CALENDARS: 'calendars_btn',
    CALENDAR_LIST: 'calendar_list_btn',
    HORIZONTAL_LIST: 'horizontal_list_btn',
    AGENDA: 'agenda_btn',
    EXPANDABLE_CALENDAR: 'expandable_calendar_btn',
    WEEK_CALENDAR: 'week_calendar_btn'
  },
  calendars: {
    CONTAINER: 'calendars',
    FIRST: 'first_calendar',
    LAST: 'last_calendar'
  },
  calendarList: {CONTAINER: 'calendarList'},
  horizontalList: {CONTAINER: 'horizontalList'},
  agenda: {
    CONTAINER: 'agenda',
    ITEM: 'item'
  },
  expandableCalendar: {CONTAINER: 'expandableCalendar'},
  weekCalendar: {CONTAINER: 'weekCalendar'}
};
