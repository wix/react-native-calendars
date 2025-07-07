import {getCalendarDateString} from '../services';

describe('services', () => {
  describe('getCalendarDateString()', () => {
    const timestamp = 1585561899000;
    const expectedFormattedDate = '2020-03-30';
    const throwMessage = 'Invalid Date';
    const epochDate = '1970-01-01';

    it('should return undefined for undefined date', () => {
      expect(getCalendarDateString()).toEqual(undefined);
    });

    it('should return same date for dashed date string', () => {
      expect(getCalendarDateString('2020-03-30')).toEqual(expectedFormattedDate);
    });

    it('should return dashed date for JS Date', () => {
      expect(getCalendarDateString(new Date('30 Mar 2020'))).toEqual(expectedFormattedDate);
    });

    it('should return "Invalid Date" for invalid JS Date', () => {
      expect(getCalendarDateString(new Date('30/03/2020'))).toEqual(throwMessage);
    });

    it('should return dashed date for timestamp number', () => {
      expect(getCalendarDateString(timestamp)).toEqual(expectedFormattedDate);
    });

    it('should return epoch date for invalid timestamp number', () => {
      expect(getCalendarDateString(123)).toEqual(epochDate);
    });

    it('should return dashed date for slashed date string', () => {
      expect(getCalendarDateString('2020/03/30')).toEqual(expectedFormattedDate);
    });

    it('should return dashed date for formatted date string', () => {
      expect(getCalendarDateString('30 Mar 2020')).toEqual(expectedFormattedDate);
    });

    it('should return "Invalid Date" for invalid date string', () => {
      expect(getCalendarDateString('30/3/2020')).toEqual(throwMessage);
    });
  });
});
