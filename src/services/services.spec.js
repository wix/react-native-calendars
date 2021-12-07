import XDate from 'xdate';
import {getCalendarDateString} from '../services';

describe('services', function () {
  describe('getCalendarDateString()', function () {
    const timestamp = 1585561899000;
    const expectedFormattedDate = '2020-03-30';

    it('should return undefined for undefined date', function () {
      expect(getCalendarDateString()).toEqual(undefined);
    });

    it('should return dashed date for XDate', function () {
      expect(getCalendarDateString(new XDate('2020/03/30'))).toEqual(expectedFormattedDate);
    });

    it('should return dashed date for DateData timestamp', function () {
      expect(getCalendarDateString({timestamp: timestamp})).toEqual(expectedFormattedDate);
    });

    it('should return dashed date for DateData', function () {
      expect(getCalendarDateString({timestamp: timestamp})).toEqual(expectedFormattedDate);
    });

    it('should return dashed date for js Date', function () {
      expect(getCalendarDateString(new Date('30 Mar 2020'))).toEqual(expectedFormattedDate);
    });

    it('should return dashed date for timestamp number', function () {
      expect(getCalendarDateString(timestamp)).toEqual(expectedFormattedDate);
    });

    it('should return "invalid date" for invalid date string', function () {
      expect(getCalendarDateString('30/3/2020')).toEqual('Invalid Date');
    });

    it('should return dashed date for slashed date string', function () {
      expect(getCalendarDateString('2020/03/30')).toEqual(expectedFormattedDate);
    });

    it.only('should return dashed date for formatted date string', function () {
      expect(getCalendarDateString('30 Mar 2020')).toEqual(expectedFormattedDate);
    });
  });
});
