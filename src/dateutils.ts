import dayjs, {type Dayjs} from 'dayjs';
import customParseFormatPlugin from 'dayjs/plugin/customParseFormat';
import isSameOrAfterPlugin from 'dayjs/plugin/isSameOrAfter';
import isSameOrBeforePlugin from 'dayjs/plugin/isSameOrBefore';
import isTodayPlugin from 'dayjs/plugin/isToday';
import localeDataPlugin from 'dayjs/plugin/localeData';
import localizedFormatPlugin from 'dayjs/plugin/localizedFormat';
import objectSupportPlugin from 'dayjs/plugin/objectSupport';
import timezonePlugin from 'dayjs/plugin/timezone';
import updateLocalePlugin from 'dayjs/plugin/updateLocale';
import utcPlugin from 'dayjs/plugin/utc';
import weekdayPlugin from 'dayjs/plugin/weekday';
import weekOfYearPlugin from 'dayjs/plugin/weekOfYear';

dayjs.extend(customParseFormatPlugin);
dayjs.extend(isSameOrAfterPlugin);
dayjs.extend(isSameOrBeforePlugin);
dayjs.extend(isTodayPlugin);
dayjs.extend(localeDataPlugin);
dayjs.extend(localizedFormatPlugin);
dayjs.extend(weekOfYearPlugin);
dayjs.extend(utcPlugin);
dayjs.extend(timezonePlugin);
dayjs.extend(objectSupportPlugin);
dayjs.extend(updateLocalePlugin);
dayjs.extend(weekdayPlugin);

export type CalendarsDate = Dayjs | Date | string | number;

export type DateToData = {
  year: number;
  month: number;
  day: number;
  timestamp: number;
  dateString: string;
};

export const LocaleConfig: {
  defaultLocale: string;
  locales: Record<string, any>;
} = setupLocale();

function setupLocale() {
  const defaultLocale = LocaleConfig?.defaultLocale || 'en';
  require(`dayjs/locale/${defaultLocale}`);
  return {
    locales: {
      [defaultLocale]: {
        monthNames: dayjs.months(),
        monthNamesShort: dayjs.monthsShort(),
        dayNames: dayjs.weekdays(),
        dayNamesShort: dayjs.weekdaysShort(),
        today: 'Today',
        numbers: [],
        formatAccessibilityLabel: 'dddd D MMMM YYYY'
      }
    },
    defaultLocale: dayjs.locale(defaultLocale)
  };
}

export function isValidDate(date) {
  if (!date) {
    return false;
  }
  return dayjs(date).isValid();
}

export function sameMonth(a?: CalendarsDate, b?: CalendarsDate) {
  if (!isValidDate(a) || !isValidDate(b)) {
    return false;
  }
  return dayjs(a)?.isSame(dayjs(b), 'year') && dayjs(a)?.isSame(dayjs(b), 'month');
}

export function sameDate(a?: CalendarsDate, b?: CalendarsDate) {
  if (!isValidDate(a) || !isValidDate(b)) {
    return false;
  }
  return dayjs(a)?.isSame(dayjs(b), 'date');
}

export function onSameDateRange({
  firstDay,
  secondDay,
  numberOfDays,
  firstDateInRange
}: {
  firstDay: string;
  secondDay: string;
  numberOfDays: number;
  firstDateInRange: string;
}) {
  const aDate = getDate(firstDay);
  const bDate = getDate(secondDay);
  const firstDayDate = getDate(firstDateInRange);
  const firstDayDateMs = getDateInMs(firstDayDate);
  const aDiff = getDateInMs(aDate) - firstDayDateMs;
  const bDiff = getDateInMs(bDate) - firstDayDateMs;
  const aTotalDays = Math.ceil(aDiff / (1000 * 3600 * 24));
  const bTotalDays = Math.ceil(bDiff / (1000 * 3600 * 24));
  const aWeek = Math.floor(aTotalDays / numberOfDays);
  const bWeek = Math.floor(bTotalDays / numberOfDays);
  return aWeek === bWeek;
}

export function sameWeek(a: string, b: string, firstDayOfWeek: number) {
  const format = 'YYYY-MM-DD';
  const weekDates = getWeekDates(a, firstDayOfWeek, format);
  return weekDates?.includes(formatDate(getDate(b), format) as string);
}

export function isPastDate(date: string) {
  return dayjs(date).isBefore(getCurrentDate(), 'date');
}

export function isToday(date) {
  return dayjs(date).isToday();
}

export function isGTE(a: CalendarsDate, b: CalendarsDate) {
  if (!isValidDate(a) || !isValidDate(b)) {
    return false;
  }
  return dayjs(a).isSameOrAfter(dayjs(b), 'day');
}

export function isLTE(a: CalendarsDate, b: CalendarsDate) {
  if (!isValidDate(a) || !isValidDate(b)) {
    return false;
  }
  return dayjs(a).isSameOrBefore(dayjs(b), 'day');
}

export function formatNumbers(date: CalendarsDate) {
  const latinNumbersPattern = /[0-9]/g;
  const numbers = getLocale()?.numbers;
  return Array.isArray(numbers) && numbers.length > 0
    ? date.toString().replace(latinNumbersPattern, char => numbers[+char])
    : date;
}

function fromTo(a: CalendarsDate, b: CalendarsDate) {
  const days: CalendarsDate[] = [];
  let from = getDateInMs(a);
  const to = getDateInMs(b);

  for (; from <= to; from = getDateInMs(addDaysToDate(from, 1), true)) {
    days.push(getDate(from, true));
  }
  return days;
}

export function month(date: CalendarsDate) {
  // exported for tests only
  const year = getYear(date);
  const month = getMonth(date);
  const totalDays = getTotalDaysInMonth(date);
  const firstDay = buildDate(year, month, 1, true);
  const lastDay = buildDate(year, month, totalDays, true);
  return fromTo(firstDay, lastDay);
}

export function weekDayNames(firstDayOfWeek = 0) {
  const weekDaysNames = weekDaysShort();
  const dayShift = firstDayOfWeek % 7;
  if (dayShift) {
    return weekDaysNames.slice(dayShift).concat(weekDaysNames.slice(0, dayShift));
  }
  return weekDaysNames;
}

export function page(date: CalendarsDate, firstDayOfWeek = 0, showSixWeeks = false) {
  const days = month(date);
  let before: CalendarsDate[] = [];
  let after: CalendarsDate[] = [];

  firstDayOfWeek = firstDayOfWeek || 0;

  const fdow = (7 + firstDayOfWeek) % 7 || 7;
  const ldow = (fdow + 6) % 7;

  let from = days[0];
  const daysBefore = getDayOfWeek(from);

  if (daysBefore !== fdow) {
    from = addDaysToDate(from, -(daysBefore + 7 - fdow) % 7);
  }

  let to = getDate(days[days.length - 1]);
  const day = getDayOfWeek(to);
  if (day !== ldow) {
    to = addDaysToDate(to, (ldow + 7 - day) % 7);
  }

  const daysForSixWeeks = (daysBefore + days.length) / 6 >= 6;
  if (showSixWeeks && !daysForSixWeeks) {
    to = addDaysToDate(to, 7);
  }

  const firstDate = days[0];
  if (isLTE(from, firstDate)) {
    before = fromTo(from, firstDate);
  }

  const lastDate = days[days.length - 1];
  if (isGTE(to, lastDate)) {
    after = fromTo(lastDate, to);
  }

  const slicedDays = days.slice(1, days.length - 1);
  return before.concat(slicedDays, after);
}

export function isDateNotInRange(date: CalendarsDate, minDate: string, maxDate: string) {
  return (minDate && !isGTE(date, getDate(minDate))) || (maxDate && !isLTE(date, getDate(maxDate)));
}

export function getWeekDates(date: string, firstDay = 0, format?: string) {
  const d = getDate(date);
  const daysArray: CalendarsDate[] = [];
  if (date && isValidDate(date)) {
    daysArray.push(d);
    let dayOfTheWeek = getDayOfWeek(d) - firstDay;
    if (dayOfTheWeek < 0) {
      // to handle firstDay > 0
      dayOfTheWeek = 7 + dayOfTheWeek;
    }

    let newDate = d;
    let index = dayOfTheWeek - 1;
    while (index >= 0) {
      newDate = subtractDaysToDate(newDate, 1);
      daysArray.unshift(newDate);
      index -= 1;
    }

    newDate = d;
    index = dayOfTheWeek + 1;
    while (index < 7) {
      newDate = addDaysToDate(newDate, 1);
      daysArray.push(newDate);
      index += 1;
    }

    if (format) {
      return daysArray.map(d => formatDate(d, format) as string);
    }
  }
  return daysArray;
}

export function getPartialWeekDates(date?: string, numberOfDays = 7) {
  let index = 0;
  const partialWeek: string[] = [];
  while (index < numberOfDays) {
    partialWeek.push(generateDay(date || getCurrentDate(), index));
    index++;
  }
  return partialWeek;
}

export function generateDay(originDate: string | CalendarsDate, daysOffset = 0) {
  const baseDate = getDate(originDate);
  return toMarkingFormat(addDaysToDate(baseDate, daysOffset));
}

export function getLocale() {
  return LocaleConfig.locales[LocaleConfig.defaultLocale];
}

export function weekDaysShort() {
  return dayjs.weekdaysShort();
}

export function padNumber(n: number) {
  if (n < 10) {
    return `0${n}`;
  }
  return n;
}

export function dateToData(date: CalendarsDate | string): DateToData {
  const d = getDate(date);
  const dateString = toMarkingFormat(d);
  return {
    year: getYear(d),
    month: getMonth(d),
    day: getDayOfMonth(d),
    timestamp: getDateInMs(dateString, true),
    dateString
  };
}

function isStrOrNumber(value) {
  return typeof value === 'string' || typeof value === 'number';
}

export function parseDate(d?) {
  if (!isValidDate(d)) {
    return undefined;
  }
  const isUTC = true;
  if (d?.timestamp && isStrOrNumber(d.timestamp)) {
    return getDate(d.timestamp, isUTC);
  }
  if (d?.year && isStrOrNumber(d.year)) {
    return buildDate(d?.year, padNumber(d?.month), padNumber(d?.day), isUTC);
  }
  if (d?.dateString && isStrOrNumber(d.dateString)) {
    return getDate(d.dateString, isUTC);
  }
  return getDate(d, isUTC);
}

export function toMarkingFormat(d) {
  if (!isValidDate(d)) {
    return 'Invalid Date';
  }
  const year = getYear(d);
  const month = getMonth(d);
  const day = getDayOfMonth(d);
  const doubleDigitMonth = month < 10 ? `0${month}` : month;
  const doubleDigitDay = day < 10 ? `0${day}` : day;
  return `${year}-${doubleDigitMonth}-${doubleDigitDay}`;
}

export function getCurrentDate(isUTC = false) {
  if (isUTC) {
    return dayjs.utc();
  }
  return dayjs();
}

export function getDate(date: CalendarsDate, isUTC = false) {
  if (isUTC) {
    return dayjs.utc(date);
  }
  return dayjs(date);
}

export function getTodayInMarkingFormat() {
  return toMarkingFormat(getCurrentDate());
}

export function formatDate(date: CalendarsDate | DateToData, formatPattern: string, locale?: string) {
  let parsedDate = parseDate(date);
  if (locale) {
    parsedDate = parsedDate?.locale(locale);
  }
  return parsedDate?.format(formatPattern);
}

export function getDayOfMonth(date: CalendarsDate, isUTC = false) {
  if (isUTC) {
    return dayjs.utc(date).date();
  }
  return dayjs(date).date();
}

export function getDayOfWeek(date: CalendarsDate, isUTC = false) {
  if (isUTC) {
    return dayjs.utc(date).day();
  }
  return dayjs(date).day();
}

export function getMonth(date?: CalendarsDate) {
  if (!date) {
    return getCurrentDate().month() + 1;
  }
  return dayjs(date).month() + 1;
}

export function getYear(date?: CalendarsDate) {
  if (!date) {
    return getCurrentDate().year();
  }
  return dayjs(date).year();
}

export function getDateInMs(date: CalendarsDate, isUTC = false) {
  if (isUTC) {
    return dayjs.utc(date).valueOf();
  }
  return dayjs(date).valueOf();
}

export function getTimezoneOffset(date: CalendarsDate) {
  return dayjs(date).utcOffset();
}

export function getStartOfDay(date: CalendarsDate) {
  return dayjs(date).startOf('day');
}

export function addHourToDate(date: CalendarsDate, manyHours: number) {
  return dayjs(date).add(manyHours, 'hour');
}

export function addDaysToDate(date: CalendarsDate, manyDays: number) {
  return dayjs(date).add(manyDays, 'day');
}

export function addWeeksToDate(date: CalendarsDate, manyWeeks: number) {
  return dayjs(date).add(manyWeeks, 'week');
}

export function subtractDaysToDate(date: CalendarsDate, manyDays: number) {
  return dayjs(date).subtract(manyDays, 'day');
}

export function addMonthsToDate(date: CalendarsDate, manyMonths: number) {
  return dayjs(date).add(manyMonths, 'month');
}

export function subtractMonthsToDate(date: CalendarsDate, manyMonths: number) {
  return dayjs(date).subtract(manyMonths, 'month');
}

export function getDiffInHour(start: CalendarsDate, end: CalendarsDate) {
  return dayjs(start).diff(dayjs(end), 'hour');
}

export function getDiffInDays(start: CalendarsDate, end: CalendarsDate) {
  return dayjs(start).diff(dayjs(end), 'day');
}

export function getDiffInMonths(start: CalendarsDate, end: CalendarsDate) {
  return dayjs(start).diff(dayjs(end), 'month');
}

export function setDayOfMonth(date: CalendarsDate, dayOfMonth: number) {
  return dayjs(date).date(dayOfMonth);
}

export function getWeekOfYear(date: CalendarsDate) {
  return dayjs(date).week();
}

export function getDateAsString(date?: CalendarsDate): string {
  if (!date) {
    return getCurrentDate().toString();
  }
  return dayjs(date).toString();
}

export function getISODateString(date: CalendarsDate) {
  return dayjs(date).toISOString();
}

export function getTotalDaysInMonth(date?: CalendarsDate) {
  if (!date) {
    return getCurrentDate().daysInMonth();
  }
  return dayjs(date).daysInMonth();
}

export function buildDate(year: number | string, month: number | string, day: number | string, isUTC = false) {
  const actualMonth = Number(month) - 1;
  if (isUTC) {
    return dayjs.utc({year, month: actualMonth, day});
  }
  return dayjs({year, month: actualMonth, day});
}

export function buildDatetime(year, month, day, hour, minute, second, isUTC = false) {
  const actualMonth = Number(month) - 1;
  if (isUTC) {
    return dayjs.utc({year, month: actualMonth, day, hour, minute, second});
  }
  return dayjs({year, month: actualMonth, day, hour, minute, second});
}
