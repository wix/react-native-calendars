export const todayString = 'today';

export enum UpdateSources {
  CALENDAR_INIT = 'calendarInit',
  PROP_UPDATE = 'propUpdate',
  TODAY_PRESS = 'todayPress',
  DAY_PRESS = 'dayPress',
  ARROW_PRESS = 'arrowPress',
  WEEK_ARROW_PRESS = 'weekArrowPress',
  LIST_DRAG = 'listDrag',
  PAGE_SCROLL = 'pageScroll',
  WEEK_SCROLL = 'weekScroll'
}

export enum CalendarNavigationTypes {
  AGENDA_SCROLL = UpdateSources.LIST_DRAG,
  MONTH_SCROLL = UpdateSources.PAGE_SCROLL,
  WEEK_SCROLL = UpdateSources.WEEK_SCROLL,
  MONTH_ARROWS = UpdateSources.ARROW_PRESS,
  WEEK_ARROWS = UpdateSources.WEEK_ARROW_PRESS,
  TODAY_PRESS = UpdateSources.TODAY_PRESS
}
