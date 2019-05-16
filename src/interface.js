const XDate = require('xdate');

function padNumber(n) {
  if (n < 10) {
    return '0' + n;
  }
  return n;
}

function xdateToData(xdate) {
  const dateString = xdate.toString('yyyy-MM-dd');
  return {
    year: xdate.getFullYear(),
    month: xdate.getMonth() + 1,
    day: xdate.getDate(),
    timestamp: XDate(dateString, true).getTime(),
    dateString: dateString
  };
}

function parseDate(d) {
  if (!d) {
    return;
  } else if (d.timestamp) { // conventional data timestamp
    return XDate(d.timestamp, true);
  } else if (d instanceof XDate) { // xdate
    return XDate(d.toString('yyyy-MM-dd'), true);
  } else if (d.getTime) { // javascript date
    const dateString = d.getFullYear() + '-' + padNumber((d.getMonth() + 1)) + '-' + padNumber(d.getDate());
    return XDate(dateString, true);
  } else if (d.year) {
    const dateString = d.year + '-' + padNumber(d.month) + '-' + padNumber(d.day);
    return XDate(dateString, true);
  } else if (d) { // timestamp nuber or date formatted as string
    return XDate(d, true);
  }
}

module.exports = {
  xdateToData,
  parseDate
};

