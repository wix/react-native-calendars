import {Map} from 'immutable';

import React, {LegacyRef, useState, useCallback, useMemo} from 'react';
import {View, NativeSyntheticEvent, NativeScrollEvent, StyleProp, ViewStyle} from 'react-native';
import {FlashList} from '@shopify/flash-list';

import {extractCalendarProps} from '../../componentUpdater';
import {sameWeek} from '../../dateutils';
import {DateData} from '../../types';
import styleConstructor from '../style';
import asCalendarConsumer from '../asCalendarConsumer';
import {CalendarListProps} from '../../calendar-list';
import WeekDaysNames from '../../commons/WeekDaysNames';
import Week from '../week';
import Presenter from './presenter';
import constants from '../../commons/constants';

const NUMBER_OF_PAGES = 2; // must be a positive number

export interface WeekCalendarProps extends CalendarListProps {
  /** whether to have shadow/elevation for the calendar */
  allowShadow?: boolean;
  context?: any;
}

/**
 * @description: Week calendar component
 * @note: Should be wrapped with 'CalendarProvider'
 * @example: https://github.com/wix/react-native-calendars/blob/master/example/src/screens/expandableCalendar.js
 */
const WeekCalendar = (props: WeekCalendarProps) => {
  const {calendarWidth, firstDay, hideDayNames, current, markedDates, allowShadow, context, theme, style} = props;
  const defaultStyle = useMemo(() => styleConstructor(theme), [theme]);
  const presenter = new Presenter();
  let page = NUMBER_OF_PAGES;
  const [items, setItems] = useState(presenter.getDatesArray(props));
  const {dayHeader} = defaultStyle;

  const containerWidth = useMemo(() => {
    return calendarWidth || constants.screenWidth;
  }, [calendarWidth]);

  const onDayPressCallback = useCallback((value: DateData) => {
    presenter.onDayPress(context, value);
  }, [context]);

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = event.nativeEvent.contentOffset.x;
    const {onScroll} = presenter;
    const {context} = props;

    const updateState = (newData: string[], newPage: number) => {
      page = newPage;
      setItems([...newData]);
    };

    onScroll({context, updateState, x, page, items, width: containerWidth});
  };

  const getWeekStyle = useMemo(() => {
    return [{containerWidth}, style] as StyleProp<ViewStyle>;
  }, [containerWidth, style]);

  const onMomentumScrollEnd = () => {
    const {onMomentumScrollEnd} = presenter;

    const updateItems = (items: string[]) => {
      setTimeout(() => {
        setItems([...items]);
      }, 100);
    };

    onMomentumScrollEnd({items, props, page, updateItems});
  };
  const renderItem = useCallback(({item}: {item: string}) => {
    const {allowShadow, context, ...calendarListProps} = props;
    const {style, onDayPress = onDayPressCallback, firstDay = 0, ...others} = extractCalendarProps(calendarListProps);

    const isSameWeek = sameWeek(item, context.date, firstDay);
    const currentContext = isSameWeek ? context : undefined;

    return (
      <Week
        {...others}
        key={item}
        current={item}
        firstDay={firstDay}
        style={getWeekStyle}
        markedDates={markedDates}
        onDayPress={onDayPress}
        context={currentContext}
        numberOfDays={context.numberOfDays}
        timelineLeftInset={context.timelineLeftInset}
      />
    );
  },[]);

  const keyExtractor = useCallback((_, index: number) => index.toString(), []);

  const renderWeekDaysNames = useMemo(() => {
    return (
      <WeekDaysNames
        firstDay={firstDay}
        style={dayHeader}
      />
    );
  },[firstDay, dayHeader]);

  const extraData = Map({
    current,
    date: context.date,
    firstDay
  });

  return (
    <View
      testID={props.testID}
      style={[allowShadow && defaultStyle.containerShadow, !hideDayNames && defaultStyle.containerWrapper]}
    >
      {!hideDayNames && (
        <View style={[defaultStyle.week, defaultStyle.weekCalendar]}>
          {renderWeekDaysNames}
        </View>
      )}
          <FlashList
            ref={presenter.list as unknown as LegacyRef<FlashList<string>>}
            data={items}
            extraData={extraData}
            contentContainerStyle={defaultStyle.container}
            horizontal
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            scrollEnabled
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            initialScrollIndex={NUMBER_OF_PAGES}
            onScroll={onScroll}
            onMomentumScrollEnd={onMomentumScrollEnd}
            estimatedItemSize={30}
          />
    </View>
  );
};

WeekCalendar.displayName = 'WeekCalendar';
WeekCalendar.defaultProps = {
  firstDay: 0,
  allowShadow: true
};

function shouldUpdate(prevProps: WeekCalendarProps, nextProps: WeekCalendarProps) {
  const {shouldComponentUpdate} = new Presenter();
  if (shouldComponentUpdate(nextProps.context, prevProps.context)) {
    if (!sameWeek(nextProps.context?.date, prevProps.context?.date, nextProps.firstDay ?? 0)) {
      return true;
    }
  }
  return false;
}

export default React.memo(asCalendarConsumer<WeekCalendarProps>(WeekCalendar, true), shouldUpdate);
