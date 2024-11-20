let moment;
// Moment is an optional dependency
export const getMoment = () => {
    if (!moment) {
        try {
            moment = require('moment');
        }
        catch (_a) {
            // Moment is not available
        }
    }
    return moment;
};
