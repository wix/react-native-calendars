let moment: any;

// Moment is an optional dependency
export const getMoment = async () => {
  if (!moment) {
    try {
      moment = await import('moment');
    } catch {
      // Moment is not available
    }
  }

  return moment;
};
