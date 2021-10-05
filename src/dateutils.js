const XDate = require('xdate');
const {parseDate} = require('./interface');

const latinNumbersPattern = /[0-9]/g;

export function sameMonth(a, b) {
  return (
    a instanceof XDate && b instanceof XDate && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth()
  );
}

export function sameDate(a, b) {
  return (
    a instanceof XDate &&
    b instanceof XDate &&
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function sameWeek(d1, d2, firstDayOfWeek) {
  const weekDates = getWeekDates(d1, firstDayOfWeek, 'yyyy-MM-dd');
  return weekDates?.includes(d2);
}

export function isToday(day) {
  return sameDate(XDate(day), XDate.today());
}

export function isGTE(a, b) {
  return b.diffDays(a) > -1;
}

export function isLTE(a, b) {
  return a.diffDays(b) > -1;
}

export function formatNumbers(value) {
  const numbers = XDate.locales[XDate.defaultLocale].numbers;
  return numbers ? value.toString().replace(latinNumbersPattern, char => numbers[+char]) : value;
}

export function fromTo(a, b) {
  const days = [];
  let from = +a,
    to = +b;
  for (; from <= to; from = new XDate(from, true).addDays(1).getTime()) {
    days.push(new XDate(from, true));
  }
  return days;
}

export function month(xd) {
  const year = xd.getFullYear(),
    month = xd.getMonth();
  const days = new Date(year, month + 1, 0).getDate();

  const firstDay = new XDate(year, month, 1, 0, 0, 0, true);
  const lastDay = new XDate(year, month, days, 0, 0, 0, true);

  return fromTo(firstDay, lastDay);
}

export function weekDayNames(firstDayOfWeek = 0) {
  let weekDaysNames = XDate.locales[XDate.defaultLocale].dayNamesShort;
  const dayShift = firstDayOfWeek % 7;
  if (dayShift) {
    weekDaysNames = weekDaysNames.slice(dayShift).concat(weekDaysNames.slice(0, dayShift));
  }
  return weekDaysNames;
}

export function page(xd, firstDayOfWeek, showSixWeeks) {
  const days = month(xd);
  let before = [],
    after = [];

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

export function isDateNotInTheRange(minDate, maxDate, date) {
  return (minDate && !isGTE(date, minDate)) || (maxDate && !isLTE(date, maxDate));
}

export function getWeekDates(date, firstDay, format) {
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
