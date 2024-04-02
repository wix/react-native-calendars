import {parseDate, xdateToData, toMarkingFormat} from './interface';
import XDate from 'xdate';

describe('interface', () => {
  describe('parseDate()', () => {
    it('should return undefined if date is undefined', () => {
      const date = parseDate();
      expect(date).toBe(undefined);
    });

    it('should return undefined if date is null', () => {
      const date = parseDate(null);
      expect(date).toBe(undefined);
    });

    it('should accept UTC timestamp as argument', () => {
      const date = parseDate(1479832134398);
      expect(date.getTime()).toEqual(1479832134398);
      expect(date.getTimezoneOffset()).toEqual(0);
    });

    it('should accept dateString as argument', () => {
      const date = parseDate('2012-03-16');
      expect(date.toString('yyyy-MM-dd')).toEqual('2012-03-16');
      expect(date.getTimezoneOffset()).toEqual(0);
    });

    it('should expect object with UTC timestamp as argument', () => {
      const date = parseDate({timestamp: 1479832134398});
      expect(date.getTime()).toEqual(1479832134398);
      expect(date.getTimezoneOffset()).toEqual(0);
    });

    it('should accept XDate as argument', () => {
      const testDate = XDate('2016-11-22 00:00:00+3');
      expect(testDate.toISOString()).toEqual('2016-11-21T21:00:00Z');
      const time = 1479772800000;
      expect(XDate(time, true).toISOString()).toEqual('2016-11-22T00:00:00Z');
    });

    it('should accept Date as argument', () => {
      const testDate = new Date(2015, 5, 5, 12, 0);
      const date = parseDate(testDate);
      expect(date.toString('yyyy-MM-dd')).toEqual('2015-06-05');
    });

    it('should accept data as argument', () => {
      const testDate = {
        year: 2015,
        month: 5,
        day: 6
      };
      const date = parseDate(testDate);
      expect(date.toString('yyyy-MM-dd')).toEqual('2015-05-06');
    });
  });

  describe('xdateToData()', () => {
    it('should convert xdate to data', () => {
      const time = 1479772800000;
      const testDate = XDate(time, true);
      expect(testDate.toISOString()).toEqual('2016-11-22T00:00:00Z');
      const data = xdateToData(testDate);
      expect(data).toEqual({
        year: 2016,
        month: 11,
        day: 22,
        timestamp: 1479772800000,
        dateString: '2016-11-22'
      });
    });
  });

  describe('toMarkingFormat()', () => {
    it('should convert date to yyyy-MM-dd format string', () => {
      const time = 1479772800000;
      const testDate = XDate(time);
      expect(toMarkingFormat(testDate)).toEqual(testDate.toString('yyyy-MM-dd'));
    });
  });
});
