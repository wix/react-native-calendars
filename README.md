# React Native Calendar Components ✨🗓️📆

This module includes various customizeable react native calendar components. The module is both android and ios compatible. Tested with react-native 0.44.0.

## Demo

You can check demo usage in [example module screens](https://github.com/wix-private/wix-react-native-calendar/tree/master/example/src/screens)

You can also run example module by performing these steps:

```
$ git clone git@github.com:wix-private/wix-react-native-calendar.git
$ cd wix-react-native-calendar/example
$ npm install
$ react-native run-ios
```

## Installation

```
$ npm install --save-dev wix-react-native-calendar
```

## Usage

### Calendar

`<Calendar />` - single page calendar, months can be navigated using arrows

* selected - selected day
* current - current visible month
* minDate - minimum date that can be selected, dates before minDate will be grayed out
* style - calendar container style
* hideArrows - hide month navigation arrows (for `<Calendar />`)
* onDayPress - on day press handler which get passed day that was pressed
* hideExtraDays - do not show days of other months in month view
* markedDays - collection of dates that have to be marked in calendar
* markingType - date marking style (normal/interactive)
* displayLoadingIndicator - use only with markedDays. indicator will displayed if some days do not have key in markedDays
* onMonthChange - month change listener (for `<Calendar />`)
* onVisibleMonthsChange - visible months change listener (for `<CalendarList />`)
* disableMonthChange - do not change month when touching day from another mont in cal view (when arrows enabled)

### CalendarList

`<CalendarList />` - scrollable semi-infinite calendar composed of `<Calendar />` components

### Agenda

