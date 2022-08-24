import XDate from 'xdate';
// import {UpdateSources} from '../commons';
import {toMarkingFormat} from '../../interface';
import {
  getButtonIcon,
  // setDate,
  // setDisabled,
  shouldAnimateTodayButton,
  getPositionAnimation,
  getOpacityAnimation,
  getTodayDate,
  getTodayFormatted
} from './Presenter';

describe('Context provider tests', () => {
  const pastDate = '2021-04-04';
  const futureDate = '2050-04-04';
  const todayDate = toMarkingFormat(XDate());
  // const updateSources = UpdateSources.CALENDAR_INIT;

  describe('Button Icon test', () => {
    it('Expect to get down button on past date', () => {
      const imageUp = '../../../src/img/up.png';
      const imageDown = '../../../src/img/down.png';

      expect(getButtonIcon(pastDate, true)).toEqual({testUri: imageDown});
      expect(getButtonIcon(futureDate, true)).toEqual({testUri: imageUp});
    });

    it('Expect no image when showTodayButton is false', () => {
      expect(getButtonIcon(pastDate, false)).toBe(undefined);
    });
  });

  // describe('Set Date test suit', () => {
  //   const onDateChanged = jest.fn();
  //   const onMonthChange = jest.fn();
  //   const updateState = jest.fn();

  //   afterEach(() => {
  //     jest.resetAllMocks();
  //   });

  //   it('Expect onDataChanged and updateState to be called on same months dates passed', () => {
  //     const date = '2021-01-01';
  //     const sameMonthDate = '2021-01-20';
  //     const props = {onDateChanged, onMonthChange, showTodayButton: false};

  //     setDate(props, date, sameMonthDate, updateState, updateSources);

  //     expect(updateState).toBeCalled();
  //     expect(onDateChanged).toBeCalledWith(date, updateSources);
  //     expect(onMonthChange).not.toBeCalled();
  //   });

  //   it('Expect onMonthChange to be called when different months date passed', () => {
  //     const date = '2021-01-01';
  //     const differentMonth = '2021-02-20';
  //     const props = {onDateChanged, onMonthChange, showTodayButton: false};

  //     setDate(props, date, differentMonth, updateState, updateSources);

  //     expect(updateState).toBeCalled();
  //     expect(onDateChanged).toBeCalledWith(date, updateSources);
  //     expect(onMonthChange).toBeCalled();
  //   });
  // });

  // describe('Set Disabled test suit', () => {
  //   it('Expect setDisabled would not call updateState when showTodayButton', () => {
  //     const updateStateMock = jest.fn();
  //     const showTodayButton = false;

  //     setDisabled(showTodayButton, false, true, updateStateMock);
  //     expect(updateStateMock).not.toBeCalled();
  //   });

  //   it('Expect setDisabled will call updateState when showTodayButton is true and disabled value changed', () => {
  //     const updateStateMock = jest.fn();
  //     const showTodayButton = true;

  //     setDisabled(showTodayButton, false, true, updateStateMock);
  //     expect(updateStateMock).toBeCalledWith(false);

  //     setDisabled(showTodayButton, true, false, updateStateMock);
  //     expect(updateStateMock).toBeCalledWith(true);
  //   });

  //   it('Expect setDisabled will NOT call updateState when showTodayButton is true and disabled value is the same', () => {
  //     const updateStateMock = jest.fn();
  //     const showTodayButton = true;

  //     setDisabled(showTodayButton, true, true, updateStateMock);
  //     expect(updateStateMock).not.toBeCalled();

  //     setDisabled(showTodayButton, false, false, updateStateMock);
  //     expect(updateStateMock).not.toBeCalled();
  //   });
  // });

  describe("Animate Today's Button", () => {
    it('Expect shouldAnimateTodayButton to return same value as props.showTodayButton', () => {
      expect(shouldAnimateTodayButton({showTodayButton: false})).toBe(false);
      expect(shouldAnimateTodayButton({showTodayButton: true})).toBe(true);
    });

    it("Expect animation value to be top position when today's date passed", () => {
      const TOP_POSITION = 65;
      const {tension, friction, useNativeDriver} = getPositionAnimation(todayDate, 10);

      expect(tension).toEqual(30);
      expect(friction).toEqual(8);
      expect(useNativeDriver).toBe(true);
      expect(getPositionAnimation(todayDate, 10).toValue).toEqual(TOP_POSITION);
    });

    it('Expect animation value to be minus value of bottomMargin when past or future date passed', () => {
      const TOP_POSITION = 65;

      expect(getPositionAnimation(futureDate, 999).toValue).toEqual(-999);
      expect(getPositionAnimation(pastDate, 999).toValue).toEqual(-999);
      expect(getPositionAnimation(pastDate, 0).toValue).toEqual(-TOP_POSITION);
      expect(getPositionAnimation(pastDate, -22).toValue).toEqual(22);
    });

    it('Expect opacity animation value', () => {
      const disabledOpacity = 0.5;
      let data = getOpacityAnimation({disabledOpacity}, true);

      expect(data.toValue).toBe(0.5);

      data = getOpacityAnimation({disabledOpacity}, false);
      expect(data.toValue).toBe(1);

      expect(data.duration).toEqual(500);
      expect(data.useNativeDriver).toBe(true);
    });
  });

  describe('onTodayPressed tests', () => {
    it("Expect return value to be XDate today's date", () => {
      expect(getTodayDate()).toEqual(todayDate);
    });
  });

  it("Today's date formatted", () => {
    expect(getTodayFormatted()).toEqual('Today');
  });
});
