const xdate = require('xdate');
const dateutils = require('./dateutils');

describe('dateutils', function () {
  describe('sameMonth()', function () {
    it('2014-01-01 === 2014-01-10', function () {
      var a = xdate(2014, 0, 1, true);
      var b = xdate(2014, 0, 10, true);
      expect(dateutils.sameMonth(a, b)).toEqual(true);
    });
    it('for non-XDate instances is false', function () {
      expect(dateutils.sameMonth('a', 'b')).toEqual(false);
      expect(dateutils.sameMonth(123, 345)).toEqual(false);
      expect(dateutils.sameMonth(null, false)).toEqual(false);

      var a = xdate(2014, 0, 1, true);
      var b = xdate(2014, 0, 10, true);
      expect(dateutils.sameMonth(a, undefined)).toEqual(false);
      expect(dateutils.sameMonth(null, b)).toEqual(false);
    });
  });

  describe('isLTE()', function () {
    it('2014-01-20 >= 2013-12-31', function () {
      var a = xdate(2013, 12, 31);
      var b = xdate(2014, 1, 20);
      expect(dateutils.isLTE(a, b)).toBe(true);
    });

    it('2014-10-20 >= 2014-10-19', function () {
      var a = xdate(2014, 10, 19);
      var b = xdate(2014, 10, 20);
      expect(dateutils.isLTE(a, b)).toBe(true);
    });

    it('2014-10-20 >= 2014-09-30', function () {
      var a = xdate(2014, 9, 30);
      var b = xdate(2014, 10, 20);
      expect(dateutils.isLTE(a, b)).toBe(true);
    });

    it('works for dates that differ by less than a day', function () {
      var a = xdate(2014, 9, 30, 0, 1, 0);
      var b = xdate(2014, 9, 30, 1, 0, 1);
      expect(dateutils.isLTE(a, b)).toBe(true);
      expect(dateutils.isLTE(b, a)).toBe(true);
    });
  });

  describe('isGTE()', function () {
    it('2014-01-20 >= 2013-12-31', function () {
      var a = xdate(2013, 12, 31);
      var b = xdate(2014, 1, 20);
      expect(dateutils.isGTE(b, a)).toBe(true);
    });

    it('2014-10-20 >= 2014-10-19', function () {
      var a = xdate(2014, 10, 19);
      var b = xdate(2014, 10, 20);
      expect(dateutils.isGTE(b, a)).toBe(true);
    });

    it('2014-10-20 >= 2014-09-30', function () {
      var a = xdate(2014, 9, 30);
      var b = xdate(2014, 10, 20);
      expect(dateutils.isGTE(b, a)).toBe(true);
    });

    it('works for dates that differ by less than a day', function () {
      var a = xdate(2014, 9, 30, 0, 1, 0);
      var b = xdate(2014, 9, 30, 1, 0, 1);
      expect(dateutils.isGTE(a, b)).toBe(true);
      expect(dateutils.isGTE(b, a)).toBe(true);
    });
  });

  describe('month()', function () {
    it('2014 May', function () {
      var days = dateutils.month(xdate(2014, 4, 1));
      expect(days.length).toBe(31);
    });

    it('2014 August', function () {
      var days = dateutils.month(xdate(2014, 7, 1));
      expect(days.length).toBe(31);
    });
  });

  describe('page()', function () {
    it('2014 March', function () {
      var days = dateutils.page(xdate(2014, 2, 23, true));
      expect(days.length).toBe(42);
      expect(days[0].toString())
        .toBe(xdate(2014, 1, 23, 0, 0, 0, true).toString());
      expect(days[days.length - 1].toString())
        .toBe(xdate(2014, 3, 5, 0, 0, 0, true).toString());
    });

    it('2014 May', function () {
      var days = dateutils.page(xdate(2014, 4, 23));
      expect(days.length).toBe(35);
    });

    it('2014 June', function () {
      var days = dateutils.page(xdate(2014, 5, 23));
      expect(days.length).toBe(35);
    });

    it('2014 August', function () {
      var days = dateutils.page(xdate(2014, 7, 23));
      expect(days.length).toBe(42);
    });

    it('2014 October', function () {
      var days = dateutils.page(xdate(2014, 9, 21));
      expect(days.length).toBe(35);
    });

    it('has all days in ascending order', function () {
      var days, i, len;

      days = dateutils.page(xdate(2014, 2, 1));
      for (i = 0, len = days.length - 1; i < len; i++) {
        expect(days[i].diffDays(days[i + 1])).toBe(1);
      }
      days = dateutils.page(xdate(2014, 9, 1));
      for (i = 0, len = days.length - 1; i < len; i++) {
        expect(days[i].diffDays(days[i + 1])).toBe(1);
      }
    });
  });

});
