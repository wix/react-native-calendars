// @flow
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import populateEvents from './Packer';
import React from 'react';
import moment from 'moment';
import _ from 'lodash';
import styleConstructor from './style';

const LEFT_MARGIN = 60 - 1;
// const RIGHT_MARGIN = 10
// const CALENDER_HEIGHT = 2400;
// const EVENT_TITLE_HEIGHT = 15
const TEXT_LINE_HEIGHT = 17;
// const MIN_EVENT_TITLE_WIDTH = 20
// const EVENT_PADDING_LEFT = 4

function range(from, to) {
  return Array.from(Array(to), (_, i) => from + i);
}

let {width: dimensionWidth} = Dimensions.get('window');

export default class Timeline extends React.PureComponent {
  constructor(props) {
    super(props);
    const {start = 0, end = 24} = this.props;
    this.styles = styleConstructor(props.styles, (end - start) * 100);
    this.calendarHeight = (end - start) * 100;
    const width = dimensionWidth - LEFT_MARGIN;
    const packedEvents = populateEvents(props.events, width, start);
    let initPosition =
      _.min(_.map(packedEvents, 'top')) - this.calendarHeight / (end - start);
    initPosition = initPosition < 0 ? 0 : initPosition;
    this.state = {
      _scrollY: initPosition,
      packedEvents,
    };
  }

  componentWillReceiveProps({events, start = 0}) {
    const width = dimensionWidth - LEFT_MARGIN;
    this.setState({
      packedEvents: populateEvents(events, width, start),
    });
  }

  componentDidMount() {
    this.props.scrollToFirst && this.scrollToFirst();
  }

  scrollToFirst() {
    setTimeout(() => {
      if (this.state && this.state._scrollY && this._scrollView) {
        this._scrollView.scrollTo({
          x: 0,
          y: this.state._scrollY,
          animated: true,
        });
      }
    }, 1);
  }

  // _renderRedLine() {
  //   const offset = 100;
  //   const {start = 0} = this.props;
  //   const timeNowHour = moment().hour();
  //   const timeNowMin = moment().minutes();
  //   return (
  //     <View
  //       key={'timeNow'}
  //       style={[
  //         this.styles.lineNow,
  //         {
  //           top: offset * (timeNowHour - start) + (offset * timeNowMin) / 60,
  //           width: dimensionWidth - 20,
  //         },
  //       ]}
  //     />
  //   );
  // }

  _renderLines() {
    const {format24h, start = 0, end = 24} = this.props;
    const offset = this.calendarHeight / (end - start);

    return range(start, end + 1).map((i, index) => {
      let timeText;
      if (i === start) {
        timeText = '';
      } else if (i < 12) {
        timeText = !format24h ? `${i} AM` : i;
      } else if (i === 12) {
        timeText = !format24h ? `${i} PM` : i;
      } else if (i === 24) {
        timeText = !format24h ? '12 AM' : 0;
      } else {
        timeText = !format24h ? `${i - 12} PM` : i;
      }
      return [
        <Text
          key={`timeLabel${i}`}
          style={[this.styles.timeLabel, {top: offset * index - 6}]}>
          {timeText}
        </Text>,
        i === start ? null : (
          <View
            key={`line${i}`}
            style={[
              this.styles.line,
              {top: offset * index, width: dimensionWidth - 20},
            ]}
          />
        ),
        <View
          key={`lineHalf${i}`}
          style={[
            this.styles.line,
            {top: offset * (index + 0.5), width: dimensionWidth - 20},
          ]}
        />,
      ];
    });
  }

  _renderTimeLabels() {
    const {start = 0, end = 24} = this.props;
    const offset = this.calendarHeight / (end - start);
    return range(start, end).map((item, i) => {
      return (
        <View key={`line${i}`} style={[this.styles.line, {top: offset * i}]} />
      );
    });
  }

  _onEventTapped(event) {
    this.props.eventTapped(event);
  }

  _renderEvents() {
    const {packedEvents} = this.state;
    let events = packedEvents.map((event, i) => {
      const style = {
        left: event.left,
        height: event.height,
        width: event.width,
        top: event.top,
      };

      const eventColor = {
        backgroundColor: event.color,
      };

      // Fixing the number of lines for the event title makes this calculation easier.
      // However it would make sense to overflow the title to a new line if needed
      const numberOfLines = Math.floor(event.height / TEXT_LINE_HEIGHT);
      const formatTime = this.props.format24h ? 'HH:mm' : 'hh:mm A';
      return (
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => this._onEventTapped(this.props.events[event.index])}
          key={i}
          style={[this.styles.event, style, event.color && eventColor]}>
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
        <View style={{marginLeft: LEFT_MARGIN}}>{events}</View>
      </View>
    );
  }

  render() {
    return (
      <ScrollView
        ref={ref => (this._scrollView = ref)}
        contentContainerStyle={[
          this.styles.contentStyle,
          {width: dimensionWidth},
        ]}>
        {this._renderLines()}
        {this._renderEvents()}
        {/* {this._renderRedLine()} */}
      </ScrollView>
    );
  }
}
