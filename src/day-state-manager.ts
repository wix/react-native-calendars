const {isToday, isDateNotInRange, sameMonth} = require('./dateutils');

export function getState(day: XDate, current: XDate, props: any) {
  const {minDate, maxDate, disabledByDefault, disabledByWeekDays} = props;
  let state = '';

  if (isToday(day)) {
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
