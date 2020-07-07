const moment = require('moment');

function padNumber(n) {
  if (n < 10) {
    return '0' + n;
  }
  return n;
}

function momentToData(momentObject) {
  const dateString = momentObject.format('YYYY-MM-DD');
  return {
    year: momentObject.year(),
    month: momentObject.month()+1,
    day: momentObject.date(),
    timestamp: momentObject.valueOf(),
    dateString: dateString
  };
}
function parseDate(d) {
  if (!d) {
    return;
  } else if (d.timestamp) { // conventional data timestamp
    return moment(d.timestamp);
  } else if (d instanceof moment) { // moment
    return moment(d, 'YYYY-MM-DD', true);
  } else if (d.getTime) { // javascript date
    const dateString = d.getFullYear() + '-' + padNumber((d.getMonth() + 1)) + '-' + padNumber(d.getDate());
    return moment(dateString, true);
  } else if (d.year) {
    const dateString = d.year + '-' + padNumber(d.month) + '-' + padNumber(d.day);
    return moment(dateString, 'YYYY-MM-DD', true);
  } else if (d) { // timestamp number or date formatted as string
    return moment(d);
  }
}

module.exports = {
  momentToData,
  parseDate
};

