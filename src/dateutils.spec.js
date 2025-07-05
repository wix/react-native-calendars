import {
  buildDate,
  generateDay,
  getCurrentDate,
  isGTE,
  isLTE,
  isPastDate,
  month,
  page,
  sameMonth,
  sameWeek
} from './dateutils';

describe('dateutils', () => {
  describe('sameMonth()', () => {
    it('2014-01-01 === 2014-01-10', () => {
      const a = buildDate(2014, 0, 1);
      const b = buildDate(2014, 0, 10);
      expect(sameMonth(a, b)).toEqual(true);
    });
    // it('for non-Date instances is false', function () {
    //   expect(sameMonth('a', 'b')).toEqual(false);
    //   expect(sameMonth(123, 345)).toEqual(false);
    //   expect(sameMonth(null, false)).toEqual(false);

    //   const a = buildDate(2014, 0, 1, true);
    //   const b = buildDate(2014, 0, 10, true);
    //   expect(sameMonth(a, undefined)).toEqual(false);
    //   expect(sameMonth(null, b)).toEqual(false);
    // });
  });

  describe('sameWeek()', () => {
    it('Expect sameWeek to return true, for two days on the same week', () => {
      const a = '2021-01-05';
      const b = '2021-01-06';
      expect(sameWeek(a, b, 1)).toBe(true);
    });

    it('Expect sameWeek to return true, for two days on the same week, when', () => {
      const date = '2021-01-01';
      const prevDate = '2021-01-02';
      expect(sameWeek(prevDate, date, 1)).toBe(true);
    });

    // it('Expect sameWeek to return false, on non Date values', () => {
    //   expect(sameWeek('a', 'a')).toBe(undefined);
    //   expect(sameWeek(1, 1)).toBe(false);
    //   expect(sameWeek(false, false)).toBe(undefined);
    //   expect(sameWeek(true, true)).toBe(false);
    // });

    it('Expect sameWeek to return true, on first date is after second date', () => {
      const a = '2021-01-07';
      const b = '2021-01-05';
      expect(sameWeek(a, b, 1)).toBe(true);
    });

    it('Expect sameWeek to return false, on Sunday when firstDay is Monday', () => {
      const a = '2021-01-04';
      const b = '2021-01-05';
      expect(sameWeek(a, b, 1)).toBe(true);

      expect(sameWeek(a, b, 2)).toBe(false);
    });
  });

  describe('isPastDate', () => {
    it('Expect to get true while passing a past date', () => {
      const pastDate = '2021-04-04';
      const futureDate = '2050-04-04';
      const today1 = getCurrentDate();
      const today2 = new Date();

      expect(isPastDate(futureDate)).toBe(false);
      expect(isPastDate(pastDate)).toBe(true);

      expect(isPastDate(today1)).toBe(false);
      expect(isPastDate(today2)).toBe(false);
    });
  });

  describe('isLTE()', () => {
    it('a is undefined', () => {
      const a = undefined;
      const b = buildDate(2014, 1, 20);
      expect(isLTE(b, a)).toBe(false);
    });

    it('b is undefined', () => {
      const a = buildDate(2013, 12, 31);
      const b = undefined;
      expect(isLTE(b, a)).toBe(false);
    });

    it('both are undefined', () => {
      expect(isLTE(undefined, undefined)).toBe(false);
    });

    it('2014-01-20 >= 2013-12-31', () => {
      const a = buildDate(2013, 12, 31);
      const b = buildDate(2014, 1, 20);
      expect(isLTE(a, b)).toBe(true);
    });

    it('2014-10-20 >= 2014-10-19', () => {
      const a = buildDate(2014, 10, 19);
      const b = buildDate(2014, 10, 20);
      expect(isLTE(a, b)).toBe(true);
    });

    it('2014-10-20 >= 2014-09-30', () => {
      const a = buildDate(2014, 9, 30);
      const b = buildDate(2014, 10, 20);
      expect(isLTE(a, b)).toBe(true);
    });

    it('works for dates that differ by less than a day', () => {
      const a = buildDate(2014, 9, 30, 0, 1, 0);
      const b = buildDate(2014, 9, 30, 1, 0, 1);
      expect(isLTE(a, b)).toBe(true);
      expect(isLTE(b, a)).toBe(true);
    });
  });

  describe('isGTE()', () => {
    it('a is undefined', () => {
      const a = undefined;
      const b = buildDate(2014, 1, 20);
      expect(isGTE(b, a)).toBe(false);
    });

    it('b is undefined', () => {
      const a = buildDate(2013, 12, 31);
      const b = undefined;
      expect(isGTE(b, a)).toBe(false);
    });

    it('both are undefined', () => {
      expect(isGTE(undefined, undefined)).toBe(false);
    });

    it('2014-01-20 >= 2013-12-31', () => {
      const a = buildDate(2013, 12, 31);
      const b = buildDate(2014, 1, 20);
      expect(isGTE(b, a)).toBe(true);
    });

    it('2014-10-20 >= 2014-10-19', () => {
      const a = buildDate(2014, 10, 19);
      const b = buildDate(2014, 10, 20);
      expect(isGTE(b, a)).toBe(true);
    });

    it('2014-10-20 >= 2014-09-30', () => {
      const a = buildDate(2014, 9, 30);
      const b = buildDate(2014, 10, 20);
      expect(isGTE(b, a)).toBe(true);
    });

    it('works for dates that differ by less than a day', () => {
      const a = buildDate(2014, 9, 30, 0, 1, 0);
      const b = buildDate(2014, 9, 30, 1, 0, 1);
      expect(isGTE(a, b)).toBe(true);
      expect(isGTE(b, a)).toBe(true);
    });
  });

  describe('month()', () => {
    it('2014 May', () => {
      const days = month(buildDate(2014, 4, 1));
      expect(days.length).toBe(31);
    });

    it('2014 June', () => {
      const days = month(buildDate(2014, 5, 1));
      expect(days.length).toBe(30);
    });

    it('2014 August', () => {
      const days = month(buildDate(2014, 7, 1));
      expect(days.length).toBe(31);
    });
  });

  describe('page()', () => {
    it('2014 March', () => {
      const days = page(buildDate(2014, 2, 23, true));
      expect(days.length).toBe(42);
      expect(days[0].toString()).toBe(buildDate(2014, 1, 23).toString());
      expect(days[days.length - 1].toString()).toBe(buildDate(2014, 3, 5).toString());
    });

    it('2014 May', () => {
      const days = page(buildDate(2014, 4, 23));
      expect(days.length).toBe(35);
    });

    it('2014 June', () => {
      const days = page(buildDate(2014, 5, 23));
      expect(days.length).toBe(35);
    });

    it('2014 August', () => {
      const days = page(buildDate(2014, 7, 23));
      expect(days.length).toBe(42);
    });

    it('2014 October', () => {
      const days = page(buildDate(2014, 9, 21));
      expect(days.length).toBe(35);
    });

    it('has all days in ascending order', () => {
      let days, i, len;

      days = page(buildDate(2014, 2, 1));
      for (i = 0, len = days.length - 1; i < len; i++) {
        expect(days[i].diffDays(days[i + 1])).toBe(1);
      }
      days = page(buildDate(2014, 9, 1));
      for (i = 0, len = days.length - 1; i < len; i++) {
        expect(days[i].diffDays(days[i + 1])).toBe(1);
      }
    });
  });

  describe('generateDay', () => {
    it('should generate a day in string format with an offset', () => {
      expect(generateDay('2017-09-22', 2)).toBe('2017-09-24');
      expect(generateDay('2017-09-22', -2)).toBe('2017-09-20');
    });

    it('should generate the same day when offset was not sent', () => {
      expect(generateDay('2017-09-22')).toBe('2017-09-22');
    });

    it('should handle month and year changes', () => {
      expect(generateDay('2017-10-22', 10)).toBe('2017-11-01');
      expect(generateDay('2017-12-26', 10)).toBe('2018-01-05');
      expect(generateDay('2018-01-01', -3)).toBe('2017-12-29');
    });
  });
});
