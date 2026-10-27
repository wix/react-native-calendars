import React from 'react';
import {Animated, PanResponder, StyleSheet, ViewStyle} from 'react-native';
import {act, fireEvent, render} from '@testing-library/react-native';
import {CalendarProvider, ExpandableCalendar, ExpandableCalendarProps} from 'react-native-calendars';
import {Positions} from '../index';

type CalendarRef = {toggleCalendarPosition: () => boolean};
type Spring = {
  toValue: number;
  finish: (result: {finished: boolean}) => void;
};

describe('ExpandableCalendar animation lifecycle', () => {
  let springs: Spring[];

  beforeEach(() => {
    jest.useFakeTimers();
    springs = [];
    jest.spyOn(Animated, 'spring').mockImplementation((_value, config) => ({
      start: callback => {
        springs.push({toValue: Number(config.toValue), finish: result => callback?.(result)});
      },
      stop: jest.fn(),
      reset: jest.fn()
    }));
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  const mount = (onCalendarToggled = jest.fn(), props: Partial<ExpandableCalendarProps> = {}) => {
    const ref = React.createRef<CalendarRef>();
    const result = render(
      React.createElement(
        CalendarProvider,
        {
          date: '2026-10-27',
          showTodayButton: false
        },
        React.createElement(ExpandableCalendar, {ref, testID: 'calendar', onCalendarToggled, ...props})
      )
    );
    springs.length = 0;
    return {...result, ref};
  };

  it('ignores additional knob presses until the current height animation finishes', () => {
    const onCalendarToggled = jest.fn();
    const {getByTestId} = mount(onCalendarToggled);
    fireEvent.press(getByTestId('calendar.knob'));
    fireEvent.press(getByTestId('calendar.knob'));
    fireEvent.press(getByTestId('calendar.knob'));
    expect(springs).toHaveLength(1);
    act(() => springs[0].finish({finished: true}));
    expect(onCalendarToggled).toHaveBeenCalledTimes(1);
    expect(onCalendarToggled).toHaveBeenCalledWith(true);
    fireEvent.press(getByTestId('calendar.knob'));
    expect(springs).toHaveLength(2);
    expect(springs[1].toValue).toBeLessThan(springs[0].toValue);
  });

  it('uses the completed position when a consumer toggles again in onCalendarToggled', () => {
    const onCalendarToggled = jest.fn(() => result.ref.current?.toggleCalendarPosition());
    const result = mount(onCalendarToggled);
    fireEvent.press(result.getByTestId('calendar.knob'));
    act(() => springs[0].finish({finished: true}));
    expect(springs).toHaveLength(2);
    expect(springs[1].toValue).toBeLessThan(springs[0].toValue);
  });

  it('also toggles back from the completion callback in vertical mode', () => {
    const onCalendarToggled = jest.fn(() => result.ref.current?.toggleCalendarPosition());
    const result = mount(onCalendarToggled, {horizontal: false});
    fireEvent.press(result.getByTestId('calendar.knob'));
    expect(springs).toHaveLength(2); // header and height
    const opening = springs.find(spring => spring.toValue > 0);
    if (!opening) throw new Error('Opening height spring was not started');
    act(() => opening.finish({finished: true}));
    expect(springs).toHaveLength(4);
    const heights = springs.filter(spring => spring.toValue > 0);
    expect(heights).toHaveLength(2);
    expect(heights[1].toValue).toBeLessThan(heights[0].toValue);
  });

  it('does not report an interrupted animation as a completed toggle', () => {
    const onCalendarToggled = jest.fn();
    const {getByTestId} = mount(onCalendarToggled);
    fireEvent.press(getByTestId('calendar.knob'));
    act(() => springs[0].finish({finished: false}));
    expect(onCalendarToggled).not.toHaveBeenCalled();
    fireEvent.press(getByTestId('calendar.knob'));
    expect(springs).toHaveLength(2);
    expect(springs[1].toValue).toBe(springs[0].toValue);
  });

  it('does not report completion after the calendar unmounts', () => {
    const onCalendarToggled = jest.fn();
    const {getByTestId, unmount} = mount(onCalendarToggled);
    fireEvent.press(getByTestId('calendar.knob'));
    unmount();
    act(() => springs[0].finish({finished: true}));
    expect(onCalendarToggled).not.toHaveBeenCalled();
  });

  it('ignores the interrupted spring when a pan gesture starts a replacement', () => {
    const panResponder = jest.spyOn(PanResponder, 'create');
    const onCalendarToggled = jest.fn();
    const {getByTestId} = mount(onCalendarToggled, {initialPosition: Positions.OPEN});
    const handlers = panResponder.mock.calls[0][0];
    fireEvent.press(getByTestId('calendar.knob'));
    act(() => {
      handlers.onPanResponderMove?.({} as never, {dy: 1000} as never);
      handlers.onPanResponderRelease?.({} as never, {} as never);
    });
    expect(springs).toHaveLength(2);
    act(() => springs[0].finish({finished: false}));
    expect(onCalendarToggled).not.toHaveBeenCalled();
    act(() => springs[1].finish({finished: true}));
    expect(onCalendarToggled).toHaveBeenCalledTimes(1);
    expect(onCalendarToggled).toHaveBeenCalledWith(true);
  });

  it('reveals the week overlay only when the closing spring finishes', () => {
    const {getByTestId} = mount(jest.fn(), {initialPosition: Positions.OPEN});
    let wrapper = getByTestId('calendar.weekCalendar.list');
    while (
      !wrapper.instance?.setNativeProps ||
      StyleSheet.flatten<ViewStyle>(wrapper.props.style)?.position !== 'absolute'
    ) {
      const parent = wrapper.parent;
      if (!parent) throw new Error('Week overlay native view was not found');
      wrapper = parent;
    }
    const nativeProps = wrapper.instance.setNativeProps as jest.Mock;
    nativeProps.mockClear();
    fireEvent.press(getByTestId('calendar.knob'));
    expect(nativeProps.mock.calls.some(([props]) => props.style?.opacity === 1)).toBe(false);
    act(() => springs[0].finish({finished: true}));
    expect(nativeProps.mock.calls.some(([props]) => props.style?.opacity === 1)).toBe(true);
  });
});
