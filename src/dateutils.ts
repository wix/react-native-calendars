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
  let current = getDate(a);
  while (isLTE(current, b)) {
    days.push(current);
    current = addDaysToDate(current, 1);
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

  const fdow = (7 + (firstDayOfWeek | 0)) % 7;
  const ldow = (fdow + 6) % 7;

  let from = getDate(days[0]);
  const currentFromDayOfWeek = getDayOfWeek(from);
  if (currentFromDayOfWeek !== fdow) {
    const daysToSubtract = (currentFromDayOfWeek - fdow + 7) % 7;
    from = subtractDaysToDate(from, daysToSubtract);
  }

  let to = getDate(days[days.length - 1]);
  const currentToDayOfWeek = getDayOfWeek(to);
  if (currentToDayOfWeek !== ldow) {
    const daysToAdd = (ldow - currentToDayOfWeek + 7) % 7;
    to = addDaysToDate(to, daysToAdd);
  }

  const daysForSixWeeks = (currentFromDayOfWeek + days.length) / 6 >= 6;
  if (showSixWeeks && !daysForSixWeeks) {
    to = addDaysToDate(to, 7);
  }

  return fromTo(from, to);
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
  return getDate(date, isUTC).date();
}

export function getDayOfWeek(date: CalendarsDate, isUTC = false) {
  return getDate(date, isUTC).day();
}

export function getMonth(date?: CalendarsDate) {
  if (!date) {
    return getCurrentDate().month() + 1;
  }
  return getDate(date).month() + 1;
}

export function getYear(date?: CalendarsDate) {
  if (!date) {
    return getCurrentDate().year();
  }
  return getDate(date).year();
}

export function getDateInMs(date: CalendarsDate, isUTC = false) {
  return getDate(date, isUTC).valueOf();
}

export function getTimezoneOffset(date: CalendarsDate, isUTC = false) {
  return getDate(date, isUTC).utcOffset();
}

export function getStartOfDay(date: CalendarsDate, isUTC = false) {
  return getDate(date, isUTC).startOf('day');
}

export function addHourToDate(date: CalendarsDate, manyHours: number, isUTC = false) {
  return getDate(date, isUTC).add(manyHours, 'hour');
}

export function addDaysToDate(date: CalendarsDate, manyDays: number, isUTC = false) {
  return getDate(date, isUTC).add(manyDays, 'day');
}

export function addWeeksToDate(date: CalendarsDate, manyWeeks: number, isUTC = false) {
  return getDate(date, isUTC).add(manyWeeks, 'week');
}

export function subtractDaysToDate(date: CalendarsDate, manyDays: number, isUTC = false) {
  return getDate(date, isUTC).subtract(manyDays, 'day');
}

export function addMonthsToDate(date: CalendarsDate, manyMonths: number, isUTC = false) {
  return getDate(date, isUTC).add(manyMonths, 'month');
}

export function subtractMonthsToDate(date: CalendarsDate, manyMonths: number, isUTC = false) {
  return getDate(date, isUTC).subtract(manyMonths, 'month');
}

export function getDiffInHour(start: CalendarsDate, end: CalendarsDate, isUTC = false) {
  return getDate(start, isUTC).diff(getDate(end, isUTC), 'hour', true);
}

export function getDiffInDays(start: CalendarsDate, end: CalendarsDate, isUTC = false) {
  return getDate(start, isUTC).diff(getDate(end, isUTC), 'day');
}

export function getDiffInMonths(start: CalendarsDate, end: CalendarsDate, isUTC = false) {
  return getDate(start, isUTC).diff(getDate(end, isUTC), 'month');
}

export function setDayOfMonth(date: CalendarsDate, dayOfMonth: number, isUTC = false) {
  return getDate(date, isUTC).date(dayOfMonth);
}

export function getWeekOfYear(date: CalendarsDate, isUTC = false) {
  return getDate(date, isUTC).week();
}

export function getDateAsString(date?: CalendarsDate, isUTC = false) {
  if (!date) {
    return getCurrentDate(isUTC).toString();
  }
  return getDate(date, isUTC).toString();
}

export function getISODateString(date: CalendarsDate, isUTC = false) {
  return getDate(date, isUTC).toISOString();
}

export function getTotalDaysInMonth(date?: CalendarsDate, isUTC = false) {
  if (!date) {
    return getCurrentDate(isUTC).daysInMonth();
  }
  return getDate(date, isUTC).daysInMonth();
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
