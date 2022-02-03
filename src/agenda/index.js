<<<<<<< HEAD:src/agenda/index.js
import _ from 'lodash';
=======
>>>>>>> 115f18741ed6f1e9a22d7ebe2115e091b3d204ca:src/agenda/index.tsx
import PropTypes from 'prop-types';
import XDate from 'xdate';
import memoize from 'memoize-one';

import React, {Component} from 'react';
<<<<<<< HEAD:src/agenda/index.js
import {Text, View, Dimensions, Animated} from 'react-native';

import {extractComponentProps} from '../component-updater';
import {parseDate, xdateToData, toMarkingFormat} from '../interface';
import dateutils from '../dateutils';
import {AGENDA_CALENDAR_KNOB} from '../testIDs';
import {VelocityTracker} from '../input';
=======
import {
  Text,
  View,
  Dimensions,
  Animated,
  ViewStyle,
  LayoutChangeEvent,
  NativeSyntheticEvent,
  NativeScrollEvent
} from 'react-native';

import {extractComponentProps} from '../componentUpdater';
import {parseDate, xdateToData, toMarkingFormat} from '../interface';
import {weekDayNames, sameDate, sameMonth} from '../dateutils';
// @ts-expect-error
import {AGENDA_CALENDAR_KNOB} from '../testIDs';
import {VelocityTracker} from '../velocityTracker';
import {DateData, AgendaSchedule} from '../types';
import {getCalendarDateString} from '../services';
>>>>>>> 115f18741ed6f1e9a22d7ebe2115e091b3d204ca:src/agenda/index.tsx
import styleConstructor from './style';
import CalendarList from '../calendar-list';
import ReservationList from './reservation-list';

const HEADER_HEIGHT = 104;
const KNOB_HEIGHT = 24;

<<<<<<< HEAD:src/agenda/index.js
=======
export type AgendaProps = CalendarListProps & ReservationListProps & {
  /** the list of items that have to be displayed in agenda. If you want to render item as empty date
  the value of date key kas to be an empty array []. If there exists no value for date key it is
  considered that the date in question is not yet loaded */
  items?: AgendaSchedule;
  /** callback that gets called when items for a certain month should be loaded (month became visible) */
  loadItemsForMonth?: (data: DateData) => void;
  /** callback that fires when the calendar is opened or closed */
  onCalendarToggled?: (enabled: boolean) => void;
  /** callback that gets called when day changes while scrolling agenda list */
  onDayChange?: (data: DateData) => void;
  /** specify how agenda knob should look like */
  renderKnob?: () => JSX.Element;
  /** initially selected day */
  selected?: string; //TODO: Should be renamed 'selectedDay' and inherited from ReservationList
  /** Hide knob button. Default = false */
  hideKnob?: boolean;
  /** Whether the knob should always be visible (when hideKnob = false) */
  showClosingKnob?: boolean;
}

type State = {
  scrollY: Animated.Value;
  calendarIsReady: boolean;
  calendarScrollable: boolean;
  firstReservationLoad: boolean;
  selectedDay: XDate;
  topDay: XDate;
};

>>>>>>> 115f18741ed6f1e9a22d7ebe2115e091b3d204ca:src/agenda/index.tsx
/**
 * @description: Agenda component
 * @extends: CalendarList
 * @extendslink: docs/CalendarList
 * @example: https://github.com/wix/react-native-calendars/blob/master/example/src/screens/agenda.js
 * @gif: https://github.com/wix/react-native-calendars/blob/master/demo/assets/agenda.gif
 */
<<<<<<< HEAD:src/agenda/index.js
export default class AgendaView extends Component {
=======
export default class Agenda extends Component<AgendaProps, State> {
>>>>>>> 115f18741ed6f1e9a22d7ebe2115e091b3d204ca:src/agenda/index.tsx
  static displayName = 'Agenda';

  static propTypes = {
    ...CalendarList.propTypes,
    ...ReservationList.propTypes,
    items: PropTypes.object,
    style: PropTypes.oneOfType([PropTypes.object, PropTypes.array, PropTypes.number]),
    loadItemsForMonth: PropTypes.func,
    onCalendarToggled: PropTypes.func,
<<<<<<< HEAD:src/agenda/index.js
    /** callback that gets called on day press */
    onDayPress: PropTypes.func,
    /** callback that gets called when day changes while scrolling agenda list */
    onDaychange: PropTypes.func, //TODO: Should be renamed 'onDayChange'
    /** specify how agenda knob should look like */
=======
    onDayChange: PropTypes.func,
>>>>>>> 115f18741ed6f1e9a22d7ebe2115e091b3d204ca:src/agenda/index.tsx
    renderKnob: PropTypes.func,
    selected: PropTypes.any, //TODO: Should be renamed 'selectedDay' and inherited from ReservationList
    hideKnob: PropTypes.bool,
    showClosingKnob: PropTypes.bool
  };

<<<<<<< HEAD:src/agenda/index.js
  constructor(props) {
=======
  private style: {[key: string]: ViewStyle};
  private viewHeight: number;
  private viewWidth: number;
  private scrollTimeout?: ReturnType<typeof setTimeout>;
  private headerState: string;
  private currentMonth: XDate;
  private knobTracker: VelocityTracker;
  private _isMounted: boolean | undefined;
  private scrollPad: React.RefObject<any> = React.createRef();
  private calendar: React.RefObject<CalendarList> = React.createRef();
  private knob: React.RefObject<View> = React.createRef();
  public list: React.RefObject<ReservationList> = React.createRef();

  constructor(props: AgendaProps) {
>>>>>>> 115f18741ed6f1e9a22d7ebe2115e091b3d204ca:src/agenda/index.tsx
    super(props);

    this.style = styleConstructor(props.theme);

    const windowSize = Dimensions.get('window');
    this.viewHeight = windowSize.height;
    this.viewWidth = windowSize.width;

    this.scrollTimeout = undefined;
    this.headerState = 'idle';

    this.state = {
      scrollY: new Animated.Value(0),
      calendarIsReady: false,
      calendarScrollable: false,
      firstReservationLoad: false,
      selectedDay: parseDate(props.selected) || XDate(true),
      topDay: parseDate(props.selected) || XDate(true)
    };

    this.currentMonth = this.state.selectedDay.clone();

    this.knobTracker = new VelocityTracker();
    this.state.scrollY.addListener(({value}) => this.knobTracker.add(value));
  }

  componentDidMount() {
    this._isMounted = true;
    this.loadReservations(this.props);
  }

  componentWillUnmount() {
    this._isMounted = false;
    this.state.scrollY.removeAllListeners();
  }

<<<<<<< HEAD:src/agenda/index.js
  componentDidUpdate(prevProps) {
    if (this.props.selected && !dateutils.sameDate(parseDate(this.props.selected), parseDate(prevProps.selected))) {
=======
  componentDidUpdate(prevProps: AgendaProps) {
    if (!sameDate(parseDate(this.props.selected), parseDate(prevProps.selected))) {
>>>>>>> 115f18741ed6f1e9a22d7ebe2115e091b3d204ca:src/agenda/index.tsx
      this.setState({selectedDay: parseDate(this.props.selected)});
    } else if (!prevProps.items) {
      this.loadReservations(this.props);
    }
  }

  static getDerivedStateFromProps(nextProps) {
    if (nextProps.items) {
      return {firstReservationLoad: false};
    }
    return null;
  }

  calendarOffset() {
    return 96 - this.viewHeight / 2;
  }

  initialScrollPadPosition = () => {
    return Math.max(0, this.viewHeight - HEADER_HEIGHT);
  };

  setScrollPadPosition = (y, animated) => {
    if (this.scrollPad.scrollTo) {
      this.scrollPad.scrollTo({x: 0, y, animated});
    } else {
      // Support for RN O.61 (Expo 37)
      this.scrollPad.getNode().scrollTo({x: 0, y, animated});
    }
  };

  toggleCalendarPosition = open => {
    const maxY = this.initialScrollPadPosition();
    this.setScrollPadPosition(open ? 0 : maxY, true);
    this.enableCalendarScrolling(open);
  };

  enableCalendarScrolling(enable = true) {
<<<<<<< HEAD:src/agenda/index.js
    this.setState({
      calendarScrollable: enable
    });

    _.invoke(this.props, 'onCalendarToggled', enable);
=======
    this.setState({calendarScrollable: enable});
    
    this.props.onCalendarToggled?.(enable);
>>>>>>> 115f18741ed6f1e9a22d7ebe2115e091b3d204ca:src/agenda/index.tsx

    // Enlarge calendarOffset here as a workaround on iOS to force repaint.
    // Otherwise the month after current one or before current one remains invisible.
    // The problem is caused by overflow: 'hidden' style, which we need for dragging
    // to be performant.
    // Another working solution for this bug would be to set removeClippedSubviews={false}
    // in CalendarList listView, but that might impact performance when scrolling
    // month list in expanded CalendarList.
    // Further info https://github.com/facebook/react-native/issues/1831
    this.calendar.scrollToDay(this.state.selectedDay, this.calendarOffset() + 1, true);
  }

  loadReservations(props) {
    if ((!props.items || !Object.keys(props.items).length) && !this.state.firstReservationLoad) {
      this.setState({firstReservationLoad: true},
        () => {
<<<<<<< HEAD:src/agenda/index.js
          _.invoke(this.props, 'loadItemsForMonth', xdateToData(this.state.selectedDay));
=======
          this.props.loadItemsForMonth?.(xdateToData(this.state.selectedDay));
>>>>>>> 115f18741ed6f1e9a22d7ebe2115e091b3d204ca:src/agenda/index.tsx
        }
      );
    }
  }

<<<<<<< HEAD:src/agenda/index.js
  chooseDayFromCalendar = d => {
    this.chooseDay(d, !this.state.calendarScrollable);
  };

  chooseDay(d, optimisticScroll) {
=======
  onDayPress = (d: DateData) => {
    this.chooseDay(d, !this.state.calendarScrollable);
  };

  chooseDay(d: DateData, optimisticScroll: boolean) {
>>>>>>> 115f18741ed6f1e9a22d7ebe2115e091b3d204ca:src/agenda/index.tsx
    const day = parseDate(d);

    this.setState({
      calendarScrollable: false,
      selectedDay: day.clone()
    });

<<<<<<< HEAD:src/agenda/index.js
    _.invoke(this.props, 'onCalendarToggled', false);
=======
    this.props.onCalendarToggled?.(false);
>>>>>>> 115f18741ed6f1e9a22d7ebe2115e091b3d204ca:src/agenda/index.tsx

    if (!optimisticScroll) {
      this.setState({topDay: day.clone()});
    }

    this.setScrollPadPosition(this.initialScrollPadPosition(), true);
    this.calendar.scrollToDay(day, this.calendarOffset(), true);

<<<<<<< HEAD:src/agenda/index.js
    _.invoke(this.props, 'loadItemsForMonth', xdateToData(day));
    _.invoke(this.props, 'onDayPress', xdateToData(day));
=======
    this.props.loadItemsForMonth?.(xdateToData(day));
    this.props.onDayPress?.(xdateToData(day));
>>>>>>> 115f18741ed6f1e9a22d7ebe2115e091b3d204ca:src/agenda/index.tsx
  }

  generateMarkings = memoize((selectedDay, markedDates, items) => {
    if (!markedDates) {
      markedDates = {};
      if (items) {
        Object.keys(items).forEach(key => {
          if (items[key] && items[key].length) {
            markedDates[key] = {marked: true};
          }
        });
      }
    }

    const key = toMarkingFormat(selectedDay);
    return {...markedDates, [key]: {...(markedDates[key] || {}), ...{selected: true}}};
  });

  onScrollPadLayout = () => {
    // When user touches knob, the actual component that receives touch events is a ScrollView.
    // It needs to be scrolled to the bottom, so that when user moves finger downwards,
    // scroll position actually changes (it would stay at 0, when scrolled to the top).
    this.setScrollPadPosition(this.initialScrollPadPosition(), false);
    // delay rendering calendar in full height because otherwise it still flickers sometimes
    setTimeout(() => this.setState({calendarIsReady: true}), 0);
  };

  onCalendarListLayout = () => {
    this.calendar.scrollToDay(this.state.selectedDay.clone(), this.calendarOffset(), false);
  };

  onLayout = event => {
    this.viewHeight = event.nativeEvent.layout.height;
    this.viewWidth = event.nativeEvent.layout.width;
    this.forceUpdate();
  };

  onTouchStart = () => {
    this.headerState = 'touched';
    if (this.knob) {
      this.knob.setNativeProps({style: {opacity: 0.5}});
    }
  };

  onTouchEnd = () => {
    if (this.knob) {
      this.knob.setNativeProps({style: {opacity: 1}});
    }

    if (this.headerState === 'touched') {
      const isOpen = this.state.calendarScrollable;
      this.toggleCalendarPosition(!isOpen);
    }

    this.headerState = 'idle';
  };

  onStartDrag = () => {
    this.headerState = 'dragged';
    this.knobTracker.reset();
  };

  onSnapAfterDrag = e => {
    // on Android onTouchEnd is not called if dragging was started
    this.onTouchEnd();
    const currentY = e.nativeEvent.contentOffset.y;
    this.knobTracker.add(currentY);
    const projectedY = currentY + this.knobTracker.estimateSpeed() * 250; /*ms*/
    const maxY = this.initialScrollPadPosition();
    const snapY = projectedY > maxY / 2 ? maxY : 0;
    this.setScrollPadPosition(snapY, true);

    this.enableCalendarScrolling(snapY === 0);
  };

<<<<<<< HEAD:src/agenda/index.js
  onVisibleMonthsChange = months => {
    _.invoke(this.props, 'onVisibleMonthsChange', months);
=======
  onVisibleMonthsChange = (months: DateData[]) => {
    this.props.onVisibleMonthsChange?.(months);
>>>>>>> 115f18741ed6f1e9a22d7ebe2115e091b3d204ca:src/agenda/index.tsx

    if (this.props.items && !this.state.firstReservationLoad) {
      if (this.scrollTimeout) {
        clearTimeout(this.scrollTimeout);
      }

      this.scrollTimeout = setTimeout(() => {
        if (this._isMounted) {
<<<<<<< HEAD:src/agenda/index.js
          _.invoke(this.props, 'loadItemsForMonth', months[0]);
=======
          this.props.loadItemsForMonth?.(months[0]);
>>>>>>> 115f18741ed6f1e9a22d7ebe2115e091b3d204ca:src/agenda/index.tsx
        }
      }, 200);
    }
  };

<<<<<<< HEAD:src/agenda/index.js
  onDayChange = day => {
    const newDate = parseDate(day);
    const withAnimation = dateutils.sameMonth(newDate, this.state.selectedDay);

    this.calendar.scrollToDay(day, this.calendarOffset(), withAnimation);
    this.setState({
      selectedDay: newDate
    });

    _.invoke(this.props, 'onDayChange', xdateToData(newDate));
=======
  onDayChange = (day: XDate) => {
    const withAnimation = sameMonth(day, this.state.selectedDay);
    this.calendar?.current?.scrollToDay(day, this.calendarOffset(), withAnimation);
    
    this.setState({selectedDay: day});

    this.props.onDayChange?.(xdateToData(day));
>>>>>>> 115f18741ed6f1e9a22d7ebe2115e091b3d204ca:src/agenda/index.tsx
  };

  renderReservations() {
    const reservationListProps = extractComponentProps(ReservationList, this.props);

    return (
      <ReservationList
        {...reservationListProps}
<<<<<<< HEAD:src/agenda/index.js
        ref={c => (this.list = c)}
        reservations={this.props.items}
=======
        ref={this.list}
>>>>>>> 115f18741ed6f1e9a22d7ebe2115e091b3d204ca:src/agenda/index.tsx
        selectedDay={this.state.selectedDay}
        topDay={this.state.topDay}
        onDayChange={this.onDayChange}
      />
    );
  }

  renderCalendarList() {
    const {markedDates, items} = this.props;
    const shouldHideExtraDays = this.state.calendarScrollable ? this.props.hideExtraDays : false;
    const calendarListProps = extractComponentProps(CalendarList, this.props);

    return (
      <CalendarList
        {...calendarListProps}
<<<<<<< HEAD:src/agenda/index.js
        ref={c => (this.calendar = c)}
        current={this.currentMonth}
=======
        ref={this.calendar}
        current={getCalendarDateString(this.currentMonth.toString())}
>>>>>>> 115f18741ed6f1e9a22d7ebe2115e091b3d204ca:src/agenda/index.tsx
        markedDates={this.generateMarkings(this.state.selectedDay, markedDates, items)}
        calendarWidth={this.viewWidth}
        scrollEnabled={this.state.calendarScrollable}
        hideExtraDays={shouldHideExtraDays}
        onLayout={this.onCalendarListLayout}
        onDayPress={this.onDayPress}
        onVisibleMonthsChange={this.onVisibleMonthsChange}
      />
    );
  }

  renderKnob() {
    const {showClosingKnob, hideKnob, renderKnob} = this.props;
    let knob = <View style={this.style.knobContainer} />;

    if (!hideKnob) {
      const knobView = renderKnob ? renderKnob() : <View style={this.style.knob} />;
      knob = !this.state.calendarScrollable || showClosingKnob ? (
        <View style={this.style.knobContainer}>
          <View ref={c => (this.knob = c)}>{knobView}</View>
        </View>
      ) : null;
    }
    return knob;
  }

  renderWeekDaysNames = memoize(weekDaysNames => {
    return weekDaysNames.map((day, index) => (
      <Text 
        key={day + index} 
        style={this.style.weekday} 
        allowFontScaling={false} 
        numberOfLines={1}
      >
        {day}
      </Text>
    ));
  });

  renderWeekNumbersSpace = () => {
    return this.props.showWeekNumbers && <View allowFontScaling={false} style={this.style.weekday} numberOfLines={1} />;
  };

  render() {
    const {firstDay, hideKnob, style, testID} = this.props;
    const weekDaysNames = dateutils.weekDayNames(firstDay);
    const agendaHeight = this.initialScrollPadPosition();
    const weekdaysStyle = [
      this.style.weekdays,
      {
        opacity: this.state.scrollY.interpolate({
          inputRange: [agendaHeight - HEADER_HEIGHT, agendaHeight],
          outputRange: [0, 1],
          extrapolate: 'clamp'
        }),
        transform: [
          {
            translateY: this.state.scrollY.interpolate({
              inputRange: [Math.max(0, agendaHeight - HEADER_HEIGHT), agendaHeight],
              outputRange: [-HEADER_HEIGHT, 0],
              extrapolate: 'clamp'
            })
          }
        ]
      }
    ];
    const headerTranslate = this.state.scrollY.interpolate({
      inputRange: [0, agendaHeight],
      outputRange: [agendaHeight, 0],
      extrapolate: 'clamp'
    });
    const contentTranslate = this.state.scrollY.interpolate({
      inputRange: [0, agendaHeight],
      outputRange: [0, agendaHeight / 2],
      extrapolate: 'clamp'
    });
    const headerStyle = [
      this.style.header,
      {
        bottom: agendaHeight,
        transform: [{translateY: headerTranslate}]
      }
    ];

    if (!this.state.calendarIsReady) {
      // limit header height until everything is setup for calendar dragging
      headerStyle.push({height: 0});
      // fill header with appStyle.calendarBackground background to reduce flickering
      weekdaysStyle.push({height: HEADER_HEIGHT});
    }

    const openCalendarScrollPadPosition = !hideKnob && this.state.calendarScrollable && this.props.showClosingKnob ? agendaHeight + HEADER_HEIGHT : 0;
    const shouldAllowDragging = !hideKnob && !this.state.calendarScrollable;
    const scrollPadPosition = (shouldAllowDragging ? HEADER_HEIGHT : openCalendarScrollPadPosition) - KNOB_HEIGHT;
    const scrollPadStyle = {
      position: 'absolute',
      width: 80,
      height: KNOB_HEIGHT,
      top: scrollPadPosition,
    };

    return (
      <View testID={testID} onLayout={this.onLayout} style={[style, this.style.container]}>
        <View style={this.style.reservations}>{this.renderReservations()}</View>
        <Animated.View style={headerStyle}>
          <Animated.View style={[this.style.animatedContainer, {transform: [{translateY: contentTranslate}]}]}>
            {this.renderCalendarList()}
          </Animated.View>
          {this.renderKnob()}
        </Animated.View>
        <Animated.View style={weekdaysStyle}>
          {this.renderWeekNumbersSpace()}
          {this.renderWeekDaysNames(weekDaysNames)}
        </Animated.View>
        <Animated.ScrollView
          ref={ref => (this.scrollPad = ref)}
          style={scrollPadStyle}
          overScrollMode="never"
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={8}
          scrollsToTop={false}
          onTouchStart={this.onTouchStart}
          onTouchEnd={this.onTouchEnd}
          onScrollBeginDrag={this.onStartDrag}
          onScrollEndDrag={this.onSnapAfterDrag}
          onScroll={Animated.event([{nativeEvent: {contentOffset: {y: this.state.scrollY}}}], {useNativeDriver: true})}
        >
          <View
            testID={AGENDA_CALENDAR_KNOB}
            style={{height: agendaHeight + KNOB_HEIGHT}}
            onLayout={this.onScrollPadLayout}
          />
        </Animated.ScrollView>
      </View>
    );
  }
}
