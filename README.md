# React Native Calendar Components ✨ 🗓️ 📆

This module includes various customizable react native calendar components.

The package is both **Android** and **iOS** compatible.

## Try it out

You can run example module by performing these steps:

```
$ git clone git@github.com:wix-private/wix-react-native-calendar.git
$ cd wix-react-native-calendar/example
$ npm install
$ react-native run-ios
```

You can check example screens source code in [example module screens](https://github.com/wix-private/wix-react-native-calendar/tree/master/example/src/screens)

## Installation

```
$ npm install --save-dev wix-react-native-calendar
```

## Usage

`import {` [Calendar](#calendar), [CalendarList](#calendarlist), [Agenda](#agenda) `} from 'wix-react-native-calendar';`

All parameters for components are optional. By default the month of current local date will be displayed.

Event handler callbacks are called with `calendar objects` like this:

```javasctipt
{
  day: 1,     // day of month (1-31)
  month: 1,   // month of year (1-12)
  year: 2017, // year
  timestamp   // UTC timestamp representing 00:00 AM of this date
}
```

Parameters that require date types accept YYYY-MM-DD formated datestrings, JavaScript date objects, calendar objects and UTC timestamps.

### Calendar

<kbd>
  <img src="https://github.com/wix-private/wix-react-native-calendar/blob/master/demo/calendar.gif?raw=true">
</kbd>

#### Basic parameters

```javascript
<Calendar 
  // Initially visible month. Default = Date()
  current={'2012-03-01'}
  // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
  minDate={'2012-05-10'}
  // Handler which gets executed on day press. Default = undefined
  onDayPress={(day) => {console.log('selected day', day)}}
  // Handler which gets executed when visible month changes in calendar. Default = undefined
  onMonthChange={(month) => {console.log('month changed', month)}
  // Hide month navigation arrows. Default = false
  hideArrows={true}
  // Do not show days of other months in month page. Default = false
  hideExtraDays={true}
  // If hideArrows=false and hideExtraDays=false do not swich month when tapping on greyed out
  // day from another month that is visible in calendar page. Default = false
  disableMonthChange={true}
/>
```

#### Date marking

<kbd>
  <img height=50 src="https://github.com/wix-private/wix-react-native-calendar/blob/master/demo/marking1.png?raw=true">
</kbd>

```javascript
<Calendar 
  // Collection of dates that have to be marked. Default = {}
  markedDates={{'2012-05-16': [true], '2012-05-17': [true]}}
  // Array of dates that should be marked as selected (round circle). Default = []
  selected={['2012-05-16', Date()]}
/>
```

<kbd>
  <img height=50 src="https://github.com/wix-private/wix-react-native-calendar/blob/master/demo/marking2.png?raw=true">
</kbd>

<kbd>
  <img height=50 src="https://github.com/wix-private/wix-react-native-calendar/blob/master/demo/marking3.png?raw=true">
</kbd>

```javascript
<Calendar 
  // Collection of dates that have to be colored in a special way. Default = {}
   markedDates={
    {'2012-05-22': [{startingDay: true, color: 'green'}],
     '2012-05-23': [{endingDay: true, color: 'green'}],
     '2012-05-04': [{startingDay: true, color: 'green'}, {endingDay: true, color: 'green'}]
    }}
  // Date marking style [simple/interactive]. Default = 'simple'
  markingType={'interactive'}
/>
```

#### Displaying data loading indicator

<kbd>
  <img height=50 src="https://github.com/wix-private/wix-react-native-calendar/blob/master/demo/loader.png?raw=true">
</kbd>

The loading indicator next to month name will be displayed if `<Calendar />` has `displayLoadingIndicator` property and `markedDays` collection does not have a value for every day of the month in question. When you load data for days, just set `[]` or special marking value to all days in `markedDates` collection.

#### Customizing look & feel

```javascript
<Calendar 
  // Specify style for calendar container element. Default = {}
  style={{
    borderWidth: 1,
    borderColor: 'gray',
    height: 350
  }}
  // Specify theme properties to override specific styles for calendar parts. Default = {}
  theme={{
      calendarBackground = '#ffffff',
      textSectionTitleColor = '#b6c1cd',
      electedDayBackgroundColor = '#00adf5',
      selectedDayTextColor = '#ffffff',
      todayTextColor = '#00adf5',
      dayTextColor = '#2d4150',
      textDisabledColor = '#d9e1e8',
      dotColor = '#00adf5',
      selectedDotColor = '#ffffff'
  }}
/>
```

### CalendarList

<kbd>
  <img src="https://github.com/wix-private/wix-react-native-calendar/blob/master/demo/calendar-list.gif?raw=true">
</kbd>

`<CalendarList />` - scrollable semi-infinite calendar composed of `<Calendar />` components

* onVisibleMonthsChange - visible months change listener (for `<CalendarList />`)

### Agenda

