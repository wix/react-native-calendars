const XDate = require('xdate');
const {parseDate, toMarkingFormat} = require('./interface');
const {getDefaultLocale} = require('./services');

const latinNumbersPattern = /[0-9]/g;

function isValidXDate(date: any) {
  return date && (date instanceof XDate);
}

export function sameMonth(a?: XDate, b?: XDate) {
  if (!isValidXDate(a) || !isValidXDate(b)) {
    return false;
  } else {
    return a?.getFullYear() === b?.getFullYear() && a?.getMonth() === b?.getMonth();
  }
}

export function sameDate(a?: XDate, b?: XDate) {
  if (!isValidXDate(a) || !isValidXDate(b)) {
    return false;
  } else {
    return a?.getFullYear() === b?.getFullYear() && a?.getMonth() === b?.getMonth() && a?.getDate() === b?.getDate();
  } 
}

export function sameWeek(a: string, b: string, firstDayOfWeek: number) {
  const weekDates = getWeekDates(a, firstDayOfWeek, 'yyyy-MM-dd');
  return weekDates?.includes(b);
}

export function isPastDate(date: string) {
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

export function isToday(date?: XDate) {
  return sameDate(date, XDate.today());
}

export function isGTE(a: XDate, b: XDate) {
  return b.diffDays(a) > -1;
}

export function isLTE(a: XDate, b: XDate) {
  return a.diffDays(b) > -1;
}

export function formatNumbers(date: any) {
  const numbers = getDefaultLocale().numbers;
  return numbers ? date.toString().replace(latinNumbersPattern, (char: any) => numbers[+char]) : date;
}

export function fromTo(a: XDate, b: XDate): XDate[] {
  const days: XDate[] = [];
  let from = +a;
  const to = +b;

  for (; from <= to; from = new XDate(from, true).addDays(1).getTime()) {
    days.push(new XDate(from, true));
  }
  return days;
}

export function month(date: XDate) {
  const year = date.getFullYear(),
    month = date.getMonth();
  const days = new XDate(year, month + 1, 0).getDate();

  const firstDay = new XDate(year, month, 1, 0, 0, 0, true);
  const lastDay = new XDate(year, month, days, 0, 0, 0, true);

  return fromTo(firstDay, lastDay);
}

export function weekDayNames(firstDayOfWeek = 0) {
  let weekDaysNames = getDefaultLocale().dayNamesShort;
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

export function isDateNotInTheRange(minDate: XDate, maxDate: XDate, date: XDate) {
  return (minDate && !isGTE(date, minDate)) || (maxDate && !isLTE(date, maxDate));
}

export function getWeekDates(date: string, firstDay = 0, format?: string) {
  if (date && parseDate(date).valid()) {
    const current = parseDate(date);
    const daysArray = [current];
    let dayOfTheWeek = current.getDay() - firstDay;
    if (dayOfTheWeek < 0) {
      // to handle firstDay > 0
      dayOfTheWeek = 7 + dayOfTheWeek;
    }

    let newDate = current;
    let index = dayOfTheWeek - 1;
    while (index >= 0) {
      newDate = parseDate(newDate).addDays(-1);
      daysArray.unshift(newDate);
      index -= 1;
    }

    newDate = current;
    index = dayOfTheWeek + 1;
    while (index < 7) {
      newDate = parseDate(newDate).addDays(1);
      daysArray.push(newDate);
      index += 1;
    }

    if (format) {
      return daysArray.map(d => d.toString(format));
    }

    return daysArray;
  }
}

export function getPartialWeekDates(date: string | undefined, numberOfDays = 7) {
  let index = 0;
  const partialWeek: string[] = [];
  while (index < numberOfDays) {
    partialWeek.push(generateDay(date || new XDate(), index));
    index++;
  }
  return partialWeek;
}

export function generateDay(originDate: string, daysOffset = 0) {
  const baseDate = new XDate(originDate);
  return toMarkingFormat(baseDate.clone().addDays(daysOffset));
}
