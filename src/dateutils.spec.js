const moment = require('moment');
const dateutils = require('./dateutils');

describe('dateutils', function () {
  describe('sameMonth()', function () {
    it('2014-01-01 === 2014-01-10', function () {
      const a = moment('2014-01-01','YYYY-MM-DD', true);
      const b = moment('2014-01-10','YYYY-MM-DD', true);
      expect(dateutils.sameMonth(a, b)).toEqual(true);
    });
    it('for non-moment instances is false', function () {
      expect(dateutils.sameMonth('a', 'b')).toEqual(false);
      expect(dateutils.sameMonth(123, 345)).toEqual(false);
      expect(dateutils.sameMonth(null, false)).toEqual(false);

      const a = moment('2014-01-01','YYYY-MM-DD', true);
      const b = moment('2014-01-10','YYYY-MM-DD', true);
      expect(dateutils.sameMonth(a, undefined)).toEqual(false);
      expect(dateutils.sameMonth(null, b)).toEqual(false);
    });
  });

  describe('isLTE()', function () {
    it('2014-01-20 >= 2013-12-31', function () {
      const a = moment('2013-12-31');
      const b = moment('2014-01-20');
      expect(dateutils.isLTE(a, b)).toBe(true);
    });

    it('2014-10-20 >= 2014-10-19', function () {
      const a = moment('2014-10-19');
      const b = moment('2014-10-20');
      expect(dateutils.isLTE(a, b)).toBe(true);
    });

    it('2014-10-20 >= 2014-09-30', function () {
      const a = moment('2014-09-30');
      const b = moment('2014-10-20');
      expect(dateutils.isLTE(a, b)).toBe(true);
    });

    it('works for dates that differ by less than a day', function () {
      const a = moment('2014-09-30 00:01:00');
      const b = moment('2014-09-30 02:01:00');
      expect(dateutils.isLTE(a, b)).toBe(true);
      expect(dateutils.isLTE(b, a)).toBe(true);
    });
  });

  describe('isGTE()', function () {
    it('2014-01-20 >= 2013-12-31', function () {
      const a = moment('2013-12-31');
      const b = moment('2014-01-20');
      expect(dateutils.isGTE(b, a)).toBe(true);
    });

    it('2014-10-20 >= 2014-10-19', function () {
      const a = moment('2014-10-19');
      const b = moment('2014-10-20');
      expect(dateutils.isGTE(b, a)).toBe(true);
    });

    it('2014-10-20 >= 2014-09-30', function () {
      const a = moment('2014-09-30');
      const b = moment('2014-10-20');
      expect(dateutils.isGTE(b, a)).toBe(true);
    });

    it('works for dates that differ by less than a day', function () {
      const a = moment('2014-09-30 00:01:00');
      const b = moment('2014-09-30 02:01:00');
      expect(dateutils.isGTE(a, b)).toBe(true);
      expect(dateutils.isGTE(b, a)).toBe(true);
    });
  });

  describe('month()', function () {
    it('2014 May', function () {
      const days = dateutils.month(moment('2014-05-01','YYYY-MM-DD',true));
      expect(days.length).toBe(31);
    });

    it('2014 August', function () {
      const days = dateutils.month(moment('2014-07-01','YYYY-MM-DD',true));
      expect(days.length).toBe(31);
    });
    it('2019 February', function () {
      const days = dateutils.month(moment('2019-02-05','YYYY-MM-DD',true));
      expect(days.length).toBe(28);
    });
    it('2020 February', function () {
      const days = dateutils.month(moment('2020-02-05','YYYY-MM-DD',true));
      expect(days.length).toBe(29);
    });
    it('2020 April', function () {
      const days = dateutils.month(moment('2020-04-01','YYYY-MM-DD',true));
      expect(days.length).toBe(30);
    });
  });
  
  describe('page()', function () {
    it('2014 March', function () {
      const days = dateutils.page(moment('2014-02-23','YYYY-MM-DD', true), 0, true);
      expect(days.length).toBe(42);
      expect(days[0].format())
        .toBe(moment('2014-01-26').format());
      expect(days[days.length - 1].format())
        .toBe(moment('2014-03-08').format());
    });

    it('2014 May', function () {
      const days = dateutils.page(moment('2014-04-23'));
      expect(days.length).toBe(35);
    });

    it('2014 June', function () {
      const days = dateutils.page(moment('2014-05-23'));
      expect(days.length).toBe(35);
    });

    it('2014 August', function () {
      const days = dateutils.page(moment('2014-07-23'), 6, true);
      expect(days.length).toBe(42);
    });

    it('2014 October', function () {
      const days = dateutils.page(moment('2014-09-21'), 0, false);
      expect(days.length).toBe(35);
    });

    it('has all days in ascending order', function () {
      let days, i, len;

      days = dateutils.page(moment('2014-02-01'));
      for (i = 0, len = days.length - 1; i < len; i++) {
        expect(days[i].diff(days[i + 1], 'days')).toBe(-1);
      }
      days = dateutils.page(moment('2014-09-01'));
      for (i = 0, len = days.length - 1; i < len; i++) {
        expect(days[i].diff(days[i + 1], 'days')).toBe(-1);
      }
    });
  });
  describe('weekDayNames()', function () {
    it('returns all days', function () {
      const a = [
        'Sun',
        'Mon',
        'Tue',
        'Wed',
        'Thu',
        'Fri',
        'Sat'
      ];
      expect(dateutils.weekDayNames()).toEqual(a);
    });
  });
});
