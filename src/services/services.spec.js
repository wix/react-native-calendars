import {getCalendarDateString} from '../services';

describe('services', function () {
  describe('getCalendarDateString()', function () {
    const timestamp = 1585561899000;
    const expectedFormattedDate = '2020-03-30';
    const throwMessage = 'Invalid Date';
    const epochDate = '1970-01-01';

    it('should return undefined for undefined date', function () {
      expect(getCalendarDateString()).toEqual(undefined);
    });

    it('should return same date for dashed date string', function () {
      expect(getCalendarDateString('2020-03-30')).toEqual(expectedFormattedDate);
    });

    it('should return dashed date for JS Date', function () {
      expect(getCalendarDateString(new Date('30 Mar 2020'))).toEqual(expectedFormattedDate);
    });

    it('should throw "Invalid Date" for invalid JS Date', function () {
      expect(() => {getCalendarDateString(new Date('30/03/2020'));}).toThrow(throwMessage);
    });

    it('should return dashed date for timestamp number', function () {
      expect(getCalendarDateString(timestamp)).toEqual(expectedFormattedDate);
    });

    it('should return epoch date for invalid timestamp number', function () {
      expect(getCalendarDateString(666)).toEqual(epochDate);
    });

    it('should return dashed date for slashed date string', function () {
      expect(getCalendarDateString('2020/03/30')).toEqual(expectedFormattedDate);
    });

    it('should return dashed date for formatted date string', function () {
      expect(getCalendarDateString('30 Mar 2020')).toEqual(expectedFormattedDate);
    });

    it('should return "Invalid Date" for invalid date string', function () {
      expect(getCalendarDateString('30/3/2020')).toEqual(throwMessage);
    });
  });
});
