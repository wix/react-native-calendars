import {getLocale, toMarkingFormat} from '../dateutils';

export function getCalendarDateString(date?: Date | string | number) {
  if (!date) {
    return undefined;
  }
  return toMarkingFormat(date);
}

export function getDefaultLocale() {
  return getLocale();
}

export default {
  getCalendarDateString,
  getDefaultLocale
};
