import {UpdateSources} from '../commons';
import {getDate, getDatesArray, shouldComponentUpdate} from './presenter';

describe('WeekCalendar presenter tests', () => {
  const twoDaysSameWeek = {
    date: '2021-01-01',
    prevDate: '2021-01-02'
  };

  const twoDaysDifferentWeek = {
    date: '2021-01-01',
    prevDate: '2021-01-05'
  };

  const twoSomeDays = {
    date: '2021-01-12',
    prevDate: '2021-01-13'
  };

  const makeContext = (datesInWeek = twoDaysSameWeek, updateSource = UpdateSources.WEEK_SCROLL) => {
    return {
      ...datesInWeek,
      updateSource
    };
  };

  const makeProps = (current = '2021-01-01', context = makeContext(), firstDay = 0) => {
    return {current, context, firstDay};
  };

  describe('Should Component Update', () => {
    it('Expect component to not update when on same week', () => {
      const context = makeContext();
      const shouldUpdate = shouldComponentUpdate(context, context);

      expect(shouldUpdate).toBe(false);
    });

    it('Expect component to not update when on same update source', () => {
      const context = makeContext(twoDaysDifferentWeek);
      const prevContext = makeContext(twoSomeDays);
      const shouldUpdate = shouldComponentUpdate(context, prevContext);

      expect(shouldUpdate).toBe(false);
    });

    it('Expect component to not update when on same date and prev-date', () => {
      const context = makeContext(twoDaysSameWeek);
      const shouldUpdate = shouldComponentUpdate(context, context);

      expect(shouldUpdate).toBe(false);
    });

    it('Expect component to update when dates are not in the same week', () => {
      const context = makeContext(twoDaysDifferentWeek, UpdateSources.PAGE_SCROLL);
      const prevContext = makeContext(twoSomeDays);
      const shouldUpdate = shouldComponentUpdate(context, prevContext);

      expect(shouldUpdate).toBe(true);
    });
  });

  describe("Month's array of dates by weeks, getDatesArray test", () => {
    it('Expect to get array of dates before, and after the subject date', () => {
      const index = 0;
      const props = makeProps();
      expect(getDate(props, index)).toEqual('2021-01-01');

      expect(getDatesArray(props)).toEqual(['2020-12-13', '2020-12-20', '2021-01-01', '2021-01-03', '2021-01-10']);
    });

    it('Expect to get array of dates before and after the subject date, by passing `current` and without context', () => {
      const contextDate = '2021-01-31';
      const context = makeContext({date: contextDate});
      const current = undefined;
      const firstDay = 0;
      const index = 0;
      const props = {current, context, firstDay};
      expect(getDate(props, index)).toEqual(contextDate);

      expect(getDatesArray(props)).toEqual(['2021-01-17', '2021-01-24', '2021-01-31', '2021-02-07', '2021-02-14']);
    });

    it('Expect to get a week prior to current by passing negative index', () => {
      const context = makeContext();
      const firstDay = 0;
      const props = {current: '2021-01-31', context, firstDay};
      expect(getDate(props, 0)).toEqual('2021-01-31');

      expect(getDate(props, -1)).toEqual('2021-01-24');
      expect(getDate(props, -2)).toEqual('2021-01-17');
      expect(getDate(props, -3)).toEqual('2021-01-10');
    });

    it('Expect to get a week after current week by passing positive index', () => {
      const props = makeProps('2021-01-31');
      expect(getDate(props, 0)).toEqual('2021-01-31');

      expect(getDate(props, 1)).toEqual('2021-02-07');
      expect(getDate(props, 2)).toEqual('2021-02-14');
      expect(getDate(props, 3)).toEqual('2021-02-21');
    });

    it('Expect to be able to get past year', () => {
      const props = makeProps('2021-01-07');
      expect(getDate(props, -1)).toEqual('2020-12-27');
    });

    it('Expect to be able to get next year', () => {
      const props = makeProps('2021-12-30');
      expect(getDate(props, 1)).toEqual('2022-01-02');
    });
  });
});
