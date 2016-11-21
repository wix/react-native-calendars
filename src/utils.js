import XDate from 'xdate';

export function xdateToData(xdate) {
  return {
    year: xdate.getFullYear(),
    month: xdate.getMonth(),
    day: xdate.getDate(),
    timestamp: XDate(xdate.toISOString().split('T')[0], true).getTime()
  }
}

export function parseDate(d) {
  if (!d) {
    return;
  } else if (d.timestamp) {
    return XDate(d.timestamp, true);
  } else if (d.getTime) {
    return XDate(d.getTime(), true);
  } else if (d) {
    return XDate(d, true);
  }
}
