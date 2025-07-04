import isDate from 'lodash/isDate';
import isNumber from 'lodash/isNumber';
import isString from 'lodash/isString';
import isUndefined from 'lodash/isUndefined';

import {getLocale, padNumber, parseDate, toMarkingFormat} from '../dateutils';

export function getCalendarDateString(date?: Date | string | number) {
  if (!isUndefined(date)) {
    if (isDate(date) && !isNaN(date.getFullYear())) {
      return date.getFullYear() + '-' + padNumber(date.getMonth() + 1) + '-' + padNumber(date.getDate());
    } else if (isString(date) || isNumber(date)) {
      return toMarkingFormat(parseDate(date));
    }
    throw 'Invalid Date';
  }
}

export function getDefaultLocale(): any {
  return getLocale();
}

export default {
  getCalendarDateString,
  getDefaultLocale
};
