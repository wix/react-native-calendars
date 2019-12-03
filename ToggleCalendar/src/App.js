/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';
import { Calendar } from 'react-native-toggle-calendar';
import moment from 'moment';

import CalendarDayComponent from './components/CalendarDayComponent';
import CalendarHeaderComponent from './components/CalendarHeaderComponent';
import CalendarFooterComponent from './components/CalendarFooterComponent';

let selectedCalendarDate = moment();
const minimumDate = moment().add(-1, 'day'); // one day before for midnight check-in usecase
const currentDate = moment();

class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      selectedCalendarDateString: selectedCalendarDate.format('YYYY-MM-DD'),
      selectedCalendarMonthString: selectedCalendarDate.format('YYYY-MM-DD'),
      calendarHeaderData: {},
      calendarMarkedDates: {
        '2019-09-01': {
          fullySoldOut: false,
          partiallySoldOut: false,
          fullyBlocked: false,
          partiallyBlocked: true,
          inventory: 14,
          highDemand: false,
          selected: false
        },
        '2019-10-01': {
          fullySoldOut: false,
          partiallySoldOut: false,
          fullyBlocked: false,
          partiallyBlocked: true,
          inventory: 14,
          highDemand: true,
          selected: false
        },
        '2019-11-01': {
          fullySoldOut: false,
          partiallySoldOut: false,
          fullyBlocked: false,
          partiallyBlocked: true,
          inventory: 14,
          highDemand: false,
          selected: false
        }
      },
      horizontal: true,
      ratesInventoryDataArray: [],
      saveButtonClicked: false,
      calendarLoading: true
    };

    this.onPressArrowLeft = this.onPressArrowLeft.bind(this);
    this.onPressArrowRight = this.onPressArrowRight.bind(this);
    this.onPressListView = this.onPressListView.bind(this);
    this.onPressGridView = this.onPressGridView.bind(this);
  }

  updateSelectedCalendarMonth(selectedCalendarMonthString) {
    this.setState({
      selectedCalendarMonthString,
      calendarLoading: true
    });
  }

  onDayPress(date) {
    selectedCalendarDate = moment(date.dateString);
    const selectedCalendarDateString = selectedCalendarDate.format(
      'YYYY-MM-DD'
    );
    this.setState({
      ratesInventoryDataArray: [], // reset inventory data
      selectedCalendarDateString,
      selectedCalendarMonthString: selectedCalendarDateString
    });
    /*this.fetchDemandData(selectedCalendarDateString);
    this.fetchMultiDaysInventoryData(selectedCalendarDateString);
    this.fetchRatesAndInventoryData(selectedCalendarDateString);*/
  }

  onPressArrowLeft(currentMonth, addMonthCallback) {
    const monthStartDate = moment(currentMonth.getTime()).startOf('month');

    // don't go back for past months
    if (monthStartDate > currentDate) {
      addMonthCallback(-1);
      const selectedCalendarMonthString = moment(currentMonth.getTime())
        .add(-1, 'month')
        .format('YYYY-MM-DD');
      this.updateSelectedCalendarMonth(selectedCalendarMonthString);
    }
  }

  onPressArrowRight(currentMonth, addMonthCallback) {
    addMonthCallback(1);
    const selectedCalendarMonthString = moment(currentMonth.getTime())
      .add(1, 'month')
      .format('YYYY-MM-DD');
    this.updateSelectedCalendarMonth(selectedCalendarMonthString);
  }

  onPressListView() {
    this.setState({ horizontal: true });
  }

  onPressGridView() {
    this.setState({ horizontal: false });
  }

  render() {
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView>
          <Calendar
            current={this.state.selectedCalendarMonthString}
            minDate={minimumDate.format('YYYY-MM-DD')}
            dayComponent={CalendarDayComponent}
            calendarHeaderComponent={CalendarHeaderComponent}
            headerData={this.state.calendarHeaderData}
            style={styles.calendar}
            onPressArrowLeft={this.onPressArrowLeft}
            onPressArrowRight={this.onPressArrowRight}
            onPressListView={this.onPressListView}
            onPressGridView={this.onPressGridView}
            markedDates={this.state.calendarMarkedDates}
            horizontal={this.state.horizontal}
            onDayPress={this.onDayPress}
            showPastDatesInHorizontal={1}
            horizontalEndReachedThreshold={50}
            horizontalStartReachedThreshold={0}
            loading={this.state.calendarLoading}
          />
          <CalendarFooterComponent
            calendarDateString={selectedCalendarDate.format('DD MMM, YYYY')}
          />
        </SafeAreaView>
      </>
    );
  }
};

const styles = StyleSheet.create({
  scrollView: {
  }
});

export default App;
