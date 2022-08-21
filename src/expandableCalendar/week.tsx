import XDate from 'xdate';
import React, {useRef, useMemo, useCallback} from 'react';
import {View, Text, StyleProp, TextStyle} from 'react-native';

import {getPartialWeekDates, getWeekDates, sameMonth} from '../dateutils';
import {parseDate, toMarkingFormat} from '../interface';
import {getState} from '../day-state-manager';
import {extractDayProps} from '../componentUpdater';
import styleConstructor from './style';
import Calendar, {CalendarProps} from '../calendar';
import Day from '../calendar/day/index';
import {textDisabledColor} from '../style';


export type WeekProps = CalendarProps & {visible?: boolean};

const Week = (props: WeekProps) => {
  const {theme, current, firstDay, hideExtraDays, markedDates, onDayPress, onDayLongPress, style: propsStyle, numberOfDays = 1, timelineLeftInset, visible = true} = props;
  const style = useRef(styleConstructor(theme));
  const getWeek = useCallback((date?: string) => {
    if (date) {
      return getWeekDates(date, firstDay);
    }
  }, [firstDay]);

  const partialWeekStyle = useMemo(() => {
    return [style.current.partialWeek, {paddingLeft: timelineLeftInset}];
  }, [timelineLeftInset]);

  const dayProps = extractDayProps(props);
  const currXdate = parseDate(current);

  const renderDay = (day: XDate, id: number) => {
    // hide extra days
    if (current && hideExtraDays) {
      if (!sameMonth(day, currXdate)) {
        return <View key={id} style={style.current.emptyDayContainer}/>;
      }
    }

    return (
      <View style={style.current.dayContainer} key={id}>
        <Day
          {...dayProps}
          date={toMarkingFormat(day)}
          state={getState(day, currXdate, props)}
          marking={markedDates?.[toMarkingFormat(day)]}
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
      const todayIndex = dates?.indexOf(parseDate(new Date())) || -1;
      const sliced = dates.slice(todayIndex, numberOfDays);
      const datesToRender = numberOfDays > 1 && todayIndex > -1 ? sliced : dates;
      datesToRender.forEach((day: XDate | string, id: number) => {
        const d = day instanceof XDate ? day : new XDate(day);
        week.push(renderDay(d, id));
      }, this);
    }

    return week;
  };

  const datesOfWeek = useMemo(() => {
    if (current) {
      const day = new XDate(current);
      const dayOffset = day.getDay() - (firstDay ?? 0);
      return [...Array(7).keys()].map(index => day.clone().addDays(index - dayOffset).getDate())
        .map(date => (
          <Text allowFontScaling={false} style={dummyDayStyle} key={date}>
            {date}
          </Text>
        ));
    }
    return [];
  }, [firstDay, current]);

  if(!visible) {
    return (
      <View style={style.current.container}>
        <View style={[style.current.week, numberOfDays > 1 ? partialWeekStyle : undefined, propsStyle]}>
          {datesOfWeek}
        </View>
      </View>
    );
  }

  return (
    <View style={style.current.container}>
      <View style={[style.current.week, numberOfDays > 1 ? partialWeekStyle : undefined, propsStyle]}>{renderWeek()}</View>
    </View>
  );
};

export default Week;

const dummyDayStyle: StyleProp<TextStyle> = {
  marginTop: 2,
  fontSize: 18,
  fontFamily: 'HelveticaNeue',
  fontWeight: '500',
  color: textDisabledColor,
  backgroundColor: 'white',
};

Week.displayName = 'Week';
Week.propTypes = {
  ...Calendar.propTypes
};
