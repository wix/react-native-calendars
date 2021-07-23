// @flow
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions, RefreshControl
} from 'react-native';
import PropTypes from 'prop-types';
import populateEvents from './Packer';
import React from 'react';
import moment from 'moment-timezone';
import _ from 'lodash';
import styleConstructor from './style';
import { CALENDAR_VERTICAL_OFFSET } from './style';

const TEXT_LINE_HEIGHT = 17;

function range(from, to) {
  return Array.from(Array(to), (_, i) => from + i);
}

let {width: dimensionWidth} = Dimensions.get('window');

export default class Timeline extends React.PureComponent {
  static propTypes = {
    start: PropTypes.number,
    end: PropTypes.number,
    eventTapped: PropTypes.func,
    format24h: PropTypes.bool,
    /* restTime type 
    {
      Component: ({ top, height }: Props) => JSX.Element;
      endTime: number;
    } */
    restTime: PropTypes.object,
    events: PropTypes.arrayOf(PropTypes.shape({
      start: PropTypes.string.isRequired,
      end: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      summary: PropTypes.string,
      style: PropTypes.any
    })).isRequired,
    offsetLeft: PropTypes.number,
    offsetRight: PropTypes.number,
    offsetBottom: PropTypes.number,
    timeTextWidth: PropTypes.number
  }

  static defaultProps = {
    start: 0,
    end: 24,
    events: [],
    format24h: true,
    restTime: null,
    offsetLeft: 16,
    offsetRight: 20,
    offsetBottom: 0,
    timeTextWidth: 54,
    eventRelativeOffsetLeft: -8,
    eventRelativeOffsetRight: -4,
    hourOffset: 100
  }

  constructor(props) {
    super(props);
    const {
      start, 
      end, 
      offsetLeft, 
      offsetRight, 
      offsetBottom,
      timeTextWidth, 
      eventRelativeOffsetLeft, 
      eventRelativeOffsetRight,
      hourOffset
    } = this.props;
    this.calendarHeight = (end - start) * hourOffset;
    this.styles = styleConstructor(props.styles, this.calendarHeight, {
      offsetLeft: offsetLeft,
      offsetRight: offsetRight,
      offsetBottom: offsetBottom,
      timeTextWidth: timeTextWidth
    });
    const width = dimensionWidth - offsetLeft - offsetRight - timeTextWidth - eventRelativeOffsetLeft - eventRelativeOffsetRight;
    const packedEvents = populateEvents(props.events, width, start, hourOffset);
    let initPosition =
      _.min(_.map(packedEvents, 'top')) - this.calendarHeight / (end - start);
    const verifiedInitPosition = initPosition < 0 ? 0 : initPosition;
    this.state = {
      _scrollY: verifiedInitPosition,
      packedEvents
    };
  }

  componentDidUpdate(prevProps) {
    const {
      offsetLeft, 
      offsetRight, 
      timeTextWidth, 
      eventRelativeOffsetLeft, 
      eventRelativeOffsetRight,
      hourOffset
    } = this.props;
    const width = dimensionWidth - offsetLeft - offsetRight - timeTextWidth - eventRelativeOffsetLeft - eventRelativeOffsetRight;
    const {events: prevEvents, start: prevStart = 0} = prevProps;
    const {events, start = 0} = this.props;
    if(prevEvents !== events || prevStart !== start) {
      this.setState({
        packedEvents: populateEvents(events, width, start, hourOffset)
      });
    }
  }

  componentDidMount() {
    this.props.scrollToFirst && this.scrollToFirst();
    this.props.scrollToTime && this.scrollToTime();
  }

  scrollToFirst() {
    setTimeout(() => {
      if (this.state && this.state._scrollY && this._scrollView) {
        this._scrollView.scrollTo({
          x: 0,
          y: this.state._scrollY,
          animated: true
        });
      }
    }, 1);
  }

  scrollToTime() {
    setTimeout(() => {
      if (this.state && this._scrollView) {
        const {scrollToTime} = this.props;

        this._scrollView.scrollTo({
          x: 0,
          y: this.getTimeHeightOffset(scrollToTime),
          animated: true
        });
      }
    }, 1);
  }

  getTimeHeightOffset (date, ignoreTimezone = false) {
    const {start = 0, end = 24, timezone} = this.props;
    let momentDate = moment(date);
    if (timezone && !ignoreTimezone){
      momentDate = moment(date).tz(timezone)
    }

    const timeHoursFromDayStart = momentDate.diff(momentDate.clone().startOf('day'), 'minutes') / 60;
    return this.calendarHeight * timeHoursFromDayStart / (end - start);
  }

  _renderLines() {
    const {format24h, start = 0, end = 24} = this.props;
    const offset = this.calendarHeight / (end - start);

    return range(start, end + 1).map((i, index) => {
      let timeText;
      if (i === start) {
        timeText = '00:00';
      } else if (i < 12) {
        timeText = !format24h ? `${i} AM` : `${i < 10 ? '0' + i : i}:00`;
      } else if (i === 12) {
        timeText = !format24h ? `${i} PM` : `${i}:00`;
      } else if (i === 24) {
        timeText = !format24h ? '12 AM' : '00:00';
      } else {
        timeText = !format24h ? `${i - 12} PM` : `${i}:00`;
      }
      return [
        <Text
          key={`timeLabel${i}`}
          style={[this.styles.timeLabel, {top: offset * index - 9}]}>
          {timeText}
        </Text>,
        <View
          key={`line${i}`}
          style={[
            this.styles.line,
            {top: offset * index}
          ]}
        />
      ];
    });
  }

  _onEventTapped(event) {
    if(this.props.eventTapped) {
      this.props.eventTapped(event);
    }
  }

  _renderSpecialLines() {
    if (!this.props.lines) return null;
    return this.props.lines.map(lineConfig => this._renderSpecialLine(lineConfig))
  }

  _renderRestTimeBlock() {
    if (!this.props.restTime) return null;

    const { restTime: { restEndTime, Component } } = this.props;
    const offset = this.getTimeHeightOffset(restEndTime, true);
    
    return (
      <Component
        height={offset}
        offset={CALENDAR_VERTICAL_OFFSET}
      />
    );
  }

  _renderSpecialLine(lineConfig){
    const {date, ignoreTimezone, timeTextColor, color, showTime} = lineConfig
    const offset = this.getTimeHeightOffset(date, ignoreTimezone)
    let momentDate = moment(date)
    if (this.props.timezone && !ignoreTimezone){
      momentDate = momentDate.tz(this.props.timezone)
    }
    
    return (
      <>
        <View 
          style={[
            this.styles.line,
            this.styles.specialLine,
            {top: offset, backgroundColor: color}
          ]}
        />
        {showTime && (
          <View style={[this.styles.specialLineTime, {top:offset + 2, backgroundColor: color}]}>
            <Text style={[this.styles.specialLineTimeText, timeTextColor ? {color:timeTextColor} : undefined]}>
              {momentDate.format('HH:mm')}
            </Text>
          </View>
        )}
      </>
    );
  }

  _renderEvents() {
    const {packedEvents} = this.state;
    let events = packedEvents.map((event, i) => {
      const style = {
        left: event.left + this.props.eventRelativeOffsetLeft,
        height: event.height,
        width: event.width,
        top: event.top,
        ...event.style,
      };

      // Fixing the number of lines for the event title makes this calculation easier.
      // However it would make sense to overflow the title to a new line if needed
      const numberOfLines = Math.floor(event.height / TEXT_LINE_HEIGHT);
      const formatTime = this.props.format24h ? 'HH:mm' : 'hh:mm A';
      return (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => this._onEventTapped(this.props.events[event.index])}
          key={i}
          style={[this.styles.event, style]}>
          {this.props.renderEvent ? (
            this.props.renderEvent(event)
          ) : (
            <View>
              <Text numberOfLines={1} style={this.styles.eventTitle}>
                {event.title || 'Event'}
              </Text>
              {numberOfLines > 1 ? (
                <Text
                  numberOfLines={numberOfLines - 1}
                  style={[this.styles.eventSummary]}>
                  {event.summary || ' '}
                </Text>
              ) : null}
              {numberOfLines > 2 ? (
                <Text style={this.styles.eventTimes} numberOfLines={1}>
                  {moment(event.start).format(formatTime)} -{' '}
                  {moment(event.end).format(formatTime)}
                </Text>
              ) : null}
            </View>
          )}
        </TouchableOpacity>
      );
    });

    return (
      <View>
        <View style={{marginLeft: this.props.offsetLeft + this.props.timeTextWidth}}>{events}</View>
      </View>
    );
  }

  render() {
    return (
      <ScrollView
        ref={ref => (this._scrollView = ref)}
        refreshControl={(
          <RefreshControl
            refreshing={this.props.isRefreshing}
            onRefresh={this.props.onRefresh}
          />
        )}
        contentContainerStyle={[
          this.styles.contentStyle,
          {width: dimensionWidth}
        ]}>
        <View style={[
          this.styles.innerContentStyle,
          {width: dimensionWidth}
        ]}>
          {this._renderLines()}
          {this._renderEvents()}
          {this._renderSpecialLines()}
          {this._renderRestTimeBlock()}
        </View>
      </ScrollView>
    );
  }
}