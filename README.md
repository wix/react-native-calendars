# React Native Toggle Calendar

Horizontal as well as Grid calendar built on top of [react-native-calendars](https://github.com/wix/react-native-calendars)

### Demo

<img src="https://i.ibb.co/GQRN92K/react-native-toggle-calendar.gif" style="margin: auto;" />

### What's special

`react-native-calendars` has no support for custom header and horizontal scrollable calendar.
This package provides these features along with some other properties like showing loader inside calendar.

### Usage

1. Install this library `yarn add react-native-toggle-calendar`
2. Use in your component like-

```
  import { Calendar } from 'react-native-toggle-calendar';

  <Calendar
    current={this.state.selectedCalendarMonthString}
    minDate={currentDate.format('YYYY-MM-DD')}
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
    horizontalEndReachedThreshold={50}
    horizontalStartReachedThreshold={0}
    loading={this.state.calendarLoading}
    showPastDatesInHorizontal={1}
  />
```


### Available props

All the props of https://github.com/wix/react-native-calendars are supported. Newly added ones are-

```
  // Provide custom calendar header rendering component
  calendarHeaderComponent: PropTypes.any,
  // data which is passed to calendar header, useful only when implementing custom calendar header
  headerData: PropTypes.object,
  // Handler which gets executed when press list icon. It will set calendar to horizontal
  onPressListView: PropTypes.func,
  // Handler which gets executed when press grid icon. It will set calendar to grid
  onPressGridView: PropTypes.func,
  // to show horizontal calendar with scroll
  horizontal: PropTypes.bool,
  // to automatically scroll horizontal calendar to keep selected date in view
  autoHorizontalScroll: PropTypes.bool,
  // how many past days to be shown, if this is set - autoHorizontalScroll will not work
  showPastDatesInHorizontal: PropTypes.number,
  // offset to decide when to trigger onPressArrowRight in horizontal calendar,
  // 0 means when rightmost day is reached, undefined means no auto onPressArrowRight triggering
  horizontalEndReachedThreshold: PropTypes.number,
  // offset to decide when to trigger onPressArrowLeft in horizontal calendar,
  // 0 means when leftmost day is reached, undefined means no auto onPressArrowLeft triggering
  horizontalStartReachedThreshold: PropTypes.number,
  // to show a loader
  loading: PropTypes.bool,
  // provide a custom loader component
  LoaderComponent: PropTypes.any
```

### Sample Calendar Day and Header Components-

Check this gist: https://gist.github.com/varunon9/e204479219a55d86c4d8a985bae4e7f1

### Code changes from original package

Check this PR: https://github.com/varunon9/react-native-toggle-calendar/pull/1

Blog: https://medium.com/@varunon9/how-i-built-horizontal-as-well-as-grid-calendar-in-react-native-using-react-native-calendars-eb7a2edcc5db