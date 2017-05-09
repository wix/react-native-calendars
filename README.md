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

Parameters that require date types accept YYYY-MM-DD formated datestrings, JavaScript date objects, `calendar objects` and UTC timestamps.

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
    calendarBackground: '#ffffff',
    textSectionTitleColor: '#b6c1cd',
    selectedDayBackgroundColor: '#00adf5',
    selectedDayTextColor: '#ffffff',
    todayTextColor: '#00adf5',
    dayTextColor: '#2d4150',
    textDisabledColor: '#d9e1e8',
    dotColor: '#00adf5',
    selectedDotColor: '#ffffff',
    arrowColor: 'orange',
    monthTextColor: 'blue'
  }}
/>
```

### CalendarList

<kbd>
  <img src="https://github.com/wix-private/wix-react-native-calendar/blob/master/demo/calendar-list.gif?raw=true">
</kbd>

`<CalendarList />` is scrollable semi-infinite calendar composed of `<Calendar />` components. Currently it is possible to scroll 4 years back and 4 years to the future. All paramters that are available for `<Calendar />` are also available for this component. There are also some additional params that can be used:

```javascript
<CalendarList
  // Callback which gets executed when visible months change in scroll view. Default = undefined
  onVisibleMonthsChange={(months) => {console.log('now these months are visible', months);}
  // Enable or disable scrolling of calendar list
  scrollEnabled={true}
  ...calendarParams
/>
```

### Agenda

<kbd>
  <img src="https://github.com/wix-private/wix-react-native-calendar/blob/master/demo/agenda.gif?raw=true">
</kbd>

An advanced agenda component that can display listings for calendar day items.

```javascript
<Agenda
  // the list of items that have to be displayed in agenda
  items={
    {'2012-05-22': [{text: 'item 1 - any js object'}],
     '2012-05-23': [{text: 'item 2 - any js object'}]],
     '2012-05-04': [{text: 'item 3 - any js object'}], {text: 'any js object'}]]
    }}
  // callback that gets called when items for a certain month should be loaded (month became visible)
  loadItemsForMonth={(mongh) => {console.log('trigger items loading')}
  // callback that gets called on day press
  onDayPress={(day)=>{console.log('day pressed'}}
  // initially selected day
  selected={'2012-05-16'}
  // specify how each item should be rendered in agenda
  renderItem={(item) => {return (<View />);}}
  // specify how empty date content with no items should be rendered
  renderEmptyDate={() => {return (View />);}}
  // specify your item comparison function for increased performance
  rowHasChanged={(r1, r2) => {return r1.text !== r2.text}}
  // agenda theme
  theme = {{}}
  // agenda container style
  style = {{}} 
/>
```

## Authors

* [Tautvilas Mecinskas](https://github.com/tautvilas/) - Initial code - [@tautvilas](https://twitter.com/TautviIas)
* Katrin Zotchev - Initial design - [@katrin_zot](https://twitter.com/katrin_zot)

See also the list of [contributors](https://github.com/wix/react-native-calendar-components/contributors) who participated in this project.

## Contributing

Pull requests are welcome. `npm run test` and `npm run lint` before push.
