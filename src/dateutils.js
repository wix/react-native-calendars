const moment = require('moment');

function sameMonth(a, b) {
  return a instanceof moment && b instanceof moment &&
    a.year() === b.year() &&
    a.month() === b.month();
}

function sameDate(a, b) {
  return a instanceof moment && b instanceof moment &&
    a.year() === b.year() &&
    a.month() === b.month() &&
    a.date() === b.date();
}

function isGTE(a, b) {
  return a.startOf('day')>=b.startOf('day');
}

function isLTE(a, b) {
  return a.startOf('day')<=b.startOf('day');
}

function fromTo(a, b) {
  const days = [];
  let from = a.valueOf(), to = b.valueOf();
  while(from <= to ){
    days.push(moment(from));
    from =  moment(from).add(1,'days').valueOf();
  }
  return days;
}

function month(md) {
  const firstDay = md.startOf('month');
  const lastDay = md.clone().endOf('month');
  return fromTo(firstDay, lastDay);
}

function weekDayNames(firstDayOfWeek = 0) {
  let weekDaysNames = moment.weekdaysShort();
  const dayShift = firstDayOfWeek % 7;
  if (dayShift) {
    weekDaysNames = weekDaysNames.slice(dayShift).concat(weekDaysNames.slice(0, dayShift));
  }
  return weekDaysNames;
}

function page(md, firstDayOfWeek, showSixWeeks) {
  const days = month(md);
  let before = [], after = [];
  
  const fdow = ((7 + firstDayOfWeek) % 7) || 7;
  const ldow = (fdow + 6) % 7;
  
  firstDayOfWeek = firstDayOfWeek || 0;
  
  const from = days[0].clone();
  
  const daysBefore = from.day();
  
  if (from.day() !== fdow) {
    from.add(-(from.day() + 7 - fdow) % 7, 'days');
  }

  const to = days[days.length - 1].clone();
  
  const day = to.day();
  
  if (day !== ldow) {
    to.add((ldow + 7 - day) % 7,'days');
  }

  const daysForSixWeeks = (((daysBefore + days.length) / 6) >= 6);
  if (showSixWeeks && !daysForSixWeeks) {
    to.add(7,'days');
  }

  if (isLTE(from, days[0])) {
    before = fromTo(from, days[0]);
  }

  if (isGTE(to, days[days.length - 1])) {
    after = fromTo(days[days.length - 1], to);
  }

  return before.concat(days.slice(1, days.length - 1), after);
}

module.exports = {
  weekDayNames,
  sameMonth,
  sameDate,
  month,
  page,
  fromTo,
  isLTE,
  isGTE
};
