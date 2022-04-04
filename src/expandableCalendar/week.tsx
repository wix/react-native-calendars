import XDate from 'xdate';
import React, {useRef} from 'react';
import {View} from 'react-native';

import {getWeekDates, sameMonth} from '../dateutils';
import {parseDate, toMarkingFormat} from '../interface';
import {getState} from '../day-state-manager';
import {extractComponentProps} from '../componentUpdater';
import styleConstructor from './style';
import Calendar, {CalendarProps} from '../calendar';
import Day from '../calendar/day/index';
// import BasicDay from '../calendar/day/basic';


export type WeekProps = CalendarProps;

const Week = (props: WeekProps) => {
  const {theme, current, firstDay, hideExtraDays, markedDates, onDayPress, style: propsStyle} = props;
  const style = useRef(styleConstructor(theme));

  const getWeek = (date?: string) => {
    if (date) {
      return getWeekDates(date, firstDay);
    }
  };

  // renderWeekNumber (weekNumber) {
  //   return <BasicDay key={`week-${weekNumber}`} theme={this.props.theme} marking={{disableTouchEvent: true}} state='disabled'>{weekNumber}</BasicDay>;
  // }

  const renderDay = (day: XDate, id: number) => {
    const dayProps = extractComponentProps(Day, props);
    const currXdate = parseDate(current);
    
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
          onLongPress={onDayPress}
        />
      </View>
    );
  };

  const renderWeek = () => {
    const dates = getWeek(current);
    const week: any[] = [];
  
    if (dates) {
      dates.forEach((day: XDate, id: number) => {
        week.push(renderDay(day, id));
      }, this);
    }
  
    // if (this.props.showWeekNumbers) {
    //   week.unshift(this.renderWeekNumber(item[item.length - 1].getWeek()));
    // }
    
    return week;
  };

  return (
    <View style={style.current.container}>
      <View style={[style.current.week, propsStyle]}>{renderWeek()}</View>
    </View>
  );
};

export default Week;

Week.displayName = 'Week';
Week.propTypes = {
  ...Calendar.propTypes
};
