const {isToday, isDateNotInTheRange, sameMonth, sameDate, isSaturday, isSunday} = require('./dateutils');
const {parseDate, toMarkingFormat} = require('./interface');
import XDate from 'xdate';

function getState(day, current, props) {
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
  } else if (!sameMonth(day, current)) {
    state = 'disabled';
  }else if (sameDate(day, XDate())) {
    state = 'today';
  } else if (isSaturday(day, XDate())) {
    state = 'saturday';
  } else if (isSunday(day, XDate())) {
    state = 'sunday';
  }

  return state;
}

export {getState};
