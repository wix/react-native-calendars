Calendar component  
[(code example)](https://github.com/wix/react-native-calendars/blob/master/example/src/screens/calendars.tsx)
:::info
This component extends **[CalendarHeader, BasicDay](https://github.com/wix/react-native-calendars/blob/master/src/calendar/header/index.tsx,https://github.com/wix/react-native-calendars/blob/master/src/calendar/day/basic/index.tsx)** props.
:::

<div style={{display: 'flex', flexDirection: 'row', overflowX: 'auto', maxHeight: '500px', alignItems: 'center'}}><img style={{maxHeight: '420px'}} src={'https://github.com/wix/react-native-calendars/blob/master/demo/assets/calendar.gif?raw=true'}/>

</div>

## API

### theme

Specify theme properties to override specific styles for calendar parts  
<span style={{color: 'grey'}}>Theme</span>

### style

Specify style for calendar container element  
<span style={{color: 'grey'}}>ViewStyle</span>

### headerStyle

Specify style for calendar header  
<span style={{color: 'grey'}}>ViewStyle</span>

### customHeader

Allow rendering a totally custom header  
<span style={{color: 'grey'}}>any</span>

### initialDate

Initially visible month  
<span style={{color: 'grey'}}>string</span>

### minDate

Minimum date that can be selected, dates before minDate will be grayed out  
<span style={{color: 'grey'}}>string</span>

### maxDate

Maximum date that can be selected, dates after maxDate will be grayed out  
<span style={{color: 'grey'}}>string</span>

### firstDay

If firstDay=1 week starts from Monday. Note that dayNames and dayNamesShort should still start from Sunday  
<span style={{color: 'grey'}}>number</span>

### markedDates

Collection of dates that have to be marked  
<span style={{color: 'grey'}}>MarkedDatesType</span>

### displayLoadingIndicator

Whether to display loading indicator  
<span style={{color: 'grey'}}>boolean</span>

### showWeekNumbers

Whether to show weeks numbers  
<span style={{color: 'grey'}}>boolean</span>

### hideExtraDays

Whether to hide days of other months in the month page  
<span style={{color: 'grey'}}>boolean</span>

### showSixWeeks

Whether to always show six weeks on each month (when hideExtraDays = false)  
<span style={{color: 'grey'}}>boolean</span>

### disableMonthChange

Whether to disable changing month when click on days of other months (when hideExtraDays is false)  
<span style={{color: 'grey'}}>boolean</span>

### enableSwipeMonths

Whether to enable the option to swipe between months  
<span style={{color: 'grey'}}>boolean</span>

### disabledByDefault

Whether to disable days by default  
<span style={{color: 'grey'}}>boolean</span>

### allowSelectionOutOfRange

Whether to allow selection of dates before minDate or after maxDate  
<span style={{color: 'grey'}}>boolean</span>

### onDayPress

Handler which gets executed on day press  
<span style={{color: 'grey'}}>(date: DateData) => void</span>

### onDayLongPress

Handler which gets executed on day long press  
<span style={{color: 'grey'}}>(date: DateData) => void</span>

### onMonthChange

Handler which gets executed when month changes in calendar  
<span style={{color: 'grey'}}>(date: DateData) => void</span>

### onVisibleMonthsChange

Handler which gets executed when visible month changes in calendar  
<span style={{color: 'grey'}}>(months: DateData[]) => void</span>

### monthFormat

Month format for the header's title. Formatting values: http://arshaw.com/xdate/#Formatting  
<span style={{color: 'grey'}}>string</span>

### hideDayNames

Whether to hide the days names  
<span style={{color: 'grey'}}>boolean</span>

### hideArrows

Whether to hide the arrows  
<span style={{color: 'grey'}}>boolean</span>

### arrowsHitSlop

Left & Right arrows. Additional distance outside of the buttons in which a press is detected, default: 20
<span style={{color: 'grey'}}>null | Insets | number</span>

### disableArrowLeft

Whether to disable the left arrow  
<span style={{color: 'grey'}}>boolean</span>

### disableArrowRight

Whether to disable the right arrow  
<span style={{color: 'grey'}}>boolean</span>

### renderArrow

Replace default arrows with custom ones (direction: 'left' | 'right')  
<span style={{color: 'grey'}}>(direction: Direction) => ReactNode</span>

### onPressArrowLeft

Handler which gets executed when press left arrow. It receive a callback to go to the previous month  
<span style={{color: 'grey'}}>(method: () => void, month?: string) => void</span>

### onPressArrowRight

Handler which gets executed when press right arrow. It receive a callback to go to the next month  
<span style={{color: 'grey'}}>(method: () => void, month?: string) => void</span>

### disabledDaysIndexes

Whether to apply custom disable color to selected day indexes  
<span style={{color: 'grey'}}>number[]</span>

### renderHeader

Replace default title with custom one  
<span style={{color: 'grey'}}>(date?: string) => ReactNode</span>

### customHeaderTitle

Replace default title with custom element  
<span style={{color: 'grey'}}>JSX.Element</span>

### dayComponent

Replace default day with custom day rendering component  
<span style={{color: 'grey'}}>JSX.Element</span>

### disableAllTouchEventsForDisabledDays

Whether to disable all touch events for disabled days (can be override with 'disableTouchEvent' in 'markedDates')  
<span style={{color: 'grey'}}>boolean</span>

### disableAllTouchEventsForInactiveDays

Whether to disable all touch events for inactive days (can be override with 'disableTouchEvent' in 'markedDates')  
<span style={{color: 'grey'}}>boolean</span>
