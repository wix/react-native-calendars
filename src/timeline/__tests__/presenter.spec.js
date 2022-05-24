import * as uut from '../helpers/presenter';

describe('timeline presenter', () => {
  describe('calcTimeByPosition', () => {
    it('should return hour/minutes by position - basic case 1', () => {
      const {hour, minutes} = uut.calcTimeByPosition(300, 100);
      expect(hour).toBe(3);
      expect(minutes).toBe(0);
    });

    it('should return hour/minutes by position - basic case 2', () => {
      const {hour, minutes} = uut.calcTimeByPosition(350, 100);
      expect(hour).toBe(3);
      expect(minutes).toBe(30);
    });

    it('should round down time to nearest 30 minutes block', () => {
      const time1 = uut.calcTimeByPosition(310, 100);
      expect(time1.hour).toBe(3);
      expect(time1.minutes).toBe(0);

      const time2 = uut.calcTimeByPosition(280, 100);
      expect(time2.hour).toBe(2);
      expect(time2.minutes).toBe(30);

      const time3 = uut.calcTimeByPosition(440, 100);
      expect(time3.hour).toBe(4);
      expect(time3.minutes).toBe(0);

      const time4 = uut.calcTimeByPosition(1488, 100);
      expect(time4.hour).toBe(14);
      expect(time4.minutes).toBe(30);
    });

    it('should handle different hour block heights', () => {
      const time1 = uut.calcTimeByPosition(350, 85);
      expect(time1.hour).toBe(4);
      expect(time1.minutes).toBe(0);

      const time2 = uut.calcTimeByPosition(350, 145);
      expect(time2.hour).toBe(2);
      expect(time2.minutes).toBe(0);

      const time3 = uut.calcTimeByPosition(350, 135);
      expect(time3.hour).toBe(2);
      expect(time3.minutes).toBe(30);
    });
  });

  describe('calcDateByPosition', () => {
    it('should return date by position - basic case 1', () => {
      const date = uut.calcDateByPosition(100, 72, 1, '2022-10-10');
      expect(date).toBe('2022-10-10');
    });

    it('should return date by position - basic case 2', () => {
      const date = uut.calcDateByPosition(100, 72, 3, '2022-10-10');
      expect(date).toBe('2022-10-10');
    });

    it('should return date by position - basic case 3', () => {
      const date = uut.calcDateByPosition(500, 72, 3, '2022-10-10');
      expect(date).toBe('2022-10-11');
    });

    it('should return date by position - basic case 3', () => {
      const date = uut.calcDateByPosition(500, 72, 7, '2022-10-10');
      expect(date).toBe('2022-10-14');
    });
  });

  describe('buildTimeString', () => {
    it('should construct time string based on given hour/mins', () => {
      expect(uut.buildTimeString(3, 12)).toBe('03:12:00');
      expect(uut.buildTimeString(23, 55)).toBe('23:55:00');
    });

    it('should padding hour/minutes with zeroes', () => {
      expect(uut.buildTimeString(3, 0)).toBe('03:00:00');
      expect(uut.buildTimeString(9, 5)).toBe('09:05:00');
    });

    it('should default undefined hour/min to zeroes', () => {
      expect(uut.buildTimeString(undefined, 30)).toBe('00:30:00');
      expect(uut.buildTimeString(9, undefined)).toBe('09:00:00');
    });

    it('should concatenate date when passed', () => {
      expect(uut.buildTimeString(10, 30, '2022-12-23')).toBe('2022-12-23 10:30:00');
      expect(uut.buildTimeString(15, 0, '2017-03-05')).toBe('2017-03-05 15:00:00');
    });
  });

  describe('calcTimeOffset', () => {
    // NOTE: useFakeTimers API works only in jest 27, unfortunately, other tests fail in jest 27
    it.skip('should give offset based on current time', () => {
      jest.useFakeTimers().setSystemTime(new Date('2020-01-01 15:30').getTime());
      expect(uut.calcTimeOffset(100)).toBe(1550);

      jest.useFakeTimers().setSystemTime(new Date('2020-01-01 12:10').getTime());
      expect(uut.calcTimeOffset(100)).toBeCloseTo(1216.66, 1);
    });

    it('should give offset based on given time', () => {
      expect(uut.calcTimeOffset(100, 15, 30)).toBe(1550);
      expect(uut.calcTimeOffset(100, 12, 10)).toBeCloseTo(1216.66, 1);
    });
  });
});
