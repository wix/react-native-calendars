import {isToday, isDateNotInTheRange, sameMonth} from './dateutils';
import {parseDate, toMarkingFormat} from './interface';

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
  }

  return state;
}

module.exports = {
  getState
};
