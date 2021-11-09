let moment: any;

// Moment is an optional dependency
export const getMoment = () => {
  if (!moment) {
    moment = require('moment');
  }

  return moment;
};
