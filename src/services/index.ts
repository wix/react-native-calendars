import {isUndefined, isDate, isString, isNumber} from 'lodash';
import XDate from 'xdate';
const {padNumber, toMarkingFormat} = require('../interface');

export function getCalendarDateString(date?: Date | string | number) {
  if (!isUndefined(date)) {
    if (isDate(date) && !isNaN(date.getFullYear())) {
      return date.getFullYear() + '-' + padNumber(date.getMonth() + 1) + '-' + padNumber(date.getDate());
    } else if (isString(date)) {
      // issue with strings and XDate's utc-mode - returns one day before
      return toMarkingFormat(new XDate(date, false));
    } else if (isNumber(date)) {
      return toMarkingFormat(new XDate(date, true));
    }
    throw 'Invalid Date';
  }
}

export function getDefaultLocale(): any {
  return XDate.locales[XDate.defaultLocale];
}

export default {
  getCalendarDateString,
  getDefaultLocale
};
