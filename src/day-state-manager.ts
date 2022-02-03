import {isToday, isDateNotInTheRange, sameMonth} from './dateutils';
import {parseDate, toMarkingFormat} from './interface';


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
  } else if (!sameMonth(day, current)) {
    state = 'disabled';
  }

  return state;
}
<<<<<<< HEAD:src/day-state-manager.js

module.exports = {
  getState
};
=======
>>>>>>> 115f18741ed6f1e9a22d7ebe2115e091b3d204ca:src/day-state-manager.ts
