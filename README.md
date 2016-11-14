# wix-react-native-calendar

This module includes two components:

`<Calendar />` - embedded calendar, months can be navigated using arrows

`<CalendarList />` - scrollable infinite calendar composed of months

You can check demo usage in [example/index.ios.js](https://github.com/wix-private/wix-react-native-calendar/blob/master/example/index.ios.js)

Calendar components accept these parameters:

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

if parameter value type is date, then valilla JS date, XDate objects and String in format '2012-08-12' are accepted.
