import React, { Component } from "react";
import {
  View,
  ViewPropTypes,
  Text,
  FlatList,
  TouchableOpacity
} from "react-native";
import PropTypes from "prop-types";

import XDate from "xdate";
import dateutils from "../dateutils";
import { xdateToData, parseDate } from "../interface";
import styleConstructor from "./style";
import Day from "./day/basic";
import UnitDay from "./day/interactive";
import CalendarHeader from "./header";
import shouldComponentUpdate from "./updater";

//Fallback when RN version is < 0.44
const viewPropTypes = ViewPropTypes || View.propTypes;

class Calendar extends Component {
  static propTypes = {
    // Specify theme properties to override specific styles for calendar parts. Default = {}
    theme: PropTypes.object,
    // Collection of dates that have to be marked. Default = {}
    markedDates: PropTypes.object,

    // Specify style for calendar container element. Default = {}
    style: viewPropTypes.style,

    selected: PropTypes.array,

    // Initially visible month. Default = Date()
    current: PropTypes.any,
    // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
    minDate: PropTypes.any,
    // Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined
    maxDate: PropTypes.any,

    //min year to be shown in year list
    minYear: PropTypes.number,

    //max year to be shown in year list
    maxYear: PropTypes.number,

    // If firstDay=1 week starts from Monday. Note that dayNames and dayNamesShort should still start from Sunday.
    firstDay: PropTypes.number,

    // Date marking style [simple/interactive]. Default = 'simple'
    markingType: PropTypes.string,

    // Hide month navigation arrows. Default = false
    hideArrows: PropTypes.bool,
    // Display loading indicador. Default = false
    displayLoadingIndicator: PropTypes.bool,
    // Do not show days of other months in month page. Default = false
    hideExtraDays: PropTypes.bool,

    // Handler which gets executed on year selection .Default = undefined
    onYearPress: PropTypes.func,
    // Handler which gets executed on day press. Default = undefined
    onDayPress: PropTypes.func,
    // Handler which gets executed when visible month changes in calendar. Default = undefined
    onMonthChange: PropTypes.func,
    onVisibleMonthsChange: PropTypes.func,
    // Replace default arrows with custom ones (direction can be 'left' or 'right')
    renderArrow: PropTypes.func,
    // Month format in calendar title. Formatting values: http://arshaw.com/xdate/#Formatting
    monthFormat: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.style = styleConstructor(this.props.theme);
    let currentMonth;

    if (props.current) {
      currentMonth = parseDate(props.current);
    } else {
      currentMonth =
        props.selected && props.selected[0]
          ? parseDate(props.selected[0])
          : XDate();
    }
    this.state = {
      showYear: false,
      currentMonth
    };

    this.updateMonth = this.updateMonth.bind(this);
    this.addMonth = this.addMonth.bind(this);
    this.toggleShowYear = this.toggleShowYear.bind(this);
    this.addYear = this.addYear.bind(this);
    this.isSelected = this.isSelected.bind(this);
    this.shouldComponentUpdate = shouldComponentUpdate;
  }

  shouldComponentUpdate(nextProps, nextState) {
    console.log("--nextState--", nextState);
    if (nextState.showYear !== this.state.showYear) {
      return true;
    }
    return false;
  }

  componentWillReceiveProps(nextProps) {
    const current = parseDate(nextProps.current);
    if (
      current &&
      current.toString("yyyy MM") !==
        this.state.currentMonth.toString("yyyy MM")
    ) {
      this.setState({
        currentMonth: current.clone()
      });
    }
    console.log("nextProps", nextProps);
  }

  updateMonth(day, doNotTriggerListeners) {
    console.log("day.toString", day.toString("yyyy MM"));
    console.log(
      "this.state.currentMonth.toString",
      this.state.currentMonth.toString("yyyy MM")
    );
    if (
      day.toString("yyyy MM") === this.state.currentMonth.toString("yyyy MM")
    ) {
      return;
    }
    console.log("day.clone", day.clone());
    this.setState(
      {
        currentMonth: day.clone()
      },
      () => {
        if (!doNotTriggerListeners) {
          console.log("doNotTriggerListeners");
          console.log("this.state.currentMonth", this.state.currentMonth);

          const currMont = this.state.currentMonth.clone();
          if (this.props.onMonthChange) {
            this.props.onMonthChange(xdateToData(currMont));
          }
          if (this.props.onVisibleMonthsChange) {
            this.props.onVisibleMonthsChange([xdateToData(currMont)]);
          }
        }
      }
    );
  }

  pressDay(day) {
    console.log("==pressDay==");
    const minDate = parseDate(this.props.minDate);
    const maxDate = parseDate(this.props.maxDate);
    if (
      !(minDate && !dateutils.isGTE(day, minDate)) &&
      !(maxDate && !dateutils.isLTE(day, maxDate))
    ) {
      this.updateMonth(day);
      if (this.props.onDayPress) {
        this.props.onDayPress(xdateToData(day));
      }
    }
  }

  addMonth(count) {
    this.updateMonth(this.state.currentMonth.clone().addMonths(count, true));
  }

  addYear(count) {
    this.updateMonth(this.state.currentMonth.clone().addYears(count, true));
  }

  toggleShowYear() {
    console.log("ToggleShowYear in calendar js");
    var temp = this.state.showYear;
    this.setState({ showYear: !temp });
    console.log("this.state in calendar js ", this.state.showYear);
    this.forceUpdate();
  }

  isSelected(day) {
    let selectedDays = [];
    if (this.props.selected) {
      selectedDays = this.props.selected;
    }
    for (let i = 0; i < selectedDays.length; i++) {
      if (dateutils.sameDate(day, parseDate(selectedDays[i]))) {
        return true;
      }
    }
    return false;
  }

  renderDay(day, id) {
    const minDate = parseDate(this.props.minDate);
    const maxDate = parseDate(this.props.maxDate);
    let state = "";
    if (this.isSelected(day)) {
      state = "selected";
    } else if (
      (minDate && !dateutils.isGTE(day, minDate)) ||
      (maxDate && !dateutils.isLTE(day, maxDate))
    ) {
      state = "disabled";
    } else if (!dateutils.sameMonth(day, this.state.currentMonth)) {
      state = "disabled";
    } else if (dateutils.sameDate(day, XDate())) {
      state = "today";
    }
    let dayComp;
    if (
      !dateutils.sameMonth(day, this.state.currentMonth) &&
      this.props.hideExtraDays
    ) {
      if (this.props.markingType === "interactive") {
        dayComp = <View key={id} style={{ flex: 1 }} />;
      } else {
        dayComp = <View key={id} style={{ width: 32 }} />;
      }
    } else {
      const DayComp = this.props.markingType === "interactive" ? UnitDay : Day;
      const markingExists = this.props.markedDates ? true : false;
      dayComp = (
        <DayComp
          key={id}
          state={state}
          theme={this.props.theme}
          onPress={this.pressDay.bind(this, day)}
          marked={this.getDateMarking(day)}
          markingExists={markingExists}
        >
          {day.getDate()}
        </DayComp>
      );
    }
    return dayComp;
  }

  getDateMarking(day) {
    if (!this.props.markedDates) {
      return false;
    }
    const dates = this.props.markedDates[day.toString("yyyy-MM-dd")] || [];
    if (dates.length || dates) {
      return dates;
    } else {
      return false;
    }
  }

  renderWeek(days, id) {
    const week = [];
    days.forEach((day, id2) => {
      week.push(this.renderDay(day, id2));
    }, this);
    return (
      <View style={this.style.week} key={id}>
        {week}
      </View>
    );
  }

  renderYear() {
    const year = [];
    for (let i = 0; i < this.props.maxYear - this.props.minYear + 1; i++) {
      year[i] = { key: this.props.minYear + i };
    }
    return (
      <FlatList
        style={{ marginTop: 20, marginBottom: 20 }}
        data={year}
        renderItem={({ item }) =>
          <TouchableOpacity
            onPress={() => {
              console.log("item.key", typeof item.key);
              console.log(
                "this.state.currentMonth",
                this.state.currentMonth.getFullYear()
              );
              console.log(
                "item.key - this.state.currentMonth.getYear",
                item.key - this.state.currentMonth.getFullYear()
              );
              this.addYear(item.key - this.state.currentMonth.getFullYear());
            }}
          >
            <Text style={this.style.yearText}>
              {item.key}
            </Text>
          </TouchableOpacity>}
      />
    );
  }

  render() {
    const list = this.renderYear();
    const days = dateutils.page(this.state.currentMonth, this.props.firstDay);
    const weeks = [];
    while (days.length) {
      weeks.push(this.renderWeek(days.splice(0, 7), weeks.length));
    }
    let indicator;
    const current = parseDate(this.props.current);
    if (current) {
      const lastMonthOfDay = current
        .clone()
        .addMonths(1, true)
        .setDate(1)
        .addDays(-1)
        .toString("yyyy-MM-dd");
      if (
        this.props.displayLoadingIndicator &&
        !(this.props.markedDates && this.props.markedDates[lastMonthOfDay])
      ) {
        indicator = true;
      }
    }
    if (this.state.showYear) {
      return (
        <View style={[this.style.container, this.props.style]}>
          <CalendarHeader
            theme={this.props.theme}
            hideArrows={false}
            month={this.state.currentMonth}
            addMonth={this.addMonth}
            showIndicator={indicator}
            firstDay={this.props.firstDay}
            renderArrow={this.props.renderArrow}
            monthFormat={this.props.monthFormat}
            toggleShowYear={this.toggleShowYear}
          />
          {list}
        </View>
      );
    }
    return (
      <View style={[this.style.container, this.props.style]}>
        <CalendarHeader
          theme={this.props.theme}
          hideArrows={this.props.hideArrows}
          month={this.state.currentMonth}
          addMonth={this.addMonth}
          showIndicator={indicator}
          firstDay={this.props.firstDay}
          renderArrow={this.props.renderArrow}
          monthFormat={this.props.monthFormat}
          toggleShowYear={this.toggleShowYear}
        />
        {weeks}
      </View>
    );
  }
}

Calendar.defaultProps = {
  minYear: 1900,
  maxYear: new Date().getFullYear()
};

export default Calendar;
