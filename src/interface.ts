import XDate from "xdate";


function padNumber(n: number) {
  if (n < 10) {
    return '0' + n;
  }
  return n;
}

export function xdateToData(d: XDate) {
  return {
    year: d.getFullYear(),
    month: d.getMonth() + 1,
    day: d.getDate(),
    timestamp: new XDate(d, true).getTime(),
    dateString: toMarkingFormat(d)
  };
}

export function parseDate(date: any) {
  if (!date) {
    return;
  } else if (date.timestamp) {
    // conventional data timestamp
    return new XDate(date.timestamp, true);
  } else if (date instanceof XDate) {
    // xdate
    return date;
  } else if (date.getTime) {
    // javascript date
    const dateString = date.getFullYear() + '-' + padNumber(date.getMonth() + 1) + '-' + padNumber(date.getDate());
    return new XDate(dateString, true);
  } else if (date.year) {
    const dateString = date.year + '-' + padNumber(date.month) + '-' + padNumber(date.day);
    return new XDate(dateString, true);
  } else if (date) {
    // timestamp number or date formatted as string
    return new XDate(date, true);
  }
}

export function toMarkingFormat(d: XDate) {
  return d instanceof XDate && d.toString('yyyy-MM-dd');
}
