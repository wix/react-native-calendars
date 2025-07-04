import {CustomDate, getDay, isDateNotInRange, isToday, sameMonth, toMarkingFormat} from './dateutils';

export function getState(day: CustomDate, current: CustomDate, props: any, disableDaySelection: boolean) {
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
  } else if (!sameMonth(day, current)) {
    state = 'disabled';
  } else if (disabledByWeekDays && disabledByWeekDays.indexOf(getDay(day)) !== -1) {
    state = 'disabled';
  }

  return state;
}
