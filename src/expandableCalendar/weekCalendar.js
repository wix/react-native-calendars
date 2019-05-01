import _ from 'lodash';
import React, {Component} from 'react';
import {
  Dimensions,
  View,
  FlatList
} from 'react-native';
import PropTypes from 'prop-types';
import XDate from 'xdate';

import dateutils from '../dateutils';
import {xdateToData, parseDate} from '../interface';
import {SELECT_DATE_SLOT} from '../testIDs';
import styleConstructor from './style';

import Day from '../calendar/day/basic';
import UnitDay from '../calendar/day/period';
import MultiDotDay from '../calendar/day/multi-dot';
import MultiPeriodDay from '../calendar/day/multi-period';
import SingleDay from '../calendar/day/custom';
import CalendarHeader from '../calendar/header';
import shouldComponentUpdate from '../calendar/updater';
import Calendar from '../calendar';


const EmptyArray = [];
const SCREEN_WIDTH = Dimensions.get('window').width;
const PAST_SCROLL_RANG = 1;
const FUTURE_SCROLL_RANG = 1;

class WeekCalendar extends Component {
  static propTypes = {
    ...Calendar.propTypes,
    pastScrollRange: PropTypes.number,
    futureScrollRange: PropTypes.number
  };

  static defaultProps = {
    pastScrollRange: PAST_SCROLL_RANG,
    futureScrollRange: FUTURE_SCROLL_RANG
  }

  constructor(props) {
    super(props);
    this.style = styleConstructor(this.props.theme);
    this.shouldComponentUpdate = shouldComponentUpdate;

    const currentDate = parseDate(props.current) || XDate();
    const months = this.getMonths(currentDate);
    this.state = {
      currentDate: currentDate,
      // currentMonth: currentDate,
      monthsMap: months,
      rows: this.getWeeksArray(months)
    };
    this.currentMonth = currentDate;
    this.initialScrollIndex = this.getRowIndex(currentDate);


    this.currentWeek = this.getWeekNumberInMonth(this.props.current || XDate());
  }

  componentWillReceiveProps(nextProps) {
    const current = parseDate(nextProps.current);
    if (current && current.toString('yyyy MM') !== this.state.currentDate.toString('yyyy MM')) {
      this.setState({
        currentDate: current.clone()
      });
    }
  }

  /** Header */

  addMonth = (count) => {
    // this.updateWeek(count);
    // this.updateMonth(this.state.currentDate.clone().addMonths(count, true));
  }

  triggerListeners(doNotTriggerListeners) {
    if (!doNotTriggerListeners) {
      const currMont = this.state.currentDate.clone();
      if (this.props.onMonthChange) {
        this.props.onMonthChange(xdateToData(currMont));
      }
      if (this.props.onVisibleMonthsChange) {
        this.props.onVisibleMonthsChange([xdateToData(currMont)]);
      }
    }
  }

  updateMonth = (day, doNotTriggerListeners) => {
    if (day.toString('yyyy MM') === this.state.currentDate.toString('yyyy MM')) {
      return;
    }
    
    this.setState({
      currentDate: day.clone()
    }, () => {
      this.triggerListeners(doNotTriggerListeners);
    });
  }

  updateWeek(count) {
    const currentDate = this.state.currentDate.clone();
    const weeksCount = this.getNumberOfWeeksInMonth(currentDate);
    const destination = this.currentWeek + count;
    const nextMonth = count > 0 && destination === weeksCount;
    const preMonth = count < 0 && destination < 0;
    
    if (this.scrollView && !preMonth && !nextMonth) {
      // this.currentWeek = destination;
      this.scrollView.scrollTo({x: SCREEN_WIDTH * destination, y: 0, animated: true});
    } else {
      
      if (count > 0) {
        // this.currentWeek = 0;
        this.scrollView.scrollTo({x: 0, y: 0, animated: false});
      } else {
        setTimeout(() => {
          // called before this.state.currentDate updates so need a weeksCount for the new current month and scrollTo() after re-render
          // const date = XDate(currentDate);
          // date.setMonth(XDate(currentDate).getMonth() - 1);
          // const weeksCount = this.getNumberOfWeeksInMonth(date);
          // this.currentWeek = weeksCount - 1;
          
          this.scrollView.scrollToEnd();
        }, 0);
      } 
      this.updateMonth(currentDate.addMonths(count, true));
    }
  }

  /** Scroll */

  // onScroll = (event) => {
  //   const offsetX = event.nativeEvent.contentOffset.x;
  //   const week = offsetX / SCREEN_WIDTH;
  //   this.currentWeek = Math.ceil(week); // IMPORTANT!!!
  //   // console.warn('INBAL onScroll currentWeek: ', this.currentWeek);
  // }

  // onScrollBeginDrag = () => {
  //   // console.warn('INBAL BEGIN drag');
  // }

  // onScrollEndDrag = () => {
  //   // console.warn('INBAL END drag');
  // }

  /** Utils */
  
  getWeekNumberInMonth(month) {
    const day = this.getDate();
    const days = dateutils.page(month, this.props.firstDay);
    const currentWeekNumber = days[days.length - 1].getWeek();
    const firstWeekNumber = days[days.length - 1 - day].getWeek();
    return currentWeekNumber - firstWeekNumber;
  }

  getDate() {
    return this.props.current ? XDate(this.props.current).getDate() : XDate().getDate();
  }

  getNumberOfWeeksInMonth(month) {
    const days = dateutils.page(month, this.props.firstDay);
    return days.length / 7;
  }
  
  /** Day */

  handleDayInteraction(date, interaction) {
    const day = parseDate(date);
    const minDate = parseDate(this.props.minDate);
    const maxDate = parseDate(this.props.maxDate);
    if (!(minDate && !dateutils.isGTE(day, minDate)) && !(maxDate && !dateutils.isLTE(day, maxDate))) {
      const shouldUpdateMonth = this.props.disableMonthChange === undefined || !this.props.disableMonthChange;
      if (shouldUpdateMonth) {
        this.updateMonth(day);
      }
      if (interaction) {
        interaction(xdateToData(day));
      }
    }
  }

  pressDay = (date) => {
    this.handleDayInteraction(date, this.props.onDayPress);
  }

  longPressDay = (date) => {
    this.handleDayInteraction(date, this.props.onDayLongPress);
  }
  
  renderDay(day, id) {
    // const {currentMonth} = this.state;
    const minDate = parseDate(this.props.minDate);
    const maxDate = parseDate(this.props.maxDate);
    let state = '';
    if (this.props.disabledByDefault) {
      state = 'disabled';
    } else if ((minDate && !dateutils.isGTE(day, minDate)) || (maxDate && !dateutils.isLTE(day, maxDate))) {
      state = 'disabled';
    // } else if (!dateutils.sameMonth(day, currentMonth)) { // for extra days
    //   state = 'disabled';
    } else if (dateutils.sameDate(day, XDate())) {
      state = 'today';
    }

    // hide extra days
    // if (!dateutils.sameMonth(day, currentMonth) && this.props.hideExtraDays) {
    //   return (<View key={id} style={{flex: 1}}/>);
    // }

    const DayComp = this.getDayComponent();
    const date = day.getDate();
    const dateAsObject = xdateToData(day);

    return (
      <View style={{flex: 1, alignItems: 'center'}} key={id}>
        <DayComp
          testID={`${SELECT_DATE_SLOT}-${dateAsObject.dateString}`}
          state={state}
          theme={this.props.theme}
          onPress={this.pressDay}
          onLongPress={this.longPressDay}
          date={dateAsObject}
          marking={this.getDateMarking(day)}
        >
          {date}
        </DayComp>
      </View>
    );
  }

  getDayComponent() {
    if (this.props.dayComponent) {
      return this.props.dayComponent;
    }

    switch (this.props.markingType) {
    case 'period':
      return UnitDay;
    case 'multi-dot':
      return MultiDotDay;
    case 'multi-period':
      return MultiPeriodDay;
    case 'custom':
      return SingleDay;
    default:
      return Day;
    }
  }

  getDateMarking(day) {
    if (!this.props.markedDates) {
      return false;
    }
    const dates = this.props.markedDates[day.toString('yyyy-MM-dd')] || EmptyArray;
    if (dates.length || dates) {
      return dates;
    } else {
      return false;
    }
  }

  /** Week */

  // renderWeekNumber (weekNumber) {
  //   return <Day key={`week-${weekNumber}`} theme={this.props.theme} marking={{disableTouchEvent: true}} state='disabled'>{weekNumber}</Day>;
  // }

  // renderWeek(days, id) {
  //   const week = [];
  //   days.forEach((day, id2) => {
  //     week.push(this.renderDay(day, id2));
  //   }, this);
    
  //   if (this.props.showWeekNumbers) {
  //     week.unshift(this.renderWeekNumber(days[days.length - 1].getWeek()));
  //   }

  //   return (
  //     <View style={this.style.week} key={id}>{week}</View>
  //   );
  // }

  // renderMonth(date) {
  //   const days = dateutils.page(date, this.props.firstDay);
  //   const weeks = [];
  //   while (days.length) {
  //     weeks.push(this.renderWeek(days.splice(0, 7), weeks.length));
  //   }

  //   return (
  //     <View style={[this.style.monthView, {flexDirection: 'row', width: weeks.length * SCREEN_WIDTH}]}>{weeks}</View>
  //   );
  // }

  getWeeksArray(months) {
    const monthsArray = Object.values(months);
    return _.flatten(monthsArray);
  }
  getMonths(date) {
    const monthsInWeeks = {};
    for (let i = 0; i <= this.props.pastScrollRange + this.props.futureScrollRange; i++) {
      const range = date.clone().addMonths(i - this.props.pastScrollRange, true);
      const obj = this.getMonth(range);
      monthsInWeeks[Object.keys(obj)[0]] = Object.values(obj)[0];
    }
    return monthsInWeeks; //map - {{monthName: [[days], [days], [days]]}, {monthName: [[days], [days], [days]]}, {monthName: [[days], [days], [days]]}}
  }
  getMonth(date) {
    const monthWeeks = this.getWeeks(date);
    this.removeWeekDuplications(monthWeeks);
    const obj = {};
    const monthName = date.toString('MMMM yyyy');
    obj[monthName] = monthWeeks;
    return obj;
  }
  getWeeks(date) {
    const days = dateutils.page(date, this.props.firstDay);
    const weeks = [];
    while (days.length) {
      weeks.push(days.splice(0, 7));
    }
    return weeks; //array - [[days], [days], ...]
  }
  removeWeekDuplications(weeks) {
    const lastWeek = weeks[weeks.length - 1];
    const currentMonth = lastWeek[0].getMonth();
    let removeLast = false;
    lastWeek.forEach(day => {
      const month = day.getMonth();
      if (month !== currentMonth) {
        removeLast = true;
        return;
      }
    });
    if (removeLast) {
      weeks.pop();
    }
  }

  getMonthName(date) {
    return XDate(date).toString('MMMM yyyy');
  }
  getMonthWeeks(date) {
    return this.state.monthsMap[this.getMonthName(date)];
  }

  /** Rows */

  getRowIndex(date) {
    let i;
    const array = this.state.rows;
    array.forEach((row, index) => {
      row.forEach(day => {
        if (dateutils.sameDate(day, date)) {
          i = index;
          return;
        }
      });
      if (i !== undefined) return;
    });
    return i;
  }

  /** Month */

  updateCurrentMonth(visibleWeek) {
    const preMonth = this.currentMonth.clone().addMonths(-1, true);
    const preMonthWeeks = this.getMonthWeeks(preMonth);
    const nextMonth = this.currentMonth.clone().addMonths(1, true);
    const nextMonthWeeks = this.getMonthWeeks(nextMonth);
    if (nextMonthWeeks) {
      if (nextMonthWeeks[0] === visibleWeek) {
        console.warn('INBAL new month: ', this.getMonthName(nextMonth));
        // this.setState({currentMonth: nextMonth});
        this.currentMonth = nextMonth;
      } else if (preMonthWeeks) {
        if (preMonthWeeks[preMonthWeeks.length - 1] === visibleWeek) {
          console.warn('INBAL new month: ', this.getMonthName(preMonth));
          // this.setState({currentMonth: preMonth});
          this.currentMonth = preMonth;
        }
      } else {
        console.warn('INBAL LOAD PRE MONTH!');
        this.updateRows(preMonth, false);
      }
    } else {
      console.warn('INBAL LOAD NEXT MONTH!');
      this.updateRows(nextMonth, true);
    }
  }

  updateRows(month, next) {
    const obj = this.getMonth(month);
    let newMap = {};
    if (next) {
      newMap = this.state.monthsMap;
      newMap[Object.keys(obj)[0]] = Object.values(obj)[0];
    } else {
      const newObj = {};
      newObj[Object.keys(obj)[0]] = Object.values(obj)[0];
      newMap = Object.assign(newObj, this.state.monthsMap);
    }
    // Not Updating Rows!!! Rows are updated only on the next setState!!!
    this.setState({monthsMap: newMap, rows: [...this.state.rows, ...Object.values(obj)[0]]}, () => { // this.getWeeksArray(newMap)
      console.log('INBAL this.state.newMap: ', this.state.monthsMap);
      console.log('INBAL this.state.rows: ', this.state.rows);
      // if (!next) {
        // Need to update the scroll position when adding items to the beginning of the rows array!!!
      //   this.scrollToWeek(this.visibleWeek);
      // }
    });
  }
  scrollToWeek(date) {
    let to = date;
    if (Array.isArray(date)) {
      to = date[0];
    }
    const index = this.getRowIndex(to);
    if (this.flatList && this.state.rows.length > index) {
      this.flatList.scrollToIndex(index);
    }
  }

  /** Renders */

  renderRow = ({item, index}) => {
    console.warn('INBAL render row: ', item);
    const week = [];
    item.forEach((day, id) => {
      week.push(this.renderDay(day, id));
    }, this);
    
    // if (this.props.showWeekNumbers) {
    //   week.unshift(this.renderWeekNumber(item[item.length - 1].getWeek()));
    // }

    return (
      <View style={[this.style.week, {width: SCREEN_WIDTH}]} key={index}>{week}</View>
    );
  }

  renderContent() {
    return (
      <FlatList
        ref={r => this.flatList = r}
        style={[this.style.container, this.props.style]}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        // removeClippedSubviews
        data={this.state.rows}
        renderItem={this.renderRow}
        keyExtractor={(item, index) => String(item[0])}
        initialScrollIndex={this.initialScrollIndex}
        getItemLayout={this.getItemLayout}
        onViewableItemsChanged={this.onViewableItemsChanged}
        onLayout={this.onLayout}
        // onEndReached={this.onEndReached}
        // onEndReachedThreshold={0.9}
        // initialNumToRender={1}
      />
    );
  }

  getItemLayout = (data, index) => {
    return {length: SCREEN_WIDTH, offset: SCREEN_WIDTH  * index, index};
  }

  onLayout = (event) => {
    // console.warn('INBAL onLayout: ', event);
  }

  // onEndReached = () => {
  //   console.warn('INBAL onEndReached');
  //   this.updateCurrentMonth(this.visibleWeek);
  // }

  onViewableItemsChanged = ({viewableItems}) => {
    // console.warn('INBAL onViewableItemsChanged: ', viewableItems[0].item);
    this.visibleWeek = viewableItems[0].item;
    this.updateCurrentMonth(this.visibleWeek);
  }

  render() {
    let indicator;
    const current = parseDate(this.props.current);
    if (current) {
      const lastMonthOfDay = current.clone().addMonths(1, true).setDate(1).addDays(-1).toString('yyyy-MM-dd');
      if (this.props.displayLoadingIndicator &&
          !(this.props.markedDates && this.props.markedDates[lastMonthOfDay])) {
        indicator = true;
      }
    }

    return (
      <View style={[this.style.container, this.props.style]}>
        <CalendarHeader
          theme={this.props.theme}
          hideArrows={this.props.hideArrows}
          month={this.state.currentDate}
          addMonth={this.addMonth}
          showIndicator={indicator}
          firstDay={this.props.firstDay}
          renderArrow={this.props.renderArrow}
          monthFormat={this.props.monthFormat}
          hideDayNames={this.props.hideDayNames}
          weekNumbers={this.props.showWeekNumbers}
          onPressArrowLeft={this.props.onPressArrowLeft}
          onPressArrowRight={this.props.onPressArrowRight}
        />
        {this.renderContent()}
      </View>);
  }
}

export default WeekCalendar;
