import {type CalendarsDate, getDayOfWeek, isDateNotInRange, isSameMonth, isToday, toMarkingFormat} from './dateutils';

export function getState(day: CalendarsDate, current: CalendarsDate, props: any, disableDaySelection: boolean) {
  const {minDate, maxDate, disabledByDefault, disabledByWeekDays, context} = props;
  let state;

  if (!disableDaySelection && (context?.selectedDate ?? toMarkingFormat(current)) === toMarkingFormat(day)) {
    state = 'selected';
  } else if (isToday(day)) {
    state = 'today';
  } else if (disabledByDefault) {
    state = 'disabled';
  } else if (isDateNotInRange(day, minDate, maxDate)) {
    state = 'disabled';
  } else if (!isSameMonth(day, current)) {
    state = 'disabled';
  } else if (disabledByWeekDays && disabledByWeekDays.indexOf(getDayOfWeek(day)) !== -1) {
    state = 'disabled';
  }

  return state;
}
