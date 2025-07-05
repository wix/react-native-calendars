import {
  dateToData,
  formatDate,
  getDate,
  getDateInMs,
  getISODateString,
  getTimezoneOffset,
  parseDate,
  toMarkingFormat
} from './dateutils';

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
      expect(getDateInMs(date, true)).toEqual(1479832134398);
      expect(getTimezoneOffset(date)).toEqual(0);
    });

    it('should accept dateString as argument', () => {
      const date = parseDate('2012-03-16');
      expect(formatDate(date, 'YYYY-MM-DD')).toEqual('2012-03-16');
      expect(getTimezoneOffset(date)).toEqual(0);
    });

    it('should expect object with UTC timestamp as argument', () => {
      const date = parseDate(1479832134398);
      expect(getDateInMs(date)).toEqual(1479832134398);
      expect(getTimezoneOffset(date)).toEqual(0);
    });

    it('should accept Date as argument', () => {
      const testDate = getDate('2016-11-22 00:00:00+3');
      expect(getISODateString(testDate)).toEqual('2016-11-21T21:00:00.000Z');
      const time = 1479772800000;
      expect(getISODateString(getDate(time))).toEqual('2016-11-22T00:00:00.000Z');
    });

    it('should accept Date as argument', () => {
      const testDate = new Date(2015, 5, 5, 12, 0);
      const date = parseDate(testDate);
      expect(formatDate(date, 'YYYY-MM-DD')).toEqual('2015-06-05');
    });

    it('should accept data as argument', () => {
      const testDate = {
        year: 2015,
        month: 5,
        day: 6
      };
      const date = parseDate(testDate);
      expect(formatDate(date, 'YYYY-MM-DD')).toEqual('2015-05-06');
    });
  });

  describe('dateToData()', () => {
    it('should convert date to data', () => {
      const time = 1479772800000;
      const testDate = getDate(time, true);
      expect(getISODateString(testDate)).toEqual('2016-11-22T00:00:00.000Z');
      expect(dateToData(testDate)).toEqual({
        year: 2016,
        month: 11,
        day: 22,
        timestamp: 1479772800000,
        dateString: '2016-11-22'
      });
    });
  });

  describe('toMarkingFormat()', () => {
    it('should convert date to YYYY-MM-DD format string', () => {
      const time = 1479772800000;
      const testDate = getDate(time);
      expect(toMarkingFormat(testDate)).toEqual(formatDate(testDate, 'YYYY-MM-DD'));
    });
  });
});
