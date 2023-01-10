import XDate from 'xdate';
import {toMarkingFormat} from './interface';

const latinNumbersPattern = /[0-9]/g;

function isValidXDate(date: unknown): boolean {
  return !!date && (date instanceof XDate);
}

export function sameMonth(a?: XDate, b?: XDate): boolean {
  if (!isValidXDate(a) || !isValidXDate(b)) {
    return false;
  } else {
    return a?.getFullYear() === b?.getFullYear() && a?.getMonth() === b?.getMonth();
  }
}

export function sameDate(a?: XDate, b?: XDate): boolean {
  if (!isValidXDate(a) || !isValidXDate(b)) {
    return false;
  } else {
    return a?.getFullYear() === b?.getFullYear() && a?.getMonth() === b?.getMonth() && a?.getDate() === b?.getDate();
  }
}

export function onSameDateRange({
  firstDay,
  secondDay,
  numberOfDays,
  firstDateInRange,
}: {
  firstDay: string;
  secondDay: string;
  numberOfDays: number;
  firstDateInRange: string;
}): boolean {
  const aDate = new XDate(firstDay);
  const bDate = new XDate(secondDay);
  const firstDayDate = new XDate(firstDateInRange);
  const aDiff = aDate.getTime() - firstDayDate.getTime();
  const bDiff = bDate.getTime() - firstDayDate.getTime();
  const aTotalDays = Math.ceil(aDiff / (1000 * 3600 * 24));
  const bTotalDays = Math.ceil(bDiff / (1000 * 3600 * 24));
  const aWeek = Math.floor(aTotalDays / numberOfDays);
  const bWeek = Math.floor(bTotalDays / numberOfDays);
  return aWeek === bWeek;
}

export function sameWeek(a: string, b: string, firstDayOfWeek: number): boolean {
  const weekDates = getWeekDates(a, firstDayOfWeek, 'yyyy-MM-dd') as string[];
  return weekDates?.includes(b) ?? false;
}

export function isPastDate(date: string): boolean {
  const today = new XDate();
  const d = new XDate(date);

  if (today.getFullYear() > d.getFullYear()) {
    return true;
  }
  if (today.getFullYear() === d.getFullYear()) {
    if (today.getMonth() > d.getMonth()) {
      return true;
    }
    if (today.getMonth() === d.getMonth()) {
      if (today.getDate() > d.getDate()) {
        return true;
      }
    }
  }
  return false;
}

export function isToday(date?: XDate | string): boolean {
  if (!date) return false;
  const d = date instanceof XDate ? date : new XDate(date);
  return sameDate(d, XDate.today());
}

export function isGTE(a: XDate, b: XDate): boolean {
  return b.diffDays(a) > -1;
}

export function isLTE(a: XDate, b: XDate): boolean {
  return a.diffDays(b) > -1;
}

export function formatNumbers(date: number | XDate | string | undefined): string {
  if (!date) return '';
  const numbers = getLocale().numbers;
  return numbers ? date.toString().replace(latinNumbersPattern, (char: string) => numbers[+char]) : date.toString();
}

function fromTo(a: XDate, b: XDate): XDate[] {
  const days: XDate[] = [];
  let from = +a;
  const to = +b;

  for (; from <= to; from = new XDate(from, true).addDays(1).getTime()) {
    days.push(new XDate(from, true));
  }
  return days;
}

export function month(date: XDate): XDate[] { // exported for tests only
  const year = date.getFullYear(),
    month = date.getMonth();
  const days = new XDate(year, month + 1, 0).getDate();

  const firstDay: XDate = new XDate(year, month, 1, 0, 0, 0, 0, /*utcmode*/true);
  const lastDay: XDate = new XDate(year, month, days, 0, 0, 0, 0, /*utcmode*/true);

  return fromTo(firstDay, lastDay);
}

export function weekDayNames(firstDayOfWeek = 0): string[] {
  let dayNamesShort = getLocale().dayNamesShort;
  if (!dayNamesShort) return [];

  const dayShift = firstDayOfWeek % 7;
  if (dayShift) {
    dayNamesShort = dayNamesShort.slice(dayShift).concat(dayNamesShort.slice(0, dayShift));
  }
  return dayNamesShort;
}

export function page(date: XDate, firstDayOfWeek = 0, showSixWeeks = false): XDate[] {
  const days = month(date);
  let before: XDate[] = [];
  let after: XDate[] = [];

  const fdow = (7 + firstDayOfWeek) % 7 || 7;
  const ldow = (fdow + 6) % 7;

  firstDayOfWeek = firstDayOfWeek || 0;

  const from = days[0].clone();
  const daysBefore = from.getDay();

  if (from.getDay() !== fdow) {
    from.addDays(-(from.getDay() + 7 - fdow) % 7);
  }

  const to = days[days.length - 1].clone();
  const day = to.getDay();
  if (day !== ldow) {
    to.addDays((ldow + 7 - day) % 7);
  }

  const daysForSixWeeks = (daysBefore + days.length) / 6 >= 6;

  if (showSixWeeks && !daysForSixWeeks) {
    to.addDays(7);
  }

  if (isLTE(from, days[0])) {
    before = fromTo(from, days[0]);
  }

  if (isGTE(to, days[days.length - 1])) {
    after = fromTo(days[days.length - 1], to);
  }

  return before.concat(days.slice(1, days.length - 1), after);
}

export function isDateNotInRange(date: XDate, minDate: string, maxDate: string): boolean {
  return (!!minDate && !isGTE(date, new XDate(minDate))) || (!!maxDate && !isLTE(date, new XDate(maxDate)));
}

export function getWeekDates(date: string, firstDay = 0, format?: string): XDate[] | string[] | undefined {
  const d: XDate = new XDate(date);
  if (date && d.valid()) {
    const daysArray = [d];
    let dayOfTheWeek = d.getDay() - firstDay;
    if (dayOfTheWeek < 0) {
      // to handle firstDay > 0
      dayOfTheWeek = 7 + dayOfTheWeek;
    }

    let newDate = d;
    let index = dayOfTheWeek - 1;
    while (index >= 0) {
      newDate = newDate.clone().addDays(-1);
      daysArray.unshift(newDate);
      index -= 1;
    }

    newDate = d;
    index = dayOfTheWeek + 1;
    while (index < 7) {
      newDate = newDate.clone().addDays(1);
      daysArray.push(newDate);
      index += 1;
    }

    if (format) {
      return daysArray.map(d => d.toString(format));
    }

    return daysArray;
  }
}

export function getPartialWeekDates(date?: string, numberOfDays = 7): string[] {
  let index = 0;
  const partialWeek: string[] = [];
  while (index < numberOfDays) {
    partialWeek.push(generateDay(date || new XDate(), index));
    index++;
  }
  return partialWeek;
}

export function generateDay(originDate: string | XDate, daysOffset = 0): string {
  const baseDate = originDate instanceof XDate ? originDate : new XDate(originDate);
  return toMarkingFormat(baseDate.clone().addDays(daysOffset));
}

/**
 * Copied directly from XDate's locale_detail interface.
 */
interface xdate_locale_detail
{
    monthNames? : string [] | undefined;
    monthNamesShort?: string [] | undefined;
    dayNames?: string[] | undefined;
    dayNamesShort?: string [] | undefined;
    amDesignator?: string | undefined;
    pmDesignator?: string | undefined;
}

export interface LocaleDetail extends xdate_locale_detail {
  today?: string;
  numbers?: string[];
  formatAccessibilityLabel?: string;
}

export function getLocale(): LocaleDetail {
  return XDate.locales[XDate.defaultLocale] as LocaleDetail;
}
