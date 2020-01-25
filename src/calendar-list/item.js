import React, {Component} from 'react';
import {Text, View} from 'react-native';
import Calendar from '../calendar';
import styleConstructor from './style';


class CalendarListItem extends Component {
  static displayName = 'IGNORE';
  
  static defaultProps = {
    hideArrows: true,
    hideExtraDays: true
  };

  constructor(props) {
    super(props);

    this.style = styleConstructor(props.theme);
  }

  shouldComponentUpdate(nextProps) {
    const r1 = this.props.item;
    const r2 = nextProps.item;
    return r1.toString('yyyy MM') !== r2.toString('yyyy MM') || !!(r2.propbump && r2.propbump !== r1.propbump);
  }

  onPressArrowLeft = (_, month) => {
    const monthClone = month.clone();

    if (this.props.onPressArrowLeft) {
      this.props.onPressArrowLeft(_, monthClone);
    } else if (this.props.scrollToMonth) {
      monthClone.addMonths(-1);
      this.props.scrollToMonth(monthClone);
    }
  }

  onPressArrowRight = (_, month) => {
    const monthClone = month.clone();

    if (this.props.onPressArrowRight) {
      this.props.onPressArrowRight(_, monthClone);
    } else if (this.props.scrollToMonth) {
      monthClone.addMonths(1);
      this.props.scrollToMonth(monthClone);
    }
  }

  render() {
    const row = this.props.item;

    if (row.getTime) {
      return (
        <Calendar
          theme={this.props.theme}
          style={[{height: this.props.calendarHeight, width: this.props.calendarWidth}, this.style.calendar, this.props.style]}
          current={row}
          hideArrows={this.props.hideArrows}
          hideExtraDays={this.props.hideExtraDays}
          disableMonthChange
          markedDates={this.props.markedDates}
          markingType={this.props.markingType}
          hideDayNames={this.props.hideDayNames}
          onDayPress={this.props.onDayPress}
          onDayLongPress={this.props.onDayLongPress}
          displayLoadingIndicator={this.props.displayLoadingIndicator}
          minDate={this.props.minDate}
          maxDate={this.props.maxDate}
          firstDay={this.props.firstDay}
          monthFormat={this.props.monthFormat}
          dayComponent={this.props.dayComponent}
          disabledByDefault={this.props.disabledByDefault}
          showWeekNumbers={this.props.showWeekNumbers}
          renderArrow={this.props.renderArrow}
          onPressArrowLeft={this.props.horizontal ? this.onPressArrowLeft : this.props.onPressArrowLeft}
          onPressArrowRight={this.props.horizontal ? this.onPressArrowRight : this.props.onPressArrowRight}
          headerStyle={this.props.horizontal ? this.props.headerStyle : undefined}
        />
      );
    } else {
      const text = row.toString();

      return (
        <View style={[{height: this.props.calendarHeight, width: this.props.calendarWidth}, this.style.placeholder]}>
          <Text allowFontScaling={false} style={this.style.placeholderText}>{text}</Text>
        </View>
      );
    }
  }
}

export default CalendarListItem;
