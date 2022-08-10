const XDate = require('xdate');
const {isToday, isDateNotInTheRange, sameMonth, parseDate, toMarkingFormat} = require('./dateutils');


export function getState(day: XDate, current: XDate, props: any) {
  const {minDate, maxDate, disabledByDefault, context} = props;
  const _minDate = parseDate(minDate);
  const _maxDate = parseDate(maxDate);
  let state = '';

  if (context?.date === toMarkingFormat(day)) {
    state = 'selected';
  } else if (isToday(day)) {
    state = 'today';
  }
  if (disabledByDefault) {
    state = 'disabled';
  } else if (isDateNotInTheRange(_minDate, _maxDate, day)) {
    state = 'disabled';
  } else if (!sameMonth(new XDate(day), new XDate(current))) {
    state = 'disabled';
  }

  return state;
}
