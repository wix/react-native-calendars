import invoke from 'lodash/invoke';
import PropTypes from 'prop-types';
import XDate from 'xdate';
import memoize from 'memoize-one';

import React, {Component} from 'react';
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

// @ts-expect-error
import {extractComponentProps} from '../component-updater.js';
// @ts-expect-error
import {parseDate, xdateToData, toMarkingFormat} from '../interface';
// @ts-expect-error
import {weekDayNames, sameDate, sameMonth} from '../dateutils';
// @ts-expect-error
import {AGENDA_CALENDAR_KNOB} from '../testIDs';
// @ts-expect-error
import {VelocityTracker} from '../input';
import {DateData} from '../types';
import styleConstructor from './style';
import CalendarList, {CalendarListProps} from '../calendar-list';
import ReservationList, {ReservationListProps}  from './reservation-list';


const HEADER_HEIGHT = 104;
const KNOB_HEIGHT = 24;

export type ReservationItemType = {
  name: string;
  height: number;
  day: XDate;
};

export type ReservationsType = {
  [date: string]: ReservationItemType[];
};

export type AgendaProps = CalendarListProps & ReservationListProps & {
  /** the list of items that have to be displayed in agenda. If you want to render item as empty date
   the value of date key has to be an empty array []. If there exists no value for date key it is
   considered that the date in question is not yet loaded */
  items: ReservationsType;
  /** callback that gets called when items for a certain month should be loaded (month became visible) */
  loadItemsForMonth?: (data: any) => DateData;
  /** callback that fires when the calendar is opened or closed */
  onCalendarToggled?: (enabled: boolean) => void;
  /** callback that gets called on day press */
  onDayPress?: (data: DateData) => void;
  /** callback that gets called when day changes while scrolling agenda list */
  onDayChange?: (data: any) => void;
  /** specify how agenda knob should look like */
  renderKnob?: () => JSX.Element;
  /** initially selected day */
  selected: boolean, //TODO: Should be renamed 'selectedDay'
  /** Hide knob button. Default = false */
  hideKnob: boolean,
  /** When `true` and `hideKnob` prop is `false`, the knob will always be visible and the user will be able to drag the knob up and close the calendar. Default = false */
  showClosingKnob: boolean
}

type AgendaState = {
  scrollY: Animated.Value;
  calendarIsReady: boolean;
  calendarScrollable: boolean;
  firstReservationLoad: boolean;
  selectedDay: XDate;
  topDay: XDate;
};

/**
 * @description: Agenda component
 * @extends: CalendarList
 * @extendslink: docs/CalendarList
 * @example: https://github.com/wix/react-native-calendars/blob/master/example/src/screens/agenda.js
 * @gif: https://github.com/wix/react-native-calendars/blob/master/demo/agenda.gif
 */
export default class Agenda extends Component<AgendaProps, AgendaState> {
  static displayName = 'Agenda';

  static propTypes = {
    ...CalendarList.propTypes,
    ...ReservationList.propTypes,
    /** agenda container style */
    style: PropTypes.oneOfType([PropTypes.object, PropTypes.array, PropTypes.number]),
    /** the list of items that have to be displayed in agenda. If you want to render item as empty date
     the value of date key has to be an empty array []. If there exists no value for date key it is
     considered that the date in question is not yet loaded */
    items: PropTypes.object,
    /** callback that gets called when items for a certain month should be loaded (month became visible) */
    loadItemsForMonth: PropTypes.func,
    /** callback that fires when the calendar is opened or closed */
    onCalendarToggled: PropTypes.func,
    /** callback that gets called on day press */
    onDayPress: PropTypes.func,
    /** callback that gets called when day changes while scrolling agenda list */
    onDayChange: PropTypes.func,
    /** specify how agenda knob should look like */
    renderKnob: PropTypes.func,
    /** initially selected day */
    selected: PropTypes.any, //TODO: Should be renamed 'selectedDay'
    /** Hide knob button. Default = false */
    hideKnob: PropTypes.bool,
    /** When `true` and `hideKnob` prop is `false`, the knob will always be visible and the user will be able to drag the knob up and close the calendar. Default = false */
    showClosingKnob: PropTypes.bool
  };

  private style: {[key: string]: ViewStyle};
  private viewHeight: number;
  private viewWidth: number;
  private scrollTimeout: any;
  private headerState: string;
  private currentMonth: XDate;
  private knobTracker: any;
  private _isMounted: boolean | undefined;
  private scrollPad: React.RefObject<any> = React.createRef();
  private calendar: React.RefObject<CalendarList> = React.createRef();
  private knob: React.RefObject<any> = React.createRef();
  public list: React.RefObject<ReservationList> = React.createRef();

  constructor(props: AgendaProps) {
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
      selectedDay: parseDate(props.selected) || new XDate(true),
      topDay: parseDate(props.selected) || new XDate(true)
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

  componentDidUpdate(prevProps: AgendaProps) {
    if (this.props.selected && !sameDate(parseDate(this.props.selected), parseDate(prevProps.selected))) {
      this.setState({selectedDay: parseDate(this.props.selected)});
    } else if (!prevProps.items) {
      this.loadReservations(this.props);
    }
  }

  static getDerivedStateFromProps(nextProps: AgendaProps) {
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

  setScrollPadPosition = (y: number, animated: boolean) => {
    if (this.scrollPad?.current?.scrollTo) {
      this.scrollPad.current.scrollTo({x: 0, y, animated});
    } else {
      // Support for RN O.61 (Expo 37)
      this.scrollPad?.current?.getNode().scrollTo({x: 0, y, animated});
    }
  };

  toggleCalendarPosition = (open: boolean) => {
    const maxY = this.initialScrollPadPosition();
    this.setScrollPadPosition(open ? 0 : maxY, true);
    this.enableCalendarScrolling(open);
  };

  enableCalendarScrolling(enable = true) {
    this.setState({
      calendarScrollable: enable
    });

    invoke(this.props, 'onCalendarToggled', enable);

    // Enlarge calendarOffset here as a workaround on iOS to force repaint.
    // Otherwise the month after current one or before current one remains invisible.
    // The problem is caused by overflow: 'hidden' style, which we need for dragging
    // to be performant.
    // Another working solution for this bug would be to set removeClippedSubviews={false}
    // in CalendarList listView, but that might impact performance when scrolling
    // month list in expanded CalendarList.
    // Further info https://github.com/facebook/react-native/issues/1831
    this.calendar?.current?.scrollToDay(this.state.selectedDay, this.calendarOffset() + 1, true);
  }

  loadReservations(props: AgendaProps) {
    if ((!props.items || !Object.keys(props.items).length) && !this.state.firstReservationLoad) {
      this.setState(
        {
          firstReservationLoad: true
        },
        () => {
          invoke(this.props, 'loadItemsForMonth', xdateToData(this.state.selectedDay));
        }
      );
    }
  }

  chooseDayFromCalendar = (d: any) => {
    this.chooseDay(d, !this.state.calendarScrollable);
  };

  chooseDay(d: any, optimisticScroll: boolean) {
    const day = parseDate(d);

    this.setState({
      calendarScrollable: false,
      selectedDay: day.clone()
    });

    invoke(this.props, 'onCalendarToggled', false);

    if (!optimisticScroll) {
      this.setState({
        topDay: day.clone()
      });
    }

    this.setScrollPadPosition(this.initialScrollPadPosition(), true);
    this.calendar?.current?.scrollToDay(day, this.calendarOffset(), true);

    invoke(this.props, 'loadItemsForMonth', xdateToData(day));
    invoke(this.props, 'onDayPress', xdateToData(day));
  }

  generateMarkings = memoize((selectedDay, markedDates, items = {}) => {
    if (!markedDates) {
      markedDates = {};
      Object.keys(items).forEach(key => {
        if (items[key] && items[key].length) {
          markedDates[key] = {marked: true};
        }
      });
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
    this.calendar?.current?.scrollToDay(this.state.selectedDay.clone(), this.calendarOffset(), false);
  };

  onLayout = (event: LayoutChangeEvent) => {
    this.viewHeight = event.nativeEvent.layout.height;
    this.viewWidth = event.nativeEvent.layout.width;
    this.forceUpdate();
  };

  onTouchStart = () => {
    this.headerState = 'touched';
    this.knob?.current?.setNativeProps({style: {opacity: 0.5}});
  };

  onTouchEnd = () => {
    this.knob?.current?.setNativeProps({style: {opacity: 1}});

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

  onSnapAfterDrag = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
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

  onVisibleMonthsChange = (months: DateData[]) => {
    invoke(this.props, 'onVisibleMonthsChange', months);

    if (this.props.items && !this.state.firstReservationLoad) {
      clearTimeout(this.scrollTimeout);

      this.scrollTimeout = setTimeout(() => {
        if (this._isMounted) {
          invoke(this.props, 'loadItemsForMonth', months[0]);
        }
      }, 200);
    }
  };

  onDayChange = (day: any) => {
    const newDate = parseDate(day);
    const withAnimation = sameMonth(newDate, this.state.selectedDay);

    this.calendar?.current?.scrollToDay(day, this.calendarOffset(), withAnimation);
    this.setState({
      selectedDay: newDate
    });

    invoke(this.props, 'onDayChange', xdateToData(newDate));
  };

  renderReservations() {
    const reservationListProps = extractComponentProps(ReservationList, this.props);

    return (
      <ReservationList
        {...reservationListProps}
        ref={this.list}
        reservations={this.props.items}
        selectedDay={this.state.selectedDay}
        topDay={this.state.topDay}
        onDayChange={this.onDayChange}
        onScroll={() => {}}
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
        ref={this.calendar}
        current={this.currentMonth}
        markedDates={this.generateMarkings(this.state.selectedDay, markedDates, items)}
        calendarWidth={this.viewWidth}
        scrollEnabled={this.state.calendarScrollable}
        hideExtraDays={shouldHideExtraDays}
        onLayout={this.onCalendarListLayout}
        onDayPress={this.chooseDayFromCalendar}
        onVisibleMonthsChange={this.onVisibleMonthsChange}
      />
    );
  }

  renderKnob() {
    const {showClosingKnob, hideKnob, renderKnob} = this.props;
    let knob: JSX.Element | null = <View style={this.style.knobContainer} />;

    if (!hideKnob) {
      const knobView = renderKnob ? renderKnob() : <View style={this.style.knob}/>;
      knob = !this.state.calendarScrollable || showClosingKnob ? (
        <View style={this.style.knobContainer}>
          <View ref={this.knob}>{knobView}</View>
        </View>
      ) : null;
    }
    return knob;
  }

  renderWeekDaysNames = memoize((weekDaysNames: string[]) => {
    return weekDaysNames.map((day, index) => (
      <Text allowFontScaling={false} key={day + index} style={this.style.weekday} numberOfLines={1}>
        {day}
      </Text>
    ));
  });

  renderWeekNumbersSpace = () => {
    return this.props.showWeekNumbers && <View style={this.style.weekday} />;
  };

  render() {
    const {firstDay, hideKnob, style, testID} = this.props;
    const weekDaysNames = weekDayNames(firstDay);
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

    const openCalendarScrollPadPosition =
      !hideKnob && this.state.calendarScrollable && this.props.showClosingKnob ? agendaHeight + HEADER_HEIGHT : 0;
    const shouldAllowDragging = !hideKnob && !this.state.calendarScrollable;
    const scrollPadPosition = (shouldAllowDragging ? HEADER_HEIGHT : openCalendarScrollPadPosition) - KNOB_HEIGHT;
    const scrollPadStyle = {
      height: KNOB_HEIGHT,
      top: scrollPadPosition,
      left: (this.viewWidth - 80) / 2
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
          ref={this.scrollPad}
          style={[this.style.scrollPadStyle, scrollPadStyle]}
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
