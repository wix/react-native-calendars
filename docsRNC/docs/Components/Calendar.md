Calendar component  
[(code example)](https://github.com/wix/react-native-calendars/blob/master/example/src/screens/calendarScreen.tsx)
:::info
This component extends **[CalendarHeader](https://github.com/wix/react-native-calendars/blob/master/src/calendar/header/index.tsx), [BasicDay](https://github.com/wix/react-native-calendars/blob/master/src/calendar/day/basic/index.tsx)** props.
:::

<div style={{display: 'flex', flexDirection: 'row', overflowX: 'auto', maxHeight: '500px', alignItems: 'center'}}>
  <img style={{maxHeight: '420px'}} src={'https://github.com/wix/react-native-calendars/blob/master/demo/assets/calendar.gif?raw=true'}/>
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

Whether to apply custom disable color to selected day names indexes  
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

<br/>

## Calendar Examples

<br/>

#### Basic parameters

```javascript
<Calendar
  // Initially visible month. Default = now
  initialDate={'2012-03-01'}
  // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
  minDate={'2012-05-10'}
  // Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined
  maxDate={'2012-05-30'}
  // Handler which gets executed on day press. Default = undefined
  onDayPress={day => {
    console.log('selected day', day);
  }}
  // Handler which gets executed on day long press. Default = undefined
  onDayLongPress={day => {
    console.log('selected day', day);
  }}
  // Month format in calendar title. Formatting values: http://arshaw.com/xdate/#Formatting
  monthFormat={'yyyy MM'}
  // Handler which gets executed when visible month changes in calendar. Default = undefined
  onMonthChange={month => {
    console.log('month changed', month);
  }}
  // Hide month navigation arrows. Default = false
  hideArrows={true}
  // Replace default arrows with custom ones (direction can be 'left' or 'right')
  renderArrow={direction => <Arrow />}
  // Do not show days of other months in month page. Default = false
  hideExtraDays={true}
  // If hideArrows = false and hideExtraDays = false do not switch month when tapping on greyed out
  // day from another month that is visible in calendar page. Default = false
  disableMonthChange={true}
  // If firstDay=1 week starts from Monday. Note that dayNames and dayNamesShort should still start from Sunday
  firstDay={1}
  // Hide day names. Default = false
  hideDayNames={true}
  // Show week numbers to the left. Default = false
  showWeekNumbers={true}
  // Handler which gets executed when press arrow icon left. It receive a callback can go back month
  onPressArrowLeft={subtractMonth => subtractMonth()}
  // Handler which gets executed when press arrow icon right. It receive a callback can go next month
  onPressArrowRight={addMonth => addMonth()}
  // Disable left arrow. Default = false
  disableArrowLeft={true}
  // Disable right arrow. Default = false
  disableArrowRight={true}
  // Disable all touch events for disabled days. can be override with disableTouchEvent in markedDates
  disableAllTouchEventsForDisabledDays={true}
  // Replace default month and year title with custom one. the function receive a date as parameter
  renderHeader={date => {
    /*Return JSX*/
  }}
  // Enable the option to swipe between months. Default = false
  enableSwipeMonths={true}
/>
```

#### Date marking

**Disclaimer**: Make sure that `markedDates` param is immutable. If you change `markedDates` object content but the reference to it does not change calendar update will not be triggered.

- Dot marking

  <img height={50} src="https://github.com/wix-private/wix-react-native-calendar/blob/master/demo/assets/marking1.png?raw=true"/>

```javascript
<Calendar
  // Collection of dates that have to be marked. Default = {}
  markedDates={{
    '2012-05-16': {selected: true, marked: true, selectedColor: 'blue'},
    '2012-05-17': {marked: true},
    '2012-05-18': {marked: true, dotColor: 'red', activeOpacity: 0},
    '2012-05-19': {disabled: true, disableTouchEvent: true}
  }}
/>
```

You can customize a dot color for each day independently.

- Multi-Dot marking

 <img height={50} src="https://github.com/wix-private/wix-react-native-calendar/blob/master/demo/assets/marking4.png?raw=true"/>

Use `markingType={'multi-dot'}` if you want to display more than one dot. Both the `<Calendar/>` and `<CalendarList/>` support multiple dots by using `dots` array in `markedDates` prop.
The property `color` is mandatory while `key` and `selectedColor` are optional. If key is omitted then the array index is used as key. If `selectedColor` is omitted then `color` will be used for selected dates.

```javascript
const vacation = {key: 'vacation', color: 'red', selectedDotColor: 'blue'};
const massage = {key: 'massage', color: 'blue', selectedDotColor: 'blue'};
const workout = {key: 'workout', color: 'green'};

<Calendar
  markingType={'multi-dot'}
  markedDates={{
    '2017-10-25': {dots: [vacation, massage, workout], selected: true, selectedColor: 'red'},
    '2017-10-26': {dots: [massage, workout], disabled: true}
  }}
/>;
```

- Period marking

  <img height={50} src="https://github.com/wix-private/wix-react-native-calendar/blob/master/demo/assets/marking2.png?raw=true"/>

  <img height={50} src="https://github.com/wix-private/wix-react-native-calendar/blob/master/demo/assets/marking3.png?raw=true"/>

```javascript
<Calendar
  markingType={'period'}
  markedDates={{
    '2012-05-20': {textColor: 'green'},
    '2012-05-22': {startingDay: true, color: 'green'},
    '2012-05-23': {selected: true, endingDay: true, color: 'green', textColor: 'gray'},
    '2012-05-04': {disabled: true, startingDay: true, color: 'green', endingDay: true}
  }}
/>
```

- Multi-period marking

  <img height={50} src="https://github.com/wix-private/wix-react-native-calendar/blob/master/demo/assets/marking6.png?raw=true"/>

**CAUTION**: This marking is only fully supported by the `<Calendar/>` component because it expands its height. Usage with `<CalendarList/>` might lead to overflow issues.

```javascript
<Calendar
  markingType="multi-period"
  markedDates={{
    '2017-12-14': {
      periods: [
        {startingDay: false, endingDay: true, color: '#5f9ea0'},
        {startingDay: false, endingDay: true, color: '#ffa500'},
        {startingDay: true, endingDay: false, color: '#f0e68c'}
      ]
    },
    '2017-12-15': {
      periods: [
        {startingDay: true, endingDay: false, color: '#ffa500'},
        {color: 'transparent'},
        {startingDay: false, endingDay: false, color: '#f0e68c'}
      ]
    }
  }}
/>
```

- Custom marking (allows you to customize each marker with custom styles)

  <img height={50} src="https://github.com/wix-private/wix-react-native-calendar/blob/master/demo/assets/marking5.png?raw=true"/>

```javascript
<Calendar
  markingType={'custom'}
  markedDates={{
    '2018-03-28': {
      customStyles: {
        container: {
          backgroundColor: 'green'
        },
        text: {
          color: 'black',
          fontWeight: 'bold'
        }
      }
    },
    '2018-03-29': {
      customStyles: {
        container: {
          backgroundColor: 'white',
          elevation: 2
        },
        text: {
          color: 'blue'
        }
      }
    }
  }}
/>
```

**NEW!** While we still don't support multi marking type, we add the possibility to combine between `period` and `dot`.

```javascript
<Calendar
  markingType={'period'}
  markedDates={{
    '2012-05-15': {marked: true, dotColor: '#50cebb'},
    '2012-05-16': {marked: true, dotColor: '#50cebb'},
    '2012-05-21': {startingDay: true, color: '#50cebb', textColor: 'white'},
    '2012-05-22': {color: '#70d7c7', textColor: 'white'},
    '2012-05-23': {color: '#70d7c7', textColor: 'white', marked: true, dotColor: 'white'},
    '2012-05-24': {color: '#70d7c7', textColor: 'white'},
    '2012-05-25': {endingDay: true, color: '#50cebb', textColor: 'white'}
  }}
/>
```

  <img height={350} src="https://github.com/wix-private/wix-react-native-calendar/blob/master/demo/assets/multi-marking.png?raw=true"/>

Keep in mind that different marking types are not compatible. You can use just one marking style for a calendar.

#### Displaying data loading indicator

  <img height={50} src="https://github.com/wix-private/wix-react-native-calendar/blob/master/demo/assets/loader.png?raw=true"/>

The loading indicator next to the month name will be displayed if `<Calendar/>` has `displayLoadingIndicator` prop and the `markedDates` collection does not have a value for every day of the month in question. When you load data for days, just set `[]` or special marking value to all days in `markedDates` collection.

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
    backgroundColor: '#ffffff',
    calendarBackground: '#ffffff',
    textSectionTitleColor: '#b6c1cd',
    textSectionTitleDisabledColor: '#d9e1e8',
    selectedDayBackgroundColor: '#00adf5',
    selectedDayTextColor: '#ffffff',
    todayTextColor: '#00adf5',
    dayTextColor: '#2d4150',
    textDisabledColor: '#d9e1e8',
    dotColor: '#00adf5',
    selectedDotColor: '#ffffff',
    arrowColor: 'orange',
    disabledArrowColor: '#d9e1e8',
    monthTextColor: 'blue',
    indicatorColor: 'blue',
    textDayFontFamily: 'monospace',
    textMonthFontFamily: 'monospace',
    textDayHeaderFontFamily: 'monospace',
    textDayFontWeight: '300',
    textMonthFontWeight: 'bold',
    textDayHeaderFontWeight: '300',
    textDayFontSize: 16,
    textMonthFontSize: 16,
    textDayHeaderFontSize: 16
  }}
/>
```

#### Customize days titles with disabled styling

```javascript
<Calendar
  theme={{
    textSectionTitleDisabledColor: '#d9e1e8'
  }}
  markedDates={{
    ...this.getDisabledDates('2012-05-01', '2012-05-30', [0, 6])
  }}
  disabledDaysIndexes={[0, 6]}
/>
```

#### Advanced styling

If you want to have complete control over the calendar styles you can do it by overriding default `style.ts` files. For example, if you want to override `<CalendarHeader/>` style first you have to find stylesheet id for this file:

https://github.com/wix/react-native-calendars/blob/master/src/calendar/header/style.ts#L60

In this case it is `stylesheet.calendar.header`. Next you can add overriding stylesheet to your theme with this id.

https://github.com/wix/react-native-calendars/blob/master/example/src/screens/calendars.tsx#L142

```javascript
theme={{
  arrowColor: 'white',
  'stylesheet.calendar.header': {
    week: {
      marginTop: 5,
      flexDirection: 'row',
      justifyContent: 'space-between'
    }
  }
}}
```

#### Individual day header styling

Using the above advanced styling, it is possible to set styles independently for each day's header. If we wanted to make the header for Sunday red, and Saturday blue, we could write something like the following:

```javascript
theme={{
  'stylesheet.calendar.header': {
    dayTextAtIndex0: {
      color: 'red'
    },
    dayTextAtIndex6: {
      color: 'blue'
    }
  }
}}
```

  <img height={50} src="https://github.com/wix-private/wix-react-native-calendar/blob/master/demo/assets/day-header-style.png?raw=true"/>

**Disclaimer**: Issues that arise because something breaks after using stylesheet override will not be supported. Use this option at your own risk.

#### Overriding day component

If you need custom functionality not supported by current day component implementations you can pass your own custom day component to the calendar.

```javascript
<Calendar
  style={[styles.calendar, {height: 300}]}
  dayComponent={({date, state}) => {
    return (
      <View>
        <Text style={{textAlign: 'center', color: state === 'disabled' ? 'gray' : 'black'}}>{date.day}</Text>
      </View>
    );
  }}
/>
```

The `dayComponent` prop has to receive a RN component or a function that receive props. The `dayComponent` will receive such props:

- state - disabled if the day should be disabled (this is decided by base calendar component).
- marking - `markedDates` value for this day.
- date - the date object representing this day.

**Tip**: Don't forget to implement `shouldComponentUpdate()` for your custom day component to make the calendar perform better

If you implement an awesome day component please make a PR so that other people could use it :)
