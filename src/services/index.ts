import {isString, isUndefined} from 'lodash';
import XDate from 'xdate';
const {parseDate, toMarkingFormat} = require('../interface');

export function getCalendarDateString(date?: any) {
  if (!isUndefined(date)) {
    let d = date;
    if (isString(date)) {
      // NOTE: dealing with strings here since parseDate() returns a date with 'utc-mode = true' for this case, which returns the day before
      d = new XDate(date, false);
    } else {
      d = parseDate(date);
    }
    return toMarkingFormat(d);
  }
}
