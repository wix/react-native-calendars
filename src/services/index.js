import isUndefined from 'lodash/isUndefined';
import isDate from 'lodash/isDate';
import isString from 'lodash/isString';
import isNumber from 'lodash/isNumber';
import XDate from 'xdate';
const { getLocale } = require('../dateutils');
const { padNumber, toMarkingFormat } = require('../interface');
export function getCalendarDateString(date) {
    if (!isUndefined(date)) {
        if (isDate(date) && !isNaN(date.getFullYear())) {
            return date.getFullYear() + '-' + padNumber(date.getMonth() + 1) + '-' + padNumber(date.getDate());
        }
        else if (isString(date)) {
            // issue with strings and XDate's utc-mode - returns one day before
            return toMarkingFormat(new XDate(date, false));
        }
        else if (isNumber(date)) {
            return toMarkingFormat(new XDate(date, true));
        }
        throw 'Invalid Date';
    }
}
export function getDefaultLocale() {
    return getLocale();
}
export default {
    getCalendarDateString,
    getDefaultLocale
};
