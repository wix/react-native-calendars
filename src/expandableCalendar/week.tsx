import isEqual from 'lodash/isEqual';
import React, {useCallback, useMemo, useRef} from 'react';
import {View} from 'react-native';
import type {CalendarProps} from '../calendar';
import Day from '../calendar/day/index';
import {extractDayProps} from '../componentUpdater';
import {
  type CalendarsDate,
  getCurrentDate,
  getDate,
  getPartialWeekDates,
  getWeekDates,
  parseDate,
  sameMonth,
  toMarkingFormat
} from '../dateutils';
import {getState} from '../day-state-manager';
import type {CalendarContextProps} from './Context';
import styleConstructor from './style';

export type WeekProps = CalendarProps & {
  context?: CalendarContextProps;
};

function arePropsEqual(prevProps: WeekProps, nextProps: WeekProps) {
  const {context: prevContext, markedDates: prevMarkings, ...prevOthers} = prevProps;
  const {context: nextContext, markedDates: nextMarkings, ...nextOthers} = nextProps;

  return isEqual(prevContext, nextContext) && isEqual(prevMarkings, nextMarkings) && isEqual(prevOthers, nextOthers);
}

const Week = React.memo((props: WeekProps) => {
  const {
    theme,
    current,
    firstDay,
    hideExtraDays,
    markedDates,
    onDayPress,
    onDayLongPress,
    style: propsStyle,
    numberOfDays = 1,
    timelineLeftInset,
    testID
  } = props;
  const style = useRef(styleConstructor(theme));

  const disableDaySelection = useMemo(() => {
    return !!numberOfDays && numberOfDays > 1;
  }, [numberOfDays]);

  const getWeek = useCallback(
    (date?: string) => {
      if (date) {
        return getWeekDates(date, firstDay);
      }
    },
    [firstDay]
  );

  const partialWeekStyle = useMemo(() => {
    return [style.current.partialWeek, {paddingLeft: timelineLeftInset}];
  }, [timelineLeftInset]);

  const dayProps = extractDayProps(props);
  const currDate = useMemo(() => parseDate(current), [current]);

  const renderDay = (day: CalendarsDate, id: number) => {
    // hide extra days
    if (current && hideExtraDays) {
      if (!sameMonth(day, currDate)) {
        return <View key={id} style={style.current.emptyDayContainer} />;
      }
    }
    const dayString = toMarkingFormat(day);

    return (
      <View style={style.current.dayContainer} key={id}>
        <Day
          {...dayProps}
          testID={`${testID}.day_${dayString}`}
          date={dayString}
          state={getState(day, currDate, props, disableDaySelection)}
          marking={
            disableDaySelection ? {...markedDates?.[dayString], disableTouchEvent: true} : markedDates?.[dayString]
          }
          onPress={onDayPress}
          onLongPress={onDayLongPress}
        />
      </View>
    );
  };

  const renderWeek = () => {
    const dates = numberOfDays > 1 ? getPartialWeekDates(current, numberOfDays) : getWeek(current);
    const week: JSX.Element[] = [];

    if (dates) {
      const todayIndex = dates?.indexOf(parseDate(getCurrentDate()) as CalendarsDate & string) || -1;
      const sliced = dates.slice(todayIndex, numberOfDays);
      const datesToRender = numberOfDays > 1 && todayIndex > -1 ? sliced : dates;
      datesToRender.forEach((day: CalendarsDate | string, id: number) => {
        const d = getDate(day);
        week.push(renderDay(d, id));
      }, this);
    }

    return week;
  };

  return (
    <View style={style.current.container} testID={`${testID}.week_${current}`}>
      <View style={[style.current.week, numberOfDays > 1 ? partialWeekStyle : undefined, propsStyle]}>
        {renderWeek()}
      </View>
    </View>
  );
}, arePropsEqual);

export default Week;

Week.displayName = 'Week';
