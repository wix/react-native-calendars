const {UPDATE_SOURCES} = require('../commons');
const {default: Presenter} = require('./presenter');

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

  const makeContext = (datesInWeek = twoDaysSameWeek, updateSource = UPDATE_SOURCES.WEEK_SCROLL) => {
    return {
      ...datesInWeek,
      updateSource
    };
  };

  const makeUUT = args => {
    return new Presenter(args);
  };

  const makeProps = (current = '2021-01-01', context = makeContext(), firstDay = 0) => {
    return {current, context, firstDay};
  };

  describe('Should Component Update', () => {
    it('Expect component to not update when on same week', () => {
      const context = makeContext();
      const {shouldComponentUpdate} = makeUUT();
      const shouldUpdate = shouldComponentUpdate(context, context);

      expect(shouldUpdate).toBe(false);
    });

    it('Expect component to not update when on same update source', () => {
      const context = makeContext(twoDaysDifferentWeek);
      const prevContext = makeContext(twoSomeDays);
      const {shouldComponentUpdate} = makeUUT();
      const shouldUpdate = shouldComponentUpdate(context, prevContext);

      expect(shouldUpdate).toBe(false);
    });

    it('Expect component to not update when on same date and prev-date', () => {
      const context = makeContext(twoDaysSameWeek);
      const {shouldComponentUpdate} = makeUUT();
      const shouldUpdate = shouldComponentUpdate(context, context);

      expect(shouldUpdate).toBe(false);
    });

    it('Expect component to update when dates are not in the same week', () => {
      const context = makeContext(twoDaysDifferentWeek, UPDATE_SOURCES.PAGE_SCROLL);
      const prevContext = makeContext(twoSomeDays);
      const {shouldComponentUpdate} = makeUUT();
      const shouldUpdate = shouldComponentUpdate(context, prevContext);

      expect(shouldUpdate).toBe(true);
    });
  });

  describe("Month's array of dates by weeks, getDatesArray test", () => {
    it('Expect to get array of dates before, and after the subject date', () => {
      const index = 0;
      const presenter = makeUUT();
      const props = makeProps();
      expect(presenter.getDate(props, index)).toEqual('2021-01-01');

      expect(presenter.getDatesArray(props)).toEqual([
        '2020-12-13',
        '2020-12-20',
        '2021-01-01',
        '2021-01-03',
        '2021-01-10'
      ]);
    });

    it('Expect to get array of dates before and after the subject date, by passing `current` and without context', () => {
      const contextDate = '2021-01-31';
      const context = makeContext({date: contextDate});
      const current = undefined;
      const firstDay = 0;
      const index = 0;
      const presenter = makeUUT();
      const props = {current, context, firstDay};
      expect(presenter.getDate(props, index)).toEqual(contextDate);

      expect(presenter.getDatesArray(props)).toEqual([
        '2021-01-17',
        '2021-01-24',
        '2021-01-31',
        '2021-02-07',
        '2021-02-14'
      ]);
    });

    it('Expect to get a week prior to current by passing negative index', () => {
      const context = makeContext();
      const firstDay = 0;
      const presenter = makeUUT();
      const props = {current: '2021-01-31', context, firstDay};
      expect(presenter.getDate(props, 0)).toEqual('2021-01-31');

      expect(presenter.getDate(props, -1)).toEqual('2021-01-24');
      expect(presenter.getDate(props, -2)).toEqual('2021-01-17');
      expect(presenter.getDate(props, -3)).toEqual('2021-01-10');
    });

    it('Expect to get a week after current week by passing positive index', () => {
      const presenter = makeUUT();
      const props = makeProps('2021-01-31');
      expect(presenter.getDate(props, 0)).toEqual('2021-01-31');

      expect(presenter.getDate(props, 1)).toEqual('2021-02-07');
      expect(presenter.getDate(props, 2)).toEqual('2021-02-14');
      expect(presenter.getDate(props, 3)).toEqual('2021-02-21');
    });

    it('Expect to be able to get past year', () => {
      const presenter = makeUUT();
      const props = makeProps('2021-01-07');
      expect(presenter.getDate(props, -1)).toEqual('2020-12-27');
    });

    it('Expect to be able to get next year', () => {
      const props = makeProps('2021-12-30');
      const presenter = makeUUT();
      expect(presenter.getDate(props, 1)).toEqual('2022-01-02');
    });
  });

  describe('Event - onDatePressed', () => {
    it('onDayPressed', () => {
      const setDate = jest.fn();
      const context = {date: '2021-02-02', setDate};
      const {onDayPressed} = makeUUT({context});

      onDayPressed(context, {dateString: '2021-01-22'});
      expect(setDate).toBeCalledWith('2021-01-22', UPDATE_SOURCES.DAY_PRESS);
    });
  });

  describe('onScroll event test suit', () => {
    it('Expect getX to return the passed value when android fix is disabled', () => {
      const uut = makeUUT();
      uut._applyAndroidRtlFix = false;

      const xValue = uut._getX(213, 10, 100);
      expect(xValue).toEqual(213);
    });

    it('Expect getX to apply android fix if applyAndroidRtlFix is enabled', () => {
      const uut = makeUUT();
      uut._applyAndroidRtlFix = true;

      let x = 40;
      let itemsCount = 2;
      let width = 100;

      let xValue = uut._getX(x, itemsCount, width);
      expect(xValue).toEqual(width * (itemsCount - 1) - x);

      x = 80;
      itemsCount = 3;
      width = 200;

      xValue = uut._getX(x, itemsCount, width);
      expect(xValue).toEqual(width * (itemsCount - 1) - x);

      x = 1387;
      itemsCount = 2113;
      width = 4129;

      xValue = uut._getX(x, itemsCount, width);
      expect(xValue).toEqual(width * (itemsCount - 1) - x);
    });

    it('Round value of x / width', () => {
      const {_getNewPage} = makeUUT();
      let x = 1293;
      let width = 1993;
      let page = _getNewPage(x, width);

      let rounded = Math.round(x / width);
      expect(page).toEqual(rounded);

      x = 11;
      width = 99;
      page = _getNewPage(x, width);

      rounded = Math.round(x / width);
      expect(page).toEqual(rounded);
    });

    it('Round value edge cases', () => {
      const {_getNewPage} = makeUUT();
      let x = 1;
      let width = 1;
      let rounded = Math.round(x / width);

      let page = _getNewPage(x, width);
      expect(page).toEqual(rounded);

      x = 0;
      width = 1;
      rounded = Math.round(x / width);

      page = _getNewPage(x, width);
      expect(page).toEqual(rounded);

      x = 1;
      width = 0;
      rounded = Math.round(x / width);

      page = _getNewPage(x, width);
      expect(page).toEqual(rounded);
    });

    it('Expect isNewPage to return true on two non identical items', () => {
      const {_shouldUpdateState} = makeUUT();
      expect(_shouldUpdateState(1, 2)).toBe(true);

      expect(_shouldUpdateState(1, 1)).toBe(false);
      expect(_shouldUpdateState(32, 32)).toBe(false);
      expect(_shouldUpdateState(398785, 398785)).toBe(false);
    });

    it('Expect to fill the array without the first two (NUMBER_OF_PAGES)', () => {
      const {_getNexPageItems} = makeUUT();
      let items = ['1', '2', '3'];
      let nextItems = _getNexPageItems(items);

      expect(nextItems).toEqual(['3', undefined, undefined]);

      items = ['1', '2', '3', '4', '5', '6'];
      nextItems = _getNexPageItems(items);
      expect(nextItems).toEqual(['3', '4', '5', '4', '5', '6']);
    });

    it('Expect isFirstPage to return true when page is 0', () => {
      const {_isFirstPage} = makeUUT();
      expect(_isFirstPage(0)).toBe(true);
      expect(_isFirstPage(-1)).toBe(false);
      expect(_isFirstPage(-0)).toBe(true);
      expect(_isFirstPage(993)).toBe(false);
    });

    it('Expect to get first two items twice and and the same size of array', () => {
      const {_getFirstPageItems} = makeUUT();

      let items = ['1', '2', '3', '4', '5', '6', '7'];
      expect(_getFirstPageItems(items)).toEqual(['1', '2', '1', '2', '3', '4', '5']);

      items = [false, false, true, true, true, true, true];
      expect(_getFirstPageItems(items)).toEqual([false, false, false, false, true, true, true]);

      items = [1, 2, 3, 4, 5];
      expect(_getFirstPageItems(items)).toEqual([1, 2, 1, 2, 3]);

      items = ['1'];
      expect(_getFirstPageItems(items)).toEqual(['1']);
      items = [];
      expect(_getFirstPageItems(items)).toEqual([]);
      items = ['1', '2'];
      expect(_getFirstPageItems(items)).toEqual(['1', '2']);
      items = ['1', '2', '3'];
      expect(_getFirstPageItems(items)).toEqual(['1', '2', '1']);
      items = ['1', '2', '3', '4'];
      expect(_getFirstPageItems(items)).toEqual(['1', '2', '1', '2']);

      items = ['1', '2', '3', '4', '5', '6'];
      expect(_getFirstPageItems(items)).toEqual(['1', '2', '1', '2', '3', '4']);
    });
  });

  describe('onMomentumScrollEnd tests suit', () => {
    describe('Merge Arrays', () => {
      it('Expect arrays to be merged after index of (NUMBER_OF_PAGES) from the end', () => {
        const {_mergeArraysFromEnd} = makeUUT();
        const arr = ['1', '2', '3', '4', '5', '6', '7', '8'];
        const newArr = ['10', '11', '12', '13', '14', '15', '16', '17'];

        expect(_mergeArraysFromEnd(arr, newArr)).toEqual(['1', '2', '3', '13', '14', '15', '16', '17']);
      });

      it('Expect arrays to be merged after index of (NUMBER_OF_PAGES) from the end', () => {
        const {_mergeArraysFromEnd} = makeUUT();
        const arr = ['1', '2'];
        const newArr = ['10', '11'];

        expect(_mergeArraysFromEnd(arr, newArr)).toEqual(['1', '2']);
      });

      it('Expect arrays to be merged after index of (NUMBER_OF_PAGES) from the end', () => {
        const {_mergeArraysFromEnd} = makeUUT();
        const arr = ['1'];
        const newArr = ['10', '11'];

        expect(_mergeArraysFromEnd(arr, newArr)).toEqual(['1']);
      });

      it('Expect arrays to be merged after index of (NUMBER_OF_PAGES) from the beginning', () => {
        const {_mergeArraysFromTop} = makeUUT();
        const arr = ['1', '2', '3', '4', '5', '6', '7', '8'];
        const newArr = ['10', '11', '12', '13', '14', '15', '16', '17'];

        expect(_mergeArraysFromTop(arr, newArr)).toEqual(['10', '11', '3', '4', '5', '6', '7', '8']);
      });

      it('Expect arrays to be merged after index of (NUMBER_OF_PAGES) from the beginning', () => {
        const {_mergeArraysFromTop} = makeUUT();
        const arr = ['1', '2'];
        const newArr = ['10', '11'];

        expect(_mergeArraysFromTop(arr, newArr)).toEqual(['10', '11']);
      });
    });
  });
});
