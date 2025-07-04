import dayjs, { type Dayjs } from "dayjs";
import isTodayPlugin from 'dayjs/plugin/isToday';

dayjs.extend(isTodayPlugin)

export type CustomDate = Dayjs

function isValidDate(date: any) {
  return date && dayjs(date).isValid()
}

export function sameMonth(a?: CustomDate, b?: CustomDate) {
  if (!isValidDate(a) || !isValidDate(b)) {
    return false;
  }
	return a?.isSame(b, 'year') && a?.isSame(b, 'month')
}

export function sameDate(a?: CustomDate, b?: CustomDate) {
   if (!isValidDate(a) || !isValidDate(b)) {
    return false;
  }
	return a?.isSame(b, 'date')
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
}){
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

export function sameWeek(a: string, b: string, firstDayOfWeek: number) {
  const weekDates = getWeekDates(a, firstDayOfWeek, 'yyyy-MM-dd');
  const element = weekDates instanceof XDate ? new XDate(b) : b;
  return weekDates?.includes(element);
}

export function isPastDate(date: string) {
  const today = dayjs()
  return dayjs(date).isAfter(today);
}

export function isToday(date?: any) {
  return dayjs(date).isToday()
}

export function isGTE(a: CustomDate, b: CustomDate) {
  return a.isAfter(b)
}

export function isLTE(a: CustomDate, b: CustomDate) {
  return a.isBefore(b)
}

export function formatNumbers(date: any) {
	const latinNumbersPattern = /[0-9]/g;
  const numbers = getLocale().numbers;
  return numbers ? date.toString().replace(latinNumbersPattern, (char: any) => numbers[+char]) : date;
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

export function month(date: XDate) { // exported for tests only
  const year = date.getFullYear(),
    month = date.getMonth();
  const days = new XDate(year, month + 1, 0).getDate();

  const firstDay: XDate = new XDate(year, month, 1, 0, 0, 0, true);
  const lastDay: XDate = new XDate(year, month, days, 0, 0, 0, true);

  return fromTo(firstDay, lastDay);
}

export function weekDayNames(firstDayOfWeek = 0) {
  let weekDaysNames = getLocale().dayNamesShort;
  const dayShift = firstDayOfWeek % 7;
  if (dayShift) {
    weekDaysNames = weekDaysNames.slice(dayShift).concat(weekDaysNames.slice(0, dayShift));
  }
  return weekDaysNames;
}

export function page(date: XDate, firstDayOfWeek = 0, showSixWeeks = false) {
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

export function isDateNotInRange(date: XDate, minDate: string, maxDate: string) {
  return (minDate && !isGTE(date, new XDate(minDate))) || (maxDate && !isLTE(date, new XDate(maxDate)));
}

export function getWeekDates(date: string, firstDay = 0, format?: string): CustomDate[] | undefined {
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

export function getPartialWeekDates(date?: string, numberOfDays = 7) {
  let index = 0;
  const partialWeek: string[] = [];
  while (index < numberOfDays) {
    partialWeek.push(generateDay(date || getToday(), index));
    index++;
  }
  return partialWeek;
}

export function generateDay(originDate: string | XDate, daysOffset = 0) {
  const baseDate = originDate instanceof XDate ? originDate : new XDate(originDate);
  return toMarkingFormat(baseDate.clone().addDays(daysOffset));
}

export function getLocale() {
  return XDate.locales[XDate.defaultLocale];
}

export function padNumber(n: number) {
  if (n < 10) {
    return '0' + n;
  }
  return n;
}

export function xdateToData(date: XDate | string) {
  const d = date instanceof XDate ? date : new XDate(date);
  const dateString = toMarkingFormat(d);
  return {
    year: d.getFullYear(),
    month: d.getMonth() + 1,
    day: d.getDate(),
    timestamp: new XDate(dateString, true).getTime(),
    dateString: dateString
  };
}

export function parseDate(d?: any) {
  if (!d) {
    return;
  } else if (d.timestamp) {
    // conventional data timestamp
    return new XDate(d.timestamp, true);
  } else if (d instanceof XDate) {
    // xdate
    return new XDate(toMarkingFormat(d), true);
  } else if (d.getTime) {
    // javascript date
    const dateString = d.getFullYear() + '-' + padNumber(d.getMonth() + 1) + '-' + padNumber(d.getDate());
    return new XDate(dateString, true);
  } else if (d.year) {
    const dateString = d.year + '-' + padNumber(d.month) + '-' + padNumber(d.day);
    return new XDate(dateString, true);
  } else if (d) {
    // timestamp number or date formatted as string
    return new XDate(d, true);
  }
}

export function toMarkingFormat(d: CustomDate) {
  if (isNaN(getDateInMs(d))) {
		return 'Invalid Date';
	}
  const year = `${getYear(d)}`;
  const month = getMonth(d) + 1;
  const doubleDigitMonth = month < 10 ? `0${month}` : `${month}`;
  const day = getDay(d);
  const doubleDigitDay = day < 10 ? `0${day}` : `${day}`;
  return year + '-' + doubleDigitMonth + '-' + doubleDigitDay;
}

export function getDate(date) {
	return dayjs(date)
}

export function getToday() {
	return dayjs()
}

export function getTodayInMarkingFormat() {
	return toMarkingFormat(getToday())
}

export function formatDate(date, formatPattern: string) {
	return dayjs(date).format(formatPattern);
}

export function getDay(date: CustomDate) {
	return date.get('day');
}

export function getMonth(date: CustomDate) {
	return date.month();
}

export function getYear(date: CustomDate) {
	return date.year();
}

export function getDateInMs(date: CustomDate) {
	return date.valueOf()
}

export function getCurrentDate() {
	return dayjs()
}

export function getStartOfDay(date: CustomDate) {
	return dayjs(date).startOf('day')
}

export function addHourToDate(date, manyHours: number) {
	return dayjs(date).add(manyHours, 'hour')
}

export function getDiffInHour(start: CustomDate, end: CustomDate) {
	return start.diff(end, 'hour')
}
