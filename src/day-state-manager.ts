import {isToday, isDateNotInRange, sameMonth} from './dateutils';
import {toMarkingFormat} from './interface';


export function getState(day: XDate, current: XDate, props: any, disableDaySelection?: boolean) {
  const {minDate, maxDate, disabledByDefault, disabledByWeekDays, context} = props;
  let state = '';

  if (!disableDaySelection && ((context?.date ?? toMarkingFormat(current)) === toMarkingFormat(day))) {
    state = 'selected';
  } else if (isToday(day)) {
    state = 'today';
  } else if (disabledByDefault) {
    state = 'disabled';
  } else if (isDateNotInRange(day, minDate, maxDate)) {
    state = 'disabled';
  } else if (!sameMonth(day, current)) {
    state = 'disabled';
  } else if (disabledByWeekDays && disabledByWeekDays.indexOf(day.getDay()) !== -1) {
    state = 'disabled';
  }

  return state;
}
