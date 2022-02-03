<<<<<<< HEAD:src/calendar/index.js
import _ from 'lodash';
=======
>>>>>>> 115f18741ed6f1e9a22d7ebe2115e091b3d204ca:src/calendar/index.tsx
import PropTypes from 'prop-types';
import XDate from 'xdate';
import memoize from 'memoize-one';

import React, {Component} from 'react';
<<<<<<< HEAD:src/calendar/index.js
import {View} from 'react-native';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';

import dateutils from '../dateutils';
import {xdateToData, parseDate, toMarkingFormat} from '../interface';
import {getState} from '../day-state-manager';
// import shouldComponentUpdate from './updater';
import {extractComponentProps} from '../component-updater';
import {WEEK_NUMBER} from '../testIDs';
=======
import {View, ViewStyle, StyleProp} from 'react-native';
// @ts-expect-error
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';

import {page, isGTE, isLTE, sameMonth} from '../dateutils';
import {xdateToData, parseDate, toMarkingFormat} from '../interface';
import {getState} from '../day-state-manager';
import {extractComponentProps} from '../componentUpdater';
// @ts-expect-error
import {WEEK_NUMBER} from '../testIDs';
import {DateData, Theme} from '../types';
>>>>>>> 115f18741ed6f1e9a22d7ebe2115e091b3d204ca:src/calendar/index.tsx
import styleConstructor from './style';
import CalendarHeader from './header';
import BasicDay from './day/basic';
<<<<<<< HEAD:src/calendar/index.js
import Day from './day/index';

=======
import {MarkingProps} from './day/marking';


type MarkedDatesType = {
  [key: string]: MarkingProps;
};

export interface CalendarProps extends CalendarHeaderProps, DayProps {
  /** Specify theme properties to override specific styles for calendar parts */
  theme?: Theme;
  /** If firstDay=1 week starts from Monday. Note that dayNames and dayNamesShort should still start from Sunday */
  firstDay?: number;
  /** Display loading indicator */
  displayLoadingIndicator?: boolean;
  /** Show week numbers */
  showWeekNumbers?: boolean;
  /** Specify style for calendar container element */
  style?: StyleProp<ViewStyle>;
  /** Initially visible month */
  current?: string; // TODO: migrate to 'initialDate'
  /** Initially visible month. If changed will initialize the calendar to this value */
  initialDate?: string;
  /** Minimum date that can be selected, dates before minDate will be grayed out */
  minDate?: string;
  /** Maximum date that can be selected, dates after maxDate will be grayed out */
  maxDate?: string;
  /** Collection of dates that have to be marked */
  markedDates?: MarkedDatesType;
  /** Do not show days of other months in month page */
  hideExtraDays?: boolean;
  /** Always show six weeks on each month (only when hideExtraDays = false) */
  showSixWeeks?: boolean;
  /** Handler which gets executed on day press */
  onDayPress?: (date: DateData) => void;
  /** Handler which gets executed on day long press */
  onDayLongPress?: (date: DateData) => void;
  /** Handler which gets executed when month changes in calendar */
  onMonthChange?: (date: DateData) => void;
  /** Handler which gets executed when visible month changes in calendar */
  onVisibleMonthsChange?: (months: DateData[]) => void;
  /** Disables changing month when click on days of other months (when hideExtraDays is false) */
  disableMonthChange?: boolean;
  /** Enable the option to swipe between months */
  enableSwipeMonths?: boolean;
  /** Disable days by default */
  disabledByDefault?: boolean;
  /** Style passed to the header */
  headerStyle?: ViewStyle;
  /** Allow rendering a totally custom header */
  customHeader?: any;
  /** Allow selection of dates before minDate or after maxDate */
  allowSelectionOutOfRange?: boolean;
}

interface State {
  prevInitialDate?: string;
  currentMonth: any;
}
>>>>>>> 115f18741ed6f1e9a22d7ebe2115e091b3d204ca:src/calendar/index.tsx
/**
 * @description: Calendar component
 * @example: https://github.com/wix/react-native-calendars/blob/master/example/src/screens/calendars.js
 * @gif: https://github.com/wix/react-native-calendars/blob/master/demo/assets/calendar.gif
 */
<<<<<<< HEAD:src/calendar/index.js
class Calendar extends Component {
=======
class Calendar extends Component<CalendarProps, State> {
>>>>>>> 115f18741ed6f1e9a22d7ebe2115e091b3d204ca:src/calendar/index.tsx
  static displayName = 'Calendar';

  static propTypes = {
    ...CalendarHeader.propTypes,
    ...Day.propTypes,
    theme: PropTypes.object,
    firstDay: PropTypes.number,
    displayLoadingIndicator: PropTypes.bool,
    showWeekNumbers: PropTypes.bool,
    style: PropTypes.oneOfType([PropTypes.object, PropTypes.array, PropTypes.number]),
    current: PropTypes.string,
    initialDate: PropTypes.string,
    minDate: PropTypes.string,
    maxDate: PropTypes.string,
    markedDates: PropTypes.object,
    hideExtraDays: PropTypes.bool,
    showSixWeeks: PropTypes.bool,
    onDayPress: PropTypes.func,
    onDayLongPress: PropTypes.func,
    onMonthChange: PropTypes.func,
    onVisibleMonthsChange: PropTypes.func,
    disableMonthChange: PropTypes.bool,
    enableSwipeMonths: PropTypes.bool,
    disabledByDefault: PropTypes.bool,
    headerStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.number, PropTypes.array]),
<<<<<<< HEAD:src/calendar/index.js
    /** Allow rendering of a totally custom header */
    customHeader: PropTypes.any
=======
    customHeader: PropTypes.any,
    allowSelectionOutOfRange: PropTypes.bool
>>>>>>> 115f18741ed6f1e9a22d7ebe2115e091b3d204ca:src/calendar/index.tsx
  };

  static defaultProps = {
    enableSwipeMonths: false
  };

<<<<<<< HEAD:src/calendar/index.js
  constructor(props) {
    super(props);

    this.style = styleConstructor(props.theme);

    this.state = {
      currentMonth: props.current ? parseDate(props.current) : XDate()
    };

    // this.shouldComponentUpdate = shouldComponentUpdate;
=======
  state = {
    prevInitialDate: this.props.initialDate,
    currentMonth: this.props.current || this.props.initialDate ? 
      parseDate(this.props.current || this.props.initialDate) : new XDate()
  };
  style = styleConstructor(this.props.theme);
  header: React.RefObject<CalendarHeader> = React.createRef();

  static getDerivedStateFromProps(nextProps: CalendarProps, prevState: State) {
    if (nextProps?.initialDate && nextProps?.initialDate !== prevState.prevInitialDate) {
      return {
        prevInitialDate: nextProps.initialDate,
        currentMonth: parseDate(nextProps.initialDate)
      };
    }
    return null;
>>>>>>> 115f18741ed6f1e9a22d7ebe2115e091b3d204ca:src/calendar/index.tsx
  }

  addMonth = count => {
    this.updateMonth(this.state.currentMonth.clone().addMonths(count, true));
  };

<<<<<<< HEAD:src/calendar/index.js
  updateMonth = (day, doNotTriggerListeners) => {
    if (day.toString('yyyy MM') === this.state.currentMonth.toString('yyyy MM')) {
=======
  updateMonth = (day: any) => {
    if (sameMonth(day, this.state.currentMonth)) {
>>>>>>> 115f18741ed6f1e9a22d7ebe2115e091b3d204ca:src/calendar/index.tsx
      return;
    }
    this.setState({currentMonth: day.clone()}, () => {
<<<<<<< HEAD:src/calendar/index.js
      if (!doNotTriggerListeners) {
        const currMont = this.state.currentMonth.clone();
        _.invoke(this.props, 'onMonthChange', xdateToData(currMont));
        _.invoke(this.props, 'onVisibleMonthsChange', [xdateToData(currMont)]);
      }
    });
  };

  handleDayInteraction(date, interaction) {
    const {disableMonthChange} = this.props;
=======
      const currMont = this.state.currentMonth.clone();
      this.props.onMonthChange?.(xdateToData(currMont));
      this.props.onVisibleMonthsChange?.([xdateToData(currMont)]);
    });
  };

  handleDayInteraction(date: DateData, interaction?: (date: DateData) => void) {
    const {disableMonthChange, allowSelectionOutOfRange} = this.props;
>>>>>>> 115f18741ed6f1e9a22d7ebe2115e091b3d204ca:src/calendar/index.tsx
    const day = parseDate(date);
    const min = parseDate(this.props.minDate);
    const max = parseDate(this.props.maxDate);

<<<<<<< HEAD:src/calendar/index.js
    if (!(minDate && !dateutils.isGTE(day, minDate)) && !(maxDate && !dateutils.isLTE(day, maxDate))) {
=======
    if (allowSelectionOutOfRange || !(min && !isGTE(day, min)) && !(max && !isLTE(day, max))) {
>>>>>>> 115f18741ed6f1e9a22d7ebe2115e091b3d204ca:src/calendar/index.tsx
      const shouldUpdateMonth = disableMonthChange === undefined || !disableMonthChange;

      if (shouldUpdateMonth) {
        this.updateMonth(day);
      }
      if (interaction) {
        interaction(date);
      }
    }
  }

<<<<<<< HEAD:src/calendar/index.js
  pressDay = date => {
    this.handleDayInteraction(date, this.props.onDayPress);
  };

  longPressDay = date => {
=======
  pressDay = (date?: DateData) => {
    if (date)
    this.handleDayInteraction(date, this.props.onDayPress);
  };

  longPressDay = (date?: DateData) => {
    if (date)
>>>>>>> 115f18741ed6f1e9a22d7ebe2115e091b3d204ca:src/calendar/index.tsx
    this.handleDayInteraction(date, this.props.onDayLongPress);
  };

  swipeProps = {onSwipe: (direction, state) => this.onSwipe(direction, state)};

  onSwipe = gestureName => {
    const {SWIPE_UP, SWIPE_DOWN, SWIPE_LEFT, SWIPE_RIGHT} = swipeDirections;

    switch (gestureName) {
      case SWIPE_UP:
      case SWIPE_DOWN:
        break;
      case SWIPE_LEFT:
        this.onSwipeLeft();
        break;
      case SWIPE_RIGHT:
        this.onSwipeRight();
        break;
    }
  };

  onSwipeLeft = () => {
    this.header.onPressRight();
  };

  onSwipeRight = () => {
    this.header.onPressLeft();
  };

  renderWeekNumber = memoize(weekNumber => {
    return (
      <View style={this.style.dayContainer} key={`week-container-${weekNumber}`}>
        <BasicDay
          key={`week-${weekNumber}`}
          marking={{disabled: true, disableTouchEvent: true}}
          // state='disabled'
          theme={this.props.theme}
          testID={`${WEEK_NUMBER}-${weekNumber}`}
        >
          {weekNumber}
        </BasicDay>
      </View>
    );
  });

<<<<<<< HEAD:src/calendar/index.js
  renderDay(day, id) {
=======
  renderDay(day: XDate, id: number) {
>>>>>>> 115f18741ed6f1e9a22d7ebe2115e091b3d204ca:src/calendar/index.tsx
    const {hideExtraDays, markedDates} = this.props;
    const dayProps = extractComponentProps(Day, this.props);

    if (!dateutils.sameMonth(day, this.state.currentMonth) && hideExtraDays) {
      return <View key={id} style={this.style.emptyDayContainer} />;
    }

    return (
      <View style={this.style.dayContainer} key={id}>
        <Day
          {...dayProps}
          day={day}
          state={getState(day, this.state.currentMonth, this.props)}
          marking={markedDates?.[toMarkingFormat(day)]}
          onPress={this.pressDay}
          onLongPress={this.longPressDay}
        />
      </View>
    );
  }

<<<<<<< HEAD:src/calendar/index.js
  renderWeek(days, id) {
    const week = [];

    days.forEach((day, id2) => {
=======
  renderWeek(days: XDate[], id: number) {
    const week = [];

    days.forEach((day: XDate, id2: number) => {
>>>>>>> 115f18741ed6f1e9a22d7ebe2115e091b3d204ca:src/calendar/index.tsx
      week.push(this.renderDay(day, id2));
    }, this);

    if (this.props.showWeekNumbers) {
      week.unshift(this.renderWeekNumber(days[days.length - 1].getWeek()));
    }

    return (
      <View style={this.style.week} key={id}>
        {week}
      </View>
    );
  }

  renderMonth() {
    const {currentMonth} = this.state;
    const {firstDay, showSixWeeks, hideExtraDays} = this.props;
    const shouldShowSixWeeks = showSixWeeks && !hideExtraDays;
    const days = dateutils.page(currentMonth, firstDay, shouldShowSixWeeks);
    const weeks = [];

    while (days.length) {
      weeks.push(this.renderWeek(days.splice(0, 7), weeks.length));
    }

    return <View style={this.style.monthView}>{weeks}</View>;
  }

  renderHeader() {
    const {customHeader, headerStyle, displayLoadingIndicator, markedDates, testID} = this.props;
    let indicator;

<<<<<<< HEAD:src/calendar/index.js
    if (current) {
      const lastMonthOfDay = toMarkingFormat(current.clone().addMonths(1, true).setDate(1).addDays(-1));
      if (displayLoadingIndicator && !(markedDates && markedDates[lastMonthOfDay])) {
=======
    if (this.state.currentMonth) {
      const lastMonthOfDay = toMarkingFormat(this.state.currentMonth.clone().addMonths(1, true).setDate(1).addDays(-1));
      if (displayLoadingIndicator && !markedDates?.[lastMonthOfDay]) {
>>>>>>> 115f18741ed6f1e9a22d7ebe2115e091b3d204ca:src/calendar/index.tsx
        indicator = true;
      }
    }

    const headerProps = extractComponentProps(CalendarHeader, this.props);
    const CustomHeader = customHeader;
    const HeaderComponent = customHeader ? CustomHeader : CalendarHeader;
    const ref = customHeader ?  undefined : this.header;
    
    return (
      <HeaderComponent
        {...headerProps}
        testID={testID}
        style={headerStyle}
<<<<<<< HEAD:src/calendar/index.js
        ref={r => (this.header = r)}
=======
        ref={ref}
>>>>>>> 115f18741ed6f1e9a22d7ebe2115e091b3d204ca:src/calendar/index.tsx
        month={this.state.currentMonth}
        addMonth={this.addMonth}
        displayLoadingIndicator={indicator}
      />
    );
  }

  render() {
    const {enableSwipeMonths, style} = this.props;
    const GestureComponent = enableSwipeMonths ? GestureRecognizer : View;
    const gestureProps = enableSwipeMonths ? this.swipeProps : undefined;

    return (
      <GestureComponent {...gestureProps}>
        <View
          style={[this.style.container, style]}
          accessibilityElementsHidden={this.props.accessibilityElementsHidden} // iOS
          importantForAccessibility={this.props.importantForAccessibility} // Android
        >
          {this.renderHeader()}
          {this.renderMonth()}
        </View>
      </GestureComponent>
    );
  }
}

export default Calendar;
